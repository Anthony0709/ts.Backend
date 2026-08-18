"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuentaCobrarService = exports.CuentaCobrarService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class CuentaCobrarService {
    async crear(empresaId, data) {
        if (!data.ventaId) {
            throw new AppError_1.AppError('La cuenta por cobrar debe estar asociada a una venta.', 400);
        }
        const cliente = await prisma_1.default.cliente.findFirst({
            where: {
                id: data.clienteId,
                empresaId,
                estado: true
            }
        });
        if (!cliente) {
            throw new AppError_1.AppError('El cliente no existe, está inactivo o no pertenece a la empresa.', 404);
        }
        const venta = await prisma_1.default.venta.findFirst({
            where: {
                id: data.ventaId,
                empresaId
            }
        });
        if (!venta) {
            throw new AppError_1.AppError('La venta no existe o no pertenece a la empresa.', 404);
        }
        const cuentaExistente = await prisma_1.default.cuentaCobrar.findUnique({
            where: {
                ventaId: data.ventaId
            }
        });
        if (cuentaExistente) {
            throw new AppError_1.AppError('La venta ya tiene una cuenta por cobrar asociada.', 400);
        }
        const numeroExistente = await prisma_1.default.cuentaCobrar.findFirst({
            where: {
                empresaId,
                numero: data.numeroDocumento
            }
        });
        if (numeroExistente) {
            throw new AppError_1.AppError('Ya existe una cuenta por cobrar con ese número de documento.', 400);
        }
        const total = new client_1.Prisma.Decimal(data.monto);
        const cuenta = await prisma_1.default.cuentaCobrar.create({
            data: {
                numero: data.numeroDocumento,
                fecha: data.fechaEmision,
                fechaVencimiento: data.fechaVencimiento,
                clienteId: data.clienteId,
                empresaId,
                ventaId: data.ventaId,
                estado: client_1.EstadoCuentaCobrar.PENDIENTE,
                total,
                saldo: total,
                observacion: data.observacion?.trim()
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
                venta: {
                    select: {
                        id: true,
                        numero: true,
                        fecha: true,
                        total: true,
                        estado: true
                    }
                },
                abonos: true
            }
        });
        return cuenta;
    }
    async obtenerPorId(id, empresaId) {
        const cuenta = await prisma_1.default.cuentaCobrar.findFirst({
            where: {
                id,
                empresaId
            },
            include: {
                cliente: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        identificacion: true,
                        tipoCliente: true,
                        razonSocial: true,
                        nombreComercial: true,
                        email: true,
                        telefono: true
                    }
                },
                venta: {
                    select: {
                        id: true,
                        numero: true,
                        fecha: true,
                        subtotal: true,
                        impuesto: true,
                        total: true,
                        estado: true
                    }
                },
                abonos: {
                    orderBy: {
                        fecha: 'desc'
                    }
                }
            }
        });
        if (!cuenta) {
            throw new AppError_1.AppError('La cuenta por cobrar no existe.', 404);
        }
        return cuenta;
    }
    async obtenerTodos(empresaId, query) {
        const { page, limit, skip, take, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
            empresaId,
            ...(query.clienteId ? {
                clienteId: query.clienteId
            } : {}),
            ...(query.ventaId ? {
                ventaId: query.ventaId
            } : {}),
            ...(query.estado ? {
                estado: query.estado
            } : {}),
            ...(query.numeroDocumento ? {
                numero: {
                    contains: query.numeroDocumento,
                    mode: 'insensitive'
                }
            } : {}),
            ...(query.fechaDesde || query.fechaHasta ? {
                fecha: {
                    ...(query.fechaDesde ? {
                        gte: query.fechaDesde
                    } : {}),
                    ...(query.fechaHasta ? {
                        lte: query.fechaHasta
                    } : {})
                }
            } : {}),
            ...(query.vencidas ? {
                fechaVencimiento: {
                    lt: new Date()
                },
                estado: {
                    in: [
                        client_1.EstadoCuentaCobrar.PENDIENTE,
                        client_1.EstadoCuentaCobrar.PARCIAL
                    ]
                }
            } : {})
        };
        const [cuentas, total] = await prisma_1.default.$transaction([
            prisma_1.default.cuentaCobrar.findMany({
                where,
                skip,
                take,
                orderBy,
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
                    venta: {
                        select: {
                            id: true,
                            numero: true,
                            fecha: true,
                            total: true,
                            estado: true
                        }
                    }
                }
            }),
            prisma_1.default.cuentaCobrar.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(cuentas, total, page, limit);
    }
    async registrarAbono(id, empresaId, data) {
        const cuenta = await prisma_1.default.cuentaCobrar.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!cuenta) {
            throw new AppError_1.AppError('La cuenta por cobrar no existe.', 404);
        }
        if (cuenta.estado === client_1.EstadoCuentaCobrar.PAGADA) {
            throw new AppError_1.AppError('La cuenta por cobrar ya está pagada.', 400);
        }
        if (cuenta.estado === client_1.EstadoCuentaCobrar.VENCIDA) {
            throw new AppError_1.AppError('La cuenta está vencida. Debe regularizarse antes de registrar el abono.', 400);
        }
        const monto = new client_1.Prisma.Decimal(data.monto);
        if (monto.greaterThan(cuenta.saldo)) {
            throw new AppError_1.AppError('El monto del abono no puede ser mayor al saldo pendiente.', 400);
        }
        const saldoNuevo = cuenta.saldo.sub(monto);
        const estadoNuevo = saldoNuevo.lessThanOrEqualTo(0) ? client_1.EstadoCuentaCobrar.PAGADA : client_1.EstadoCuentaCobrar.PARCIAL;
        const resultado = await prisma_1.default.$transaction(async (tx) => {
            const abono = await tx.abonoCuentaCobrar.create({
                data: {
                    cuentaCobrarId: cuenta.id,
                    monto,
                    metodoPago: data.metodoPago,
                    referencia: data.referencia?.trim(),
                    observacion: data.observacion?.trim()
                }
            });
            const cuentaActualizada = await tx.cuentaCobrar.update({
                where: {
                    id: cuenta.id
                },
                data: {
                    saldo: saldoNuevo,
                    estado: estadoNuevo
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
                    venta: {
                        select: {
                            id: true,
                            numero: true,
                            total: true
                        }
                    },
                    abonos: {
                        orderBy: {
                            fecha: 'desc'
                        }
                    }
                }
            });
            return {
                abono,
                cuenta: cuentaActualizada
            };
        });
        return resultado;
    }
    async obtenerAbonos(id, empresaId) {
        const cuenta = await prisma_1.default.cuentaCobrar.findFirst({
            where: {
                id,
                empresaId
            },
            select: {
                id: true
            }
        });
        if (!cuenta) {
            throw new AppError_1.AppError('La cuenta por cobrar no existe.', 404);
        }
        return prisma_1.default.abonoCuentaCobrar.findMany({
            where: {
                cuentaCobrarId: id
            },
            orderBy: {
                fecha: 'desc'
            }
        });
    }
    async actualizarVencidas(empresaId) {
        const resultado = await prisma_1.default.cuentaCobrar.updateMany({
            where: {
                empresaId,
                estado: {
                    in: [
                        client_1.EstadoCuentaCobrar.PENDIENTE,
                        client_1.EstadoCuentaCobrar.PARCIAL
                    ]
                },
                fechaVencimiento: {
                    lt: new Date()
                },
                saldo: {
                    gt: 0
                }
            },
            data: {
                estado: client_1.EstadoCuentaCobrar.VENCIDA
            }
        });
        return {
            actualizadas: resultado.count
        };
    }
}
exports.CuentaCobrarService = CuentaCobrarService;
exports.cuentaCobrarService = new CuentaCobrarService();
