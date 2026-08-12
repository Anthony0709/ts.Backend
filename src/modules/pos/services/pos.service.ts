import { Prisma, EstadoCaja, EstadoVenta, TipoMovimientoCaja, MetodoPago } from '@prisma/client';
import prisma from '../../../config/prisma';
import { AppError } from '../../../utils/AppError';
import { ProcesarVentaPOSDto, BuscarProductosPOSDto, BuscarClientesPOSDto, ConsultarCajaPOSDto, ConsultarResumenCajaPOSDto } from '../dto/pos.dto';

export class PosService {
  async procesarVenta(empresaId: string, usuarioId: string, data: ProcesarVentaPOSDto) {
    const caja = await prisma.caja.findFirst({
      where: {
        id: data.cajaId,
        empresaId,
        estado: EstadoCaja.ABIERTA
      }
    });
    if (!caja) {
      throw new AppError('La caja no existe, no pertenece a la empresa o está cerrada.', 404);
    }
    const cliente = await prisma.cliente.findFirst({
      where: {
        id: data.clienteId,
        empresaId,
        estado: true
      }
    });
    if (!cliente) {
      throw new AppError('El cliente no existe, está inactivo o no pertenece a la empresa.', 404);
    }
    const productoIds = data.detalles.map(detalle => detalle.productoId);
    const productos = await prisma.producto.findMany({
      where: {
        id: {
          in: productoIds
        },
        empresaId,
        estado: true
      }
    });
    if (productos.length !== productoIds.length) {
      throw new AppError('Uno o más productos no existen, están inactivos o no pertenecen a la empresa.', 400);
    }
    const productosMap = new Map(productos.map(producto => [producto.id, producto]));
    let subtotal = new Prisma.Decimal(0);
    for (const detalle of data.detalles) {
      const producto = productosMap.get(detalle.productoId);
      if (!producto) {
        throw new AppError('Producto no encontrado.', 404);
      }
      if (new Prisma.Decimal(detalle.precio).lessThan(0)) {
        throw new AppError(`El precio del producto ${producto.nombre} no puede ser negativo.`, 400);
      }
      const subtotalDetalle = new Prisma.Decimal(detalle.cantidad).mul(new Prisma.Decimal(detalle.precio));
      subtotal = subtotal.add(subtotalDetalle);
    }
    const descuento = new Prisma.Decimal(data.descuento ?? 0);
    if (descuento.greaterThan(subtotal)) {
      throw new AppError('El descuento no puede ser mayor al subtotal.', 400);
    }
    const total = subtotal.sub(descuento);
    const totalPagado = data.pagos.reduce((sum, pago) => sum.add(new Prisma.Decimal(pago.monto)), new Prisma.Decimal(0));
    if (!totalPagado.equals(total)) {
      throw new AppError('La suma de los pagos debe coincidir con el total de la venta.', 400);
    }
    const pagoCredito = data.pagos.find(pago => pago.metodoPago === MetodoPago.CREDITO);
    if (pagoCredito && !cliente.limiteCredito) {
      throw new AppError('El cliente no tiene límite de crédito configurado.', 400);
    }
    if (pagoCredito) {
      if (data.pagos.length !== 1) {
        throw new AppError('Una venta a crédito no puede combinarse con otro método de pago.', 400);
      }
      if (cliente.limiteCredito && new Prisma.Decimal(pagoCredito.monto).greaterThan(new Prisma.Decimal(cliente.limiteCredito))) {
        throw new AppError('El monto de la venta supera el límite de crédito del cliente.', 400);
      }
    }
    const numero = await this.generarNumeroVenta(empresaId);
    const venta = await prisma.$transaction(async tx => {
      const nuevaVenta = await tx.venta.create({
        data: {
          numero,
          clienteId: cliente.id,
          empresaId,
          estado: EstadoVenta.APROBADA,
          observacion: data.observacion?.trim(),
          subtotal,
          impuesto: new Prisma.Decimal(0),
          total,
          detalles: {
            create: data.detalles.map(detalle => ({
              productoId: detalle.productoId,
              cantidad: detalle.cantidad,
              precio: new Prisma.Decimal(detalle.precio),
              subtotal: new Prisma.Decimal(detalle.precio).mul(detalle.cantidad)
            }))
          }
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              identificacion: true,
              razonSocial: true,
              nombreComercial: true
            }
          },
          detalles: {
            include: {
              producto: {
                select: {
                  id: true,
                  codigo: true,
                  sku: true,
                  codigoBarras: true,
                  nombre: true,
                  precioVenta: true
                }
              }
            }
          }
        }
      });
      for (const pago of data.pagos) {
        await tx.movimientoCaja.create({
          data: {
            cajaId: caja.id,
            tipo: TipoMovimientoCaja.VENTA,
            descripcion: `Venta POS ${nuevaVenta.numero}`,
            monto: new Prisma.Decimal(pago.monto),
            metodoPago: pago.metodoPago,
            referencia: pago.referencia,
            ventaId: nuevaVenta.id,
            usuarioId
          }
        });
      }
      return nuevaVenta;
    });
    return {
      venta,
      cajaId: caja.id,
      pagos: data.pagos
    };
  }
  async buscarProductos(empresaId: string, query: BuscarProductosPOSDto) {
    return prisma.producto.findMany({
      where: {
        empresaId,
        estado: true,
        ...(query.search ? {
          OR: [
            {
              nombre: {
                contains: query.search,
                mode: 'insensitive'
              }
            },
            {
              codigo: {
                contains: query.search,
                mode: 'insensitive'
              }
            },
            {
              sku: {
                contains: query.search,
                mode: 'insensitive'
              }
            },
            {
              codigoBarras: {
                contains: query.search,
                mode: 'insensitive'
              }
            }
          ]
        } : {}),
        ...(query.categoriaId ? {
          categoriaId: query.categoriaId
        } : {})
      },
      take: query.limit ?? 20,
      orderBy: {
        nombre: 'asc'
      },
      select: {
        id: true,
        codigo: true,
        sku: true,
        codigoBarras: true,
        nombre: true,
        descripcion: true,
        imagen: true,
        precioVenta: true,
        estado: true,
        categoria: {
          select: {
            id: true,
            nombre: true
          }
        },
        marca: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
  }
  async buscarClientes(empresaId: string, query: BuscarClientesPOSDto) {
    return prisma.cliente.findMany({
      where: {
        empresaId,
        estado: true,
        ...(query.search ? {
          OR: [
            {
              nombre: {
                contains: query.search,
                mode: 'insensitive'
              }
            },
            {
              apellido: {
                contains: query.search,
                mode: 'insensitive'
              }
            },
            {
              identificacion: {
                contains: query.search,
                mode: 'insensitive'
              }
            },
            {
              razonSocial: {
                contains: query.search,
                mode: 'insensitive'
              }
            },
            {
              nombreComercial: {
                contains: query.search,
                mode: 'insensitive'
              }
            }
          ]
        } : {})
      },
      take: query.limit ?? 20,
      orderBy: [
        {
          nombre: 'asc'
        },
        {
          apellido: 'asc'
        }
      ],
      select: {
        id: true,
        nombre: true,
        apellido: true,
        identificacion: true,
        tipoIdentificacion: true,
        tipoCliente: true,
        razonSocial: true,
        nombreComercial: true,
        email: true,
        telefono: true,
        limiteCredito: true,
        diasCredito: true
      }
    });
  }
  async consultarCaja(empresaId: string, data: ConsultarCajaPOSDto) {
    const caja = await prisma.caja.findFirst({
      where: {
        id: data.cajaId,
        empresaId
      },
      include: {
        usuarioApertura: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true
          }
        }
      }
    });
    if (!caja) {
      throw new AppError('La caja no existe o no pertenece a la empresa.', 404);
    }
    return caja;
  }
  async resumenCaja(empresaId: string, data: ConsultarResumenCajaPOSDto) {
    const caja = await prisma.caja.findFirst({
      where: {
        id: data.cajaId,
        empresaId
      },
      include: {
        movimientos: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            venta: {
              select: {
                id: true,
                numero: true,
                total: true,
                estado: true
              }
            },
            usuario: {
              select: {
                id: true,
                nombres: true,
                apellidos: true
              }
            }
          }
        }
      }
    });
    if (!caja) {
      throw new AppError('La caja no existe o no pertenece a la empresa.', 404);
    }
    let ventas = new Prisma.Decimal(0);
    let ingresos = new Prisma.Decimal(0);
    let egresos = new Prisma.Decimal(0);
    let devoluciones = new Prisma.Decimal(0);
    let gastos = new Prisma.Decimal(0);
    let ajustes = new Prisma.Decimal(0);
    for (const movimiento of caja.movimientos) {
      const monto = new Prisma.Decimal(movimiento.monto);
      switch (movimiento.tipo) {
        case TipoMovimientoCaja.VENTA:
          ventas = ventas.add(monto);
          break;
        case TipoMovimientoCaja.INGRESO:
          ingresos = ingresos.add(monto);
          break;
        case TipoMovimientoCaja.EGRESO:
          egresos = egresos.add(monto);
          break;
        case TipoMovimientoCaja.DEVOLUCION:
          devoluciones = devoluciones.add(monto);
          break;
        case TipoMovimientoCaja.GASTO:
          gastos = gastos.add(monto);
          break;
        case TipoMovimientoCaja.AJUSTE:
          ajustes = ajustes.add(monto);
          break;
      }
    }
    return {
      caja: {
        id: caja.id,
        nombre: caja.nombre,
        estado: caja.estado,
        saldoInicial: caja.saldoInicial,
        saldoEsperado: caja.saldoEsperado,
        saldoContado: caja.saldoContado,
        saldoFinal: caja.saldoFinal,
        diferencia: caja.diferencia,
        fechaApertura: caja.fechaApertura,
        fechaCierre: caja.fechaCierre
      },
      resumen: {
        ventas,
        ingresos,
        egresos,
        devoluciones,
        gastos,
        ajustes
      },
      movimientos: caja.movimientos
    };
  }
  private async generarNumeroVenta(empresaId: string): Promise<string> {
    const configuracion = await prisma.configuracion.findUnique({
      where: {
        empresaId
      },
      select: {
        prefijoVenta: true
      }
    });
    const prefijo = configuracion?.prefijoVenta ?? 'VEN';
    const fecha = new Date();
    const base = `${prefijo}-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}`;
    const ultima = await prisma.venta.findFirst({
      where: {
        empresaId,
        numero: {
          startsWith: base
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        numero: true
      }
    });
    const consecutivo = ultima ? Number(ultima.numero.split('-').pop()) + 1 : 1;
    return `${base}-${String(consecutivo).padStart(4, '0')}`;
  }
}
export const posService = new PosService();