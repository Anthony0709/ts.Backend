"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimientoInventarioService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class MovimientoInventarioService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    async validarProducto(productoId, empresaId) {
        const producto = await prisma_1.default.producto.findFirst({
            where: {
                id: productoId,
                empresaId,
                estado: true
            },
            select: {
                id: true,
                nombre: true,
                codigo: true,
                sku: true
            }
        });
        if (!producto) {
            throw new AppError_1.AppError('El producto no existe, está inactivo o no pertenece a la empresa.', 404);
        }
        return producto;
    }
    async validarBodega(bodegaId, empresaId) {
        const bodega = await prisma_1.default.bodega.findFirst({
            where: {
                id: bodegaId,
                empresaId,
                estado: true
            },
            select: {
                id: true,
                nombre: true,
                codigo: true
            }
        });
        if (!bodega) {
            throw new AppError_1.AppError('La bodega no existe, está inactiva o no pertenece a la empresa.', 404);
        }
        return bodega;
    }
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    async obtenerTodos(usuario, query) {
        const { page, limit, skip, take, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
            producto: {
                empresaId: usuario.empresaId
            },
            bodega: {
                empresaId: usuario.empresaId
            },
            ...(query.productoId && {
                productoId: query.productoId
            }),
            ...(query.bodegaId && {
                bodegaId: query.bodegaId
            }),
            ...(query.tipo && {
                tipo: query.tipo
            })
        };
        const [movimientos, total] = await prisma_1.default.$transaction([
            prisma_1.default.movimientoInventario.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    producto: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true,
                            sku: true
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
            prisma_1.default.movimientoInventario.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(movimientos, total, page, limit);
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        const movimiento = await prisma_1.default.movimientoInventario.findFirst({
            where: {
                id,
                producto: {
                    empresaId: usuario.empresaId
                },
                bodega: {
                    empresaId: usuario.empresaId
                }
            },
            include: {
                producto: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true,
                        sku: true
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
        });
        if (!movimiento) {
            throw new AppError_1.AppError('El movimiento de inventario no existe.', 404);
        }
        return movimiento;
    }
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        /*
         * TRANSFERENCIA no se crea directamente aquí.
         * Debe utilizar el módulo de Transferencias,
         * porque una transferencia afecta dos bodegas.
         */
        if (data.tipo ===
            client_1.TipoMovimiento.TRANSFERENCIA) {
            throw new AppError_1.AppError('Las transferencias deben realizarse desde el módulo de Transferencias.', 400);
        }
        await this.validarProducto(data.productoId, empresaId);
        await this.validarBodega(data.bodegaId, empresaId);
        return await prisma_1.default.$transaction(async (tx) => {
            const inventario = await tx.productoBodega.findUnique({
                where: {
                    productoId_bodegaId: {
                        productoId: data.productoId,
                        bodegaId: data.bodegaId
                    }
                }
            });
            if (!inventario) {
                throw new AppError_1.AppError('No existe inventario para este producto en la bodega indicada.', 404);
            }
            const stockAnterior = inventario.stock;
            let stockNuevo;
            switch (data.tipo) {
                case client_1.TipoMovimiento.ENTRADA:
                    stockNuevo =
                        stockAnterior +
                            data.cantidad;
                    break;
                case client_1.TipoMovimiento.SALIDA:
                    stockNuevo =
                        stockAnterior -
                            data.cantidad;
                    if (stockNuevo < 0) {
                        throw new AppError_1.AppError('No existe stock suficiente para realizar la salida.', 400);
                    }
                    break;
                case client_1.TipoMovimiento.AJUSTE:
                    /*
                     * En un ajuste, la cantidad
                     * representa el nuevo stock.
                     */
                    stockNuevo =
                        data.cantidad;
                    break;
                default:
                    throw new AppError_1.AppError('Tipo de movimiento no permitido.', 400);
            }
            await tx.productoBodega.update({
                where: {
                    id: inventario.id
                },
                data: {
                    stock: stockNuevo
                }
            });
            const movimiento = await tx.movimientoInventario.create({
                data: {
                    productoId: data.productoId,
                    bodegaId: data.bodegaId,
                    tipo: data.tipo,
                    cantidad: data.cantidad,
                    stockAnterior,
                    stockNuevo,
                    observacion: data.observacion?.trim()
                },
                include: {
                    producto: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true,
                            sku: true
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
            });
            return movimiento;
        });
    }
}
exports.MovimientoInventarioService = MovimientoInventarioService;
