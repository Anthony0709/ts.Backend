"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferenciaService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class TransferenciaService {
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
        const { page, limit, skip, take } = (0, query_1.buildQuery)(query);
        const where = {
            producto: {
                empresaId: usuario.empresaId
            },
            bodega: {
                empresaId: usuario.empresaId
            },
            tipo: client_1.TipoMovimiento.TRANSFERENCIA,
            ...(query.productoId && {
                productoId: query.productoId
            }),
            ...(query.bodegaOrigenId && {
                bodegaId: query.bodegaOrigenId
            })
        };
        const [movimientos, total] = await prisma_1.default.$transaction([
            prisma_1.default.movimientoInventario.findMany({
                where,
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
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
            }),
            prisma_1.default.movimientoInventario.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(movimientos, total, page, limit);
    }
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        /*
         * Validar que origen y destino sean diferentes.
         */
        if (data.bodegaOrigenId ===
            data.bodegaDestinoId) {
            throw new AppError_1.AppError('La bodega de origen y destino deben ser diferentes.', 400);
        }
        const producto = await this.validarProducto(data.productoId, empresaId);
        const bodegaOrigen = await this.validarBodega(data.bodegaOrigenId, empresaId);
        const bodegaDestino = await this.validarBodega(data.bodegaDestinoId, empresaId);
        return await prisma_1.default.$transaction(async (tx) => {
            /*
             * Buscar inventario de origen.
             */
            const inventarioOrigen = await tx.productoBodega.findUnique({
                where: {
                    productoId_bodegaId: {
                        productoId: data.productoId,
                        bodegaId: data.bodegaOrigenId
                    }
                }
            });
            if (!inventarioOrigen) {
                throw new AppError_1.AppError('El producto no tiene inventario registrado en la bodega de origen.', 404);
            }
            /*
             * Validar stock suficiente.
             */
            if (inventarioOrigen.stock <
                data.cantidad) {
                throw new AppError_1.AppError(`Stock insuficiente en la bodega ${bodegaOrigen.nombre}. Stock disponible: ${inventarioOrigen.stock}.`, 400);
            }
            /*
             * Buscar inventario de destino.
             */
            const inventarioDestino = await tx.productoBodega.findUnique({
                where: {
                    productoId_bodegaId: {
                        productoId: data.productoId,
                        bodegaId: data.bodegaDestinoId
                    }
                }
            });
            /*
             * Si no existe inventario en destino,
             * se crea automáticamente.
             */
            const stockOrigenAnterior = inventarioOrigen.stock;
            const stockOrigenNuevo = stockOrigenAnterior -
                data.cantidad;
            let stockDestinoAnterior;
            let stockDestinoNuevo;
            if (!inventarioDestino) {
                stockDestinoAnterior = 0;
                stockDestinoNuevo =
                    data.cantidad;
                await tx.productoBodega.create({
                    data: {
                        productoId: data.productoId,
                        bodegaId: data.bodegaDestinoId,
                        stock: stockDestinoNuevo
                    }
                });
            }
            else {
                stockDestinoAnterior =
                    inventarioDestino.stock;
                stockDestinoNuevo =
                    stockDestinoAnterior +
                        data.cantidad;
                await tx.productoBodega.update({
                    where: {
                        id: inventarioDestino.id
                    },
                    data: {
                        stock: stockDestinoNuevo
                    }
                });
            }
            /*
             * Actualizar stock de origen.
             */
            await tx.productoBodega.update({
                where: {
                    id: inventarioOrigen.id
                },
                data: {
                    stock: stockOrigenNuevo
                }
            });
            /*
             * Movimiento de salida de origen.
             */
            const movimientoOrigen = await tx.movimientoInventario.create({
                data: {
                    productoId: data.productoId,
                    bodegaId: data.bodegaOrigenId,
                    tipo: client_1.TipoMovimiento.TRANSFERENCIA,
                    cantidad: data.cantidad,
                    stockAnterior: stockOrigenAnterior,
                    stockNuevo: stockOrigenNuevo,
                    observacion: data.observacion
                        ? `Transferencia hacia ${bodegaDestino.nombre}: ${data.observacion.trim()}`
                        : `Transferencia hacia ${bodegaDestino.nombre}.`
                }
            });
            /*
             * Movimiento de entrada en destino.
             */
            const movimientoDestino = await tx.movimientoInventario.create({
                data: {
                    productoId: data.productoId,
                    bodegaId: data.bodegaDestinoId,
                    tipo: client_1.TipoMovimiento.TRANSFERENCIA,
                    cantidad: data.cantidad,
                    stockAnterior: stockDestinoAnterior,
                    stockNuevo: stockDestinoNuevo,
                    observacion: data.observacion
                        ? `Transferencia desde ${bodegaOrigen.nombre}: ${data.observacion.trim()}`
                        : `Transferencia desde ${bodegaOrigen.nombre}.`
                }
            });
            return {
                producto,
                origen: {
                    bodega: bodegaOrigen,
                    stockAnterior: stockOrigenAnterior,
                    stockNuevo: stockOrigenNuevo,
                    movimiento: movimientoOrigen
                },
                destino: {
                    bodega: bodegaDestino,
                    stockAnterior: stockDestinoAnterior,
                    stockNuevo: stockDestinoNuevo,
                    movimiento: movimientoDestino
                },
                cantidad: data.cantidad
            };
        });
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        const movimiento = await prisma_1.default.movimientoInventario.findFirst({
            where: {
                id,
                tipo: client_1.TipoMovimiento.TRANSFERENCIA,
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
            throw new AppError_1.AppError('La transferencia no existe.', 404);
        }
        return movimiento;
    }
}
exports.TransferenciaService = TransferenciaService;
