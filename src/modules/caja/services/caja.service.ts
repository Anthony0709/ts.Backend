import { Prisma, EstadoCaja, TipoMovimientoCaja } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearCajaDto, ActualizarCajaDto, AbrirCajaDto, CerrarCajaDto, ConsultarCajasDto, ConsultarMovimientosCajaDto } from '../dto/caja.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class CajaService {
    /*=====================================================
    ====================== CREAR =========================
    =====================================================*/
    async crear(empresaId: string, data: CrearCajaDto) {
        const existe = await prisma.caja.findFirst({
            where: {
                empresaId,
                nombre: data.nombre
            }
        });
        if (existe) {
            throw new AppError('Ya existe una caja con ese nombre.', 400);
        }
        return prisma.caja.create({
            data: {
                nombre: data.nombre,
                empresaId,
                saldoInicial: new Prisma.Decimal(data.saldoInicial),
                estado: EstadoCaja.CERRADA,
                observacion: data.observacion?.trim()
            },
            include: {
                _count: {
                    select: {
                        movimientos: true
                    }
                }
            }
        });
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id: string, empresaId: string) {
        const caja = await prisma.caja.findFirst({
            where: {
                id,
                empresaId
            },
            include: {
                usuarioApertura: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                },
                usuarioCierre: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        movimientos: true
                    }
                }
            }
        });
        if (!caja) {
            throw new AppError('La caja no existe.', 404);
        }
        return caja;
    }
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    async obtenerTodos(empresaId: string, query: ConsultarCajasDto) {
        const { page, limit, skip, take, orderBy } = buildQuery(query);
        const where: Prisma.CajaWhereInput = {
            empresaId,
            ...(query.estado && {
                estado: query.estado as EstadoCaja
            }),
            ...(query.nombre && {
                nombre: {
                    contains: query.nombre,
                    mode: 'insensitive'
                }
            })
        };
        const [cajas, total] = await prisma.$transaction([
            prisma.caja.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    usuarioApertura: {
                        select: {
                            id: true,
                            nombre: true,
                            email: true
                        }
                    },
                    usuarioCierre: {
                        select: {
                            id: true,
                            nombre: true,
                            email: true
                        }
                    },
                    _count: {
                        select: {
                            movimientos: true
                        }
                    }
                }
            }),
            prisma.caja.count({
                where
            })
        ]);
        return paginatedResponse(cajas, total, page, limit);
    }
    /*=====================================================
    ===================== ACTUALIZAR =====================
    =====================================================*/
    async actualizar(id: string, empresaId: string, data: ActualizarCajaDto) {
        const caja = await prisma.caja.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!caja) {
            throw new AppError('La caja no existe.', 404);
        }
        if (caja.estado === EstadoCaja.ABIERTA) {
            throw new AppError('No se puede modificar una caja mientras está abierta.', 400);
        }
        if (data.nombre) {
            const existe = await prisma.caja.findFirst({
                where: {
                    empresaId,
                    nombre: data.nombre,
                    id: {
                        not: id
                    }
                }
            });
            if (existe) {
                throw new AppError('Ya existe otra caja con ese nombre.', 400);
            }
        }
        return prisma.caja.update({
            where: {
                id
            },
            data: {
                ...(data.nombre !== undefined && {
                    nombre: data.nombre
                }),
                ...(data.observacion !== undefined && {
                    observacion: data.observacion.trim()
                })
            },
            include: {
                _count: {
                    select: {
                        movimientos: true
                    }
                }
            }
        });
    }
    /*=====================================================
    ======================== ABRIR =======================
    =====================================================*/
    async abrir(id: string, empresaId: string, usuarioId: string, data: AbrirCajaDto) {
        const caja = await prisma.caja.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!caja) {
            throw new AppError('La caja no existe.', 404);
        }
        if (caja.estado === EstadoCaja.ABIERTA) {
            throw new AppError('La caja ya está abierta.', 400);
        }
        const saldoInicial = new Prisma.Decimal(data.saldoInicial);
        return prisma.caja.update({
            where: {
                id
            },
            data: {
                estado: EstadoCaja.ABIERTA,
                saldoInicial,
                saldoEsperado: saldoInicial,
                saldoContado: null,
                saldoFinal: null,
                diferencia: null,
                fechaApertura: new Date(),
                fechaCierre: null,
                usuarioAperturaId: usuarioId,
                usuarioCierreId: null,
                observacion: data.observacion?.trim()
            },
            include: {
                usuarioApertura: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            }
        });
    }
    /*=====================================================
    ======================== CERRAR ======================
    =====================================================*/
    async cerrar(id: string, empresaId: string, usuarioId: string, data: CerrarCajaDto) {
        const caja = await prisma.caja.findFirst({
            where: {
                id,
                empresaId
            },
            include: {
                movimientos: {
                    select: {
                        tipo: true,
                        monto: true
                    }
                }
            }
        });
        if (!caja) {
            throw new AppError('La caja no existe.', 404);
        }
        if (caja.estado !== EstadoCaja.ABIERTA) {
            throw new AppError('La caja ya está cerrada.', 400);
        }
        let saldoEsperado = new Prisma.Decimal(caja.saldoInicial);
        for (const movimiento of caja.movimientos) {
            const monto = new Prisma.Decimal(movimiento.monto);
            switch (movimiento.tipo) {
                case TipoMovimientoCaja.INGRESO:
                case TipoMovimientoCaja.VENTA:
                    saldoEsperado = saldoEsperado.add(monto);
                    break;
                case TipoMovimientoCaja.EGRESO:
                case TipoMovimientoCaja.DEVOLUCION:
                case TipoMovimientoCaja.GASTO:
                    saldoEsperado = saldoEsperado.sub(monto);
                    break;
                case TipoMovimientoCaja.AJUSTE:
                    saldoEsperado = saldoEsperado.add(monto);
                    break;
            }
        }
        const saldoContado = new Prisma.Decimal(data.saldoContado);
        const diferencia = saldoContado.sub(saldoEsperado);
        return prisma.caja.update({
            where: {
                id
            },
            data: {
                estado: EstadoCaja.CERRADA,
                saldoEsperado,
                saldoContado,
                saldoFinal: saldoContado,
                diferencia,
                fechaCierre: new Date(),
                usuarioCierreId: usuarioId,
                observacion: data.observacion?.trim()
            },
            include: {
                usuarioApertura: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                },
                usuarioCierre: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            }
        });
    }
    /*=====================================================
    =================== MOVIMIENTOS ======================
    =====================================================*/
    async obtenerMovimientos(empresaId: string, query: ConsultarMovimientosCajaDto) {
        const caja = await prisma.caja.findFirst({
            where: {
                id: query.cajaId,
                empresaId
            }
        });
        if (!caja) {
            throw new AppError('La caja no existe.', 404);
        }
        const { page, limit, skip, take } = buildQuery(query);
        const where: Prisma.MovimientoCajaWhereInput = {
            cajaId: query.cajaId,
            ...(query.fechaDesde || query.fechaHasta ? {
                createdAt: {
                    ...(query.fechaDesde && {
                        gte: new Date(query.fechaDesde)
                    }),
                    ...(query.fechaHasta && {
                        lte: new Date(query.fechaHasta)
                    })
                }
            } : {})
        };
        const [movimientos, total] = await prisma.$transaction([
            prisma.movimientoCaja.findMany({
                where,
                skip,
                take,
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
                            nombre: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.movimientoCaja.count({
                where
            })
        ]);
        return paginatedResponse(movimientos, total, page, limit);
    }
    /*=====================================================
    ======================= RESUMEN ======================
    =====================================================*/
    async obtenerResumen(id: string, empresaId: string) {
        const caja = await prisma.caja.findFirst({
            where: {
                id,
                empresaId
            },
            include: {
                movimientos: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
        if (!caja) {
            throw new AppError('La caja no existe.', 404);
        }
        let ingresos = new Prisma.Decimal(0);
        let ventas = new Prisma.Decimal(0);
        let egresos = new Prisma.Decimal(0);
        let devoluciones = new Prisma.Decimal(0);
        let gastos = new Prisma.Decimal(0);
        let ajustes = new Prisma.Decimal(0);
        for (const movimiento of caja.movimientos) {
            const monto = new Prisma.Decimal(movimiento.monto);
            switch (movimiento.tipo) {
                case TipoMovimientoCaja.INGRESO:
                    ingresos = ingresos.add(monto);
                    break;
                case TipoMovimientoCaja.VENTA:
                    ventas = ventas.add(monto);
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
                estado: caja.estado
            },
            saldoInicial: caja.saldoInicial,
            saldoEsperado: caja.saldoEsperado,
            saldoContado: caja.saldoContado,
            saldoFinal: caja.saldoFinal,
            diferencia: caja.diferencia,
            movimientos: {
                ingresos,
                ventas,
                egresos,
                devoluciones,
                gastos,
                ajustes
            }
        };
    }
}