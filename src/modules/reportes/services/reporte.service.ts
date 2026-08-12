import { Prisma, EstadoVenta, EstadoCompra, EstadoCuentaCobrar, EstadoCuentaPagar, EstadoGasto } from '@prisma/client';
import prisma from '../../../config/prisma';
import { FiltroReporteDto } from '../dto/reporte.dto';
import { AppError } from '../../../utils/AppError';
import { paginatedResponse } from '../../../utils/paginatedResponse';
export class ReporteService {
    private obtenerFechas(filtros: FiltroReporteDto) {
        const fechaDesde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : undefined;
        const fechaHasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : undefined;
        if (fechaHasta) fechaHasta.setHours(23, 59, 59, 999);
        return { fechaDesde, fechaHasta };
    }
    private obtenerRango(fechaDesde?: Date, fechaHasta?: Date) {
        if (!fechaDesde && !fechaHasta) return undefined;
        return {
            ...(fechaDesde ? { gte: fechaDesde } : {}),
            ...(fechaHasta ? { lte: fechaHasta } : {})
        };
    }
    async ventas(empresaId: string, filtros: FiltroReporteDto) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where: Prisma.VentaWhereInput = {
            empresaId,
            ...(filtros.clienteId ? { clienteId: filtros.clienteId } : {}),
            ...(filtros.estado ? { estado: filtros.estado as EstadoVenta } : {}),
            ...(fechaDesde || fechaHasta ? { fecha: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [ventas, total, resumen] = await prisma.$transaction([
            prisma.venta.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: { fecha: 'desc' },
                include: {
                    cliente: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            identificacion: true,
                            razonSocial: true
                        }
                    },
                    detalles: {
                        include: {
                            producto: {
                                select: {
                                    id: true,
                                    codigo: true,
                                    nombre: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma.venta.count({ where }),
            prisma.venta.aggregate({
                where,
                _sum: {
                    subtotal: true,
                    impuesto: true,
                    total: true
                }
            })
        ]);
        return {
            ...paginatedResponse(ventas, total, filtros.page, filtros.limit),
            resumen: {
                subtotal: resumen._sum.subtotal ?? new Prisma.Decimal(0),
                impuesto: resumen._sum.impuesto ?? new Prisma.Decimal(0),
                total: resumen._sum.total ?? new Prisma.Decimal(0)
            }
        };
    }
    async compras(empresaId: string, filtros: FiltroReporteDto) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where: Prisma.CompraWhereInput = {
            empresaId,
            ...(filtros.proveedorId ? { proveedorId: filtros.proveedorId } : {}),
            ...(filtros.estado ? { estado: filtros.estado as EstadoCompra } : {}),
            ...(fechaDesde || fechaHasta ? { fecha: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [compras, total, resumen] = await prisma.$transaction([
            prisma.compra.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: { fecha: 'desc' },
                include: {
                    proveedor: {
                        select: {
                            id: true,
                            nombreComercial: true,
                            razonSocial: true,
                            ruc: true
                        }
                    },
                    detalles: {
                        include: {
                            producto: {
                                select: {
                                    id: true,
                                    codigo: true,
                                    nombre: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma.compra.count({ where }),
            prisma.compra.aggregate({
                where,
                _sum: {
                    subtotal: true,
                    impuesto: true,
                    total: true
                }
            })
        ]);
        return {
            ...paginatedResponse(compras, total, filtros.page, filtros.limit),
            resumen: {
                subtotal: resumen._sum.subtotal ?? new Prisma.Decimal(0),
                impuesto: resumen._sum.impuesto ?? new Prisma.Decimal(0),
                total: resumen._sum.total ?? new Prisma.Decimal(0)
            }
        };
    }
    async inventario(empresaId: string, filtros: FiltroReporteDto) {
        const where: Prisma.ProductoBodegaWhereInput = {
            bodega: {
                empresaId
            },
            ...(filtros.bodegaId ? { bodegaId: filtros.bodegaId } : {}),
            ...(filtros.productoId ? { productoId: filtros.productoId } : {})
        };
        const [inventarios, total] = await prisma.$transaction([
            prisma.productoBodega.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: {
                    stock: 'asc'
                },
                include: {
                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            sku: true,
                            codigoBarras: true,
                            nombre: true,
                            precioCompra: true,
                            precioVenta: true,
                            stockMinimo: true,
                            stockMaximo: true,
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
                    },
                    bodega: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true
                        }
                    }
                }
            }),
            prisma.productoBodega.count({ where })
        ]);
        const stockTotal = inventarios.reduce((total, item) => total + item.stock, 0);
        const bajoStock = inventarios.filter(item => item.stock <= item.producto.stockMinimo).length;
        return {
            ...paginatedResponse(inventarios, total, filtros.page, filtros.limit),
            resumen: {
                stockTotal,
                registrosBajoStock: bajoStock
            }
        };
    }
    async clientes(empresaId: string, filtros: FiltroReporteDto) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where: Prisma.ClienteWhereInput = {
            empresaId,
            ...(filtros.estado ? { estado: filtros.estado === 'true' } : {}),
            ...(fechaDesde || fechaHasta ? { createdAt: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [clientes, total] = await prisma.$transaction([
            prisma.cliente.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    _count: {
                        select: {
                            ventas: true,
                            cuentasCobrar: true
                        }
                    }
                }
            }),
            prisma.cliente.count({ where })
        ]);
        return paginatedResponse(clientes, total, filtros.page, filtros.limit);
    }
    async cuentasCobrar(empresaId: string, filtros: FiltroReporteDto) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where: Prisma.CuentaCobrarWhereInput = {
            empresaId,
            ...(filtros.clienteId ? { clienteId: filtros.clienteId } : {}),
            ...(filtros.estado ? { estado: filtros.estado as EstadoCuentaCobrar } : {}),
            ...(fechaDesde || fechaHasta ? { fecha: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [cuentas, total, resumen] = await prisma.$transaction([
            prisma.cuentaCobrar.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: {
                    fechaVencimiento: 'asc'
                },
                include: {
                    cliente: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            identificacion: true,
                            razonSocial: true
                        }
                    },
                    venta: {
                        select: {
                            id: true,
                            numero: true,
                            fecha: true,
                            total: true
                        }
                    },
                    abonos: true
                }
            }),
            prisma.cuentaCobrar.count({ where }),
            prisma.cuentaCobrar.aggregate({
                where,
                _sum: {
                    total: true,
                    saldo: true
                }
            })
        ]);
        return {
            ...paginatedResponse(cuentas, total, filtros.page, filtros.limit),
            resumen: {
                total: resumen._sum.total ?? new Prisma.Decimal(0),
                saldo: resumen._sum.saldo ?? new Prisma.Decimal(0)
            }
        };
    }
    async cuentasPagar(empresaId: string, filtros: FiltroReporteDto) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where: Prisma.CuentaPagarWhereInput = {
            empresaId,
            ...(filtros.proveedorId ? { proveedorId: filtros.proveedorId } : {}),
            ...(filtros.estado ? { estado: filtros.estado as EstadoCuentaPagar } : {}),
            ...(fechaDesde || fechaHasta ? { fecha: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [cuentas, total, resumen] = await prisma.$transaction([
            prisma.cuentaPagar.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: {
                    fechaVencimiento: 'asc'
                },
                include: {
                    proveedor: {
                        select: {
                            id: true,
                            nombreComercial: true,
                            razonSocial: true,
                            ruc: true
                        }
                    },
                    compra: {
                        select: {
                            id: true,
                            numero: true,
                            fecha: true,
                            total: true
                        }
                    },
                    pagos: true
                }
            }),
            prisma.cuentaPagar.count({ where }),
            prisma.cuentaPagar.aggregate({
                where,
                _sum: {
                    total: true,
                    saldo: true
                }
            })
        ]);
        return {
            ...paginatedResponse(cuentas, total, filtros.page, filtros.limit),
            resumen: {
                total: resumen._sum.total ?? new Prisma.Decimal(0),
                saldo: resumen._sum.saldo ?? new Prisma.Decimal(0)
            }
        };
    }
    async gastos(empresaId: string, filtros: FiltroReporteDto) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where: Prisma.GastoWhereInput = {
            empresaId,
            ...(filtros.proveedorId ? { proveedorId: filtros.proveedorId } : {}),
            ...(filtros.estado ? { estado: filtros.estado as EstadoGasto } : {}),
            ...(fechaDesde || fechaHasta ? { fecha: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [gastos, total, resumen] = await prisma.$transaction([
            prisma.gasto.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: {
                    fecha: 'desc'
                },
                include: {
                    proveedor: {
                        select: {
                            id: true,
                            nombreComercial: true,
                            razonSocial: true,
                            ruc: true
                        }
                    }
                }
            }),
            prisma.gasto.count({ where }),
            prisma.gasto.aggregate({
                where,
                _sum: {
                    monto: true
                }
            })
        ]);
        return {
            ...paginatedResponse(gastos, total, filtros.page, filtros.limit),
            resumen: {
                total: resumen._sum.monto ?? new Prisma.Decimal(0)
            }
        };
    }
}
export const reporteService = new ReporteService();