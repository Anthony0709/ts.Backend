"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GastoService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class GastoService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    async generarNumero(empresaId, tx = prisma_1.default) {
        const configuracion = await tx.configuracion.findUnique({
            where: {
                empresaId
            },
            select: {
                prefijoGasto: true
            }
        });
        const prefijo = configuracion?.prefijoGasto || 'GAS';
        for (let intento = 0; intento < 20; intento++) {
            const numero = `${prefijo}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const existe = await tx.gasto.findFirst({
                where: {
                    empresaId,
                    numero
                },
                select: {
                    id: true
                }
            });
            if (!existe) {
                return numero;
            }
        }
        throw new AppError_1.AppError('No fue posible generar el número del gasto.', 500);
    }
    async obtenerGasto(id, empresaId) {
        const gasto = await prisma_1.default.gasto.findFirst({
            where: {
                id,
                empresaId
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
        });
        if (!gasto) {
            throw new AppError_1.AppError('El gasto no existe.', 404);
        }
        return gasto;
    }
    async validarProveedor(proveedorId, empresaId) {
        const proveedor = await prisma_1.default.proveedor.findFirst({
            where: {
                id: proveedorId,
                empresaId,
                estado: true
            },
            select: {
                id: true,
                nombreComercial: true,
                razonSocial: true,
                ruc: true
            }
        });
        if (!proveedor) {
            throw new AppError_1.AppError('El proveedor no existe, está inactivo o no pertenece a la empresa.', 404);
        }
        return proveedor;
    }
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    async obtenerTodos(usuario, query) {
        const { page, limit, skip, take } = (0, query_1.buildQuery)(query);
        const where = {
            empresaId: usuario.empresaId,
            ...(query.proveedorId && {
                proveedorId: query.proveedorId
            }),
            ...(query.estado && {
                estado: query.estado
            }),
            ...(query.categoria && {
                categoria: {
                    contains: query.categoria,
                    mode: 'insensitive'
                }
            }),
            ...(query.metodoPago && {
                metodoPago: query.metodoPago
            }),
            ...(query.fechaDesde || query.fechaHasta
                ? {
                    fecha: {
                        ...(query.fechaDesde && {
                            gte: new Date(query.fechaDesde)
                        }),
                        ...(query.fechaHasta && {
                            lte: new Date(query.fechaHasta)
                        })
                    }
                }
                : {}),
            ...(query.montoMinimo !== undefined ||
                query.montoMaximo !== undefined
                ? {
                    monto: {
                        ...(query.montoMinimo !== undefined && {
                            gte: new client_1.Prisma.Decimal(query.montoMinimo)
                        }),
                        ...(query.montoMaximo !== undefined && {
                            lte: new client_1.Prisma.Decimal(query.montoMaximo)
                        })
                    }
                }
                : {})
        };
        const [gastos, total] = await prisma_1.default.$transaction([
            prisma_1.default.gasto.findMany({
                where,
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
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
            prisma_1.default.gasto.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(gastos, total, page, limit);
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        return this.obtenerGasto(id, usuario.empresaId);
    }
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        /*
         * Si viene proveedorId,
         * validamos que pertenezca a la empresa.
         */
        if (data.proveedorId) {
            await this.validarProveedor(data.proveedorId, empresaId);
        }
        const numero = await this.generarNumero(empresaId);
        return prisma_1.default.gasto.create({
            data: {
                numero,
                concepto: data.concepto.trim(),
                descripcion: data.descripcion?.trim(),
                ...(data.proveedorId && {
                    proveedor: {
                        connect: {
                            id: data.proveedorId
                        }
                    }
                }),
                empresa: {
                    connect: {
                        id: empresaId
                    }
                },
                categoria: data.categoria.trim(),
                monto: new client_1.Prisma.Decimal(data.monto),
                estado: client_1.EstadoGasto.PENDIENTE,
                metodoPago: data.metodoPago,
                referencia: data.referencia?.trim()
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
        });
    }
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    async actualizar(id, data, usuario) {
        const gasto = await this.obtenerGasto(id, usuario.empresaId);
        /*
         * Un gasto pagado o anulado no debe
         * modificarse.
         */
        if (gasto.estado ===
            client_1.EstadoGasto.PAGADO) {
            throw new AppError_1.AppError('No se puede modificar un gasto que ya está pagado.', 400);
        }
        if (gasto.estado ===
            client_1.EstadoGasto.ANULADO) {
            throw new AppError_1.AppError('No se puede modificar un gasto que está anulado.', 400);
        }
        /*
         * Si se envía proveedorId,
         * validamos el proveedor.
         */
        if (data.proveedorId) {
            await this.validarProveedor(data.proveedorId, usuario.empresaId);
        }
        return prisma_1.default.gasto.update({
            where: {
                id: gasto.id
            },
            data: {
                ...(data.concepto !== undefined && {
                    concepto: data.concepto.trim()
                }),
                ...(data.descripcion !== undefined && {
                    descripcion: data.descripcion?.trim()
                }),
                ...(data.proveedorId !== undefined && (data.proveedorId === null
                    ? {
                        proveedor: {
                            disconnect: true
                        }
                    }
                    : {
                        proveedor: {
                            connect: {
                                id: data.proveedorId
                            }
                        }
                    })),
                ...(data.categoria !== undefined && {
                    categoria: data.categoria.trim()
                }),
                ...(data.monto !== undefined && {
                    monto: new client_1.Prisma.Decimal(data.monto)
                }),
                ...(data.metodoPago !== undefined && (data.metodoPago === null
                    ? {
                        metodoPago: null
                    }
                    : {
                        metodoPago: data.metodoPago
                    })),
                ...(data.referencia !== undefined && (data.referencia === null
                    ? {
                        referencia: null
                    }
                    : {
                        referencia: data.referencia.trim()
                    }))
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
        });
    }
    /*=====================================================
    ====================== PAGAR =========================
    =====================================================*/
    async pagar(id, usuario) {
        const gasto = await this.obtenerGasto(id, usuario.empresaId);
        if (gasto.estado ===
            client_1.EstadoGasto.PAGADO) {
            throw new AppError_1.AppError('El gasto ya está pagado.', 400);
        }
        if (gasto.estado ===
            client_1.EstadoGasto.ANULADO) {
            throw new AppError_1.AppError('No se puede pagar un gasto anulado.', 400);
        }
        return prisma_1.default.gasto.update({
            where: {
                id: gasto.id
            },
            data: {
                estado: client_1.EstadoGasto.PAGADO
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
        });
    }
    /*=====================================================
    ====================== ANULAR ========================
    =====================================================*/
    async anular(id, usuario) {
        const gasto = await this.obtenerGasto(id, usuario.empresaId);
        if (gasto.estado ===
            client_1.EstadoGasto.ANULADO) {
            throw new AppError_1.AppError('El gasto ya está anulado.', 400);
        }
        if (gasto.estado ===
            client_1.EstadoGasto.PAGADO) {
            throw new AppError_1.AppError('No se puede anular un gasto que ya está pagado.', 400);
        }
        return prisma_1.default.gasto.update({
            where: {
                id: gasto.id
            },
            data: {
                estado: client_1.EstadoGasto.ANULADO
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
        });
    }
}
exports.GastoService = GastoService;
