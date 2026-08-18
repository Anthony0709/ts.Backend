"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CajaService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class CajaService {
    /*=====================================================
    ====================== CREAR =========================
    =====================================================*/
    async crear(empresaId, data) {
        const existe = await prisma_1.default.caja.findFirst({
            where: {
                empresaId,
                nombre: data.nombre
            }
        });
        if (existe) {
            throw new AppError_1.AppError('Ya existe una caja con ese nombre.', 400);
        }
        return prisma_1.default.caja.create({
            data: {
                nombre: data.nombre,
                empresaId,
                saldoInicial: new client_1.Prisma.Decimal(data.saldoInicial),
                estado: client_1.EstadoCaja.CERRADA,
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
    async obtenerPorId(id, empresaId) {
        const caja = await prisma_1.default.caja.findFirst({
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
            throw new AppError_1.AppError('La caja no existe.', 404);
        }
        return caja;
    }
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    async obtenerTodos(empresaId, query) {
        const { page, limit, skip, take, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
            empresaId,
            ...(query.estado && {
                estado: query.estado
            }),
            ...(query.nombre && {
                nombre: {
                    contains: query.nombre,
                    mode: 'insensitive'
                }
            })
        };
        const [cajas, total] = await prisma_1.default.$transaction([
            prisma_1.default.caja.findMany({
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
            prisma_1.default.caja.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(cajas, total, page, limit);
    }
    /*=====================================================
    ===================== ACTUALIZAR =====================
    =====================================================*/
    async actualizar(id, empresaId, data) {
        const caja = await prisma_1.default.caja.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!caja) {
            throw new AppError_1.AppError('La caja no existe.', 404);
        }
        if (caja.estado === client_1.EstadoCaja.ABIERTA) {
            throw new AppError_1.AppError('No se puede modificar una caja mientras está abierta.', 400);
        }
        if (data.nombre) {
            const existe = await prisma_1.default.caja.findFirst({
                where: {
                    empresaId,
                    nombre: data.nombre,
                    id: {
                        not: id
                    }
                }
            });
            if (existe) {
                throw new AppError_1.AppError('Ya existe otra caja con ese nombre.', 400);
            }
        }
        return prisma_1.default.caja.update({
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
    async abrir(id, empresaId, usuarioId, data) {
        const caja = await prisma_1.default.caja.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!caja) {
            throw new AppError_1.AppError('La caja no existe.', 404);
        }
        if (caja.estado === client_1.EstadoCaja.ABIERTA) {
            throw new AppError_1.AppError('La caja ya está abierta.', 400);
        }
        const saldoInicial = new client_1.Prisma.Decimal(data.saldoInicial);
        return prisma_1.default.caja.update({
            where: {
                id
            },
            data: {
                estado: client_1.EstadoCaja.ABIERTA,
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
    async cerrar(id, empresaId, usuarioId, data) {
        const caja = await prisma_1.default.caja.findFirst({
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
            throw new AppError_1.AppError('La caja no existe.', 404);
        }
        if (caja.estado !== client_1.EstadoCaja.ABIERTA) {
            throw new AppError_1.AppError('La caja ya está cerrada.', 400);
        }
        let saldoEsperado = new client_1.Prisma.Decimal(caja.saldoInicial);
        for (const movimiento of caja.movimientos) {
            const monto = new client_1.Prisma.Decimal(movimiento.monto);
            switch (movimiento.tipo) {
                case client_1.TipoMovimientoCaja.INGRESO:
                case client_1.TipoMovimientoCaja.VENTA:
                    saldoEsperado = saldoEsperado.add(monto);
                    break;
                case client_1.TipoMovimientoCaja.EGRESO:
                case client_1.TipoMovimientoCaja.DEVOLUCION:
                case client_1.TipoMovimientoCaja.GASTO:
                    saldoEsperado = saldoEsperado.sub(monto);
                    break;
                case client_1.TipoMovimientoCaja.AJUSTE:
                    saldoEsperado = saldoEsperado.add(monto);
                    break;
            }
        }
        const saldoContado = new client_1.Prisma.Decimal(data.saldoContado);
        const diferencia = saldoContado.sub(saldoEsperado);
        return prisma_1.default.caja.update({
            where: {
                id
            },
            data: {
                estado: client_1.EstadoCaja.CERRADA,
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
    async obtenerMovimientos(empresaId, query) {
        const caja = await prisma_1.default.caja.findFirst({
            where: {
                id: query.cajaId,
                empresaId
            }
        });
        if (!caja) {
            throw new AppError_1.AppError('La caja no existe.', 404);
        }
        const { page, limit, skip, take } = (0, query_1.buildQuery)(query);
        const where = {
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
        const [movimientos, total] = await prisma_1.default.$transaction([
            prisma_1.default.movimientoCaja.findMany({
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
            prisma_1.default.movimientoCaja.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(movimientos, total, page, limit);
    }
    /*=====================================================
    ======================= RESUMEN ======================
    =====================================================*/
    async obtenerResumen(id, empresaId) {
        const caja = await prisma_1.default.caja.findFirst({
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
            throw new AppError_1.AppError('La caja no existe.', 404);
        }
        let ingresos = new client_1.Prisma.Decimal(0);
        let ventas = new client_1.Prisma.Decimal(0);
        let egresos = new client_1.Prisma.Decimal(0);
        let devoluciones = new client_1.Prisma.Decimal(0);
        let gastos = new client_1.Prisma.Decimal(0);
        let ajustes = new client_1.Prisma.Decimal(0);
        for (const movimiento of caja.movimientos) {
            const monto = new client_1.Prisma.Decimal(movimiento.monto);
            switch (movimiento.tipo) {
                case client_1.TipoMovimientoCaja.INGRESO:
                    ingresos = ingresos.add(monto);
                    break;
                case client_1.TipoMovimientoCaja.VENTA:
                    ventas = ventas.add(monto);
                    break;
                case client_1.TipoMovimientoCaja.EGRESO:
                    egresos = egresos.add(monto);
                    break;
                case client_1.TipoMovimientoCaja.DEVOLUCION:
                    devoluciones = devoluciones.add(monto);
                    break;
                case client_1.TipoMovimientoCaja.GASTO:
                    gastos = gastos.add(monto);
                    break;
                case client_1.TipoMovimientoCaja.AJUSTE:
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
exports.CajaService = CajaService;
