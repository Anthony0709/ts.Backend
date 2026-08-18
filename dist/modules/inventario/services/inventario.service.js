"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventarioService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class InventarioService {
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
                sku: true,
                codigoBarras: true,
                stockMinimo: true,
                stockMaximo: true
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
    async obtenerInventario(id, empresaId) {
        const inventario = await prisma_1.default.productoBodega.findFirst({
            where: {
                id,
                producto: {
                    empresaId
                },
                bodega: {
                    empresaId
                }
            },
            include: {
                producto: {
                    select: {
                        id: true,
                        codigo: true,
                        sku: true,
                        codigoBarras: true,
                        nombre: true,
                        stockMinimo: true,
                        stockMaximo: true,
                        estado: true
                    }
                },
                bodega: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true,
                        estado: true
                    }
                }
            }
        });
        if (!inventario) {
            throw new AppError_1.AppError('El registro de inventario no existe.', 404);
        }
        return inventario;
    }
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    async obtenerTodos(usuario, query) {
        const { page, limit, skip, take, search, orderBy } = (0, query_1.buildQuery)(query);
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
            ...(search && {
                OR: [
                    {
                        producto: {
                            nombre: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        producto: {
                            codigo: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        producto: {
                            sku: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        bodega: {
                            nombre: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        bodega: {
                            codigo: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            })
        };
        const [inventarios, total] = await prisma_1.default.$transaction([
            prisma_1.default.productoBodega.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            sku: true,
                            codigoBarras: true,
                            nombre: true,
                            stockMinimo: true,
                            stockMaximo: true
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
            prisma_1.default.productoBodega.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(inventarios, total, page, limit);
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        return this.obtenerInventario(id, usuario.empresaId);
    }
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        await this.validarProducto(data.productoId, empresaId);
        await this.validarBodega(data.bodegaId, empresaId);
        const existente = await prisma_1.default.productoBodega.findUnique({
            where: {
                productoId_bodegaId: {
                    productoId: data.productoId,
                    bodegaId: data.bodegaId
                }
            },
            select: {
                id: true
            }
        });
        if (existente) {
            throw new AppError_1.AppError('El producto ya tiene inventario registrado en esta bodega.', 400);
        }
        const stockInicial = data.stock ?? 0;
        return await prisma_1.default.$transaction(async (tx) => {
            const inventario = await tx.productoBodega.create({
                data: {
                    productoId: data.productoId,
                    bodegaId: data.bodegaId,
                    stock: stockInicial
                },
                include: {
                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            sku: true,
                            codigoBarras: true,
                            nombre: true
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
            /*
             * Si existe stock inicial,
             * registramos el movimiento.
             */
            if (stockInicial > 0) {
                await tx.movimientoInventario.create({
                    data: {
                        productoId: data.productoId,
                        bodegaId: data.bodegaId,
                        tipo: client_1.TipoMovimiento.AJUSTE,
                        cantidad: stockInicial,
                        stockAnterior: 0,
                        stockNuevo: stockInicial
                    }
                });
            }
            return inventario;
        });
    }
    /*=====================================================
    ===================== AJUSTAR STOCK ==================
    =====================================================*/
    async ajustar(data, usuario) {
        const empresaId = usuario.empresaId;
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
                /*---------------------------------
                | ENTRADA
                ---------------------------------*/
                case client_1.TipoMovimiento.ENTRADA:
                    stockNuevo =
                        stockAnterior +
                            data.cantidad;
                    break;
                /*---------------------------------
                | SALIDA
                ---------------------------------*/
                case client_1.TipoMovimiento.SALIDA:
                    stockNuevo =
                        stockAnterior -
                            data.cantidad;
                    if (stockNuevo < 0) {
                        throw new AppError_1.AppError('No existe stock suficiente para realizar la salida.', 400);
                    }
                    break;
                /*---------------------------------
                | AJUSTE
                ---------------------------------*/
                case client_1.TipoMovimiento.AJUSTE:
                    /*
                     * En un ajuste, cantidad
                     * representa el nuevo stock.
                     */
                    stockNuevo =
                        data.cantidad;
                    break;
                default:
                    throw new AppError_1.AppError('Tipo de movimiento no permitido en este módulo.', 400);
            }
            const actualizado = await tx.productoBodega.update({
                where: {
                    id: inventario.id
                },
                data: {
                    stock: stockNuevo
                },
                include: {
                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            sku: true,
                            codigoBarras: true,
                            nombre: true
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
            const movimiento = await tx.movimientoInventario.create({
                data: {
                    productoId: data.productoId,
                    bodegaId: data.bodegaId,
                    tipo: data.tipo,
                    cantidad: data.cantidad,
                    stockAnterior,
                    stockNuevo,
                    observacion: data.observacion?.trim()
                }
            });
            return {
                inventario: actualizado,
                movimiento
            };
        });
    }
    /*=====================================================
    ================= ACTUALIZAR STOCK ===================
    =====================================================*/
    async actualizar(id, data, usuario) {
        const inventario = await this.obtenerInventario(id, usuario.empresaId);
        const stockAnterior = inventario.stock;
        const stockNuevo = data.stock;
        return await prisma_1.default.$transaction(async (tx) => {
            const actualizado = await tx.productoBodega.update({
                where: {
                    id: inventario.id
                },
                data: {
                    stock: stockNuevo
                },
                include: {
                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            sku: true,
                            codigoBarras: true,
                            nombre: true
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
            await tx.movimientoInventario.create({
                data: {
                    productoId: inventario.productoId,
                    bodegaId: inventario.bodegaId,
                    tipo: client_1.TipoMovimiento.AJUSTE,
                    cantidad: stockNuevo,
                    stockAnterior,
                    stockNuevo,
                    observacion: 'Actualización manual de inventario.'
                }
            });
            return actualizado;
        });
    }
    /*=====================================================
    ================== MOVIMIENTOS =======================
    =====================================================*/
    async obtenerMovimientos(usuario, query) {
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
                            codigo: true,
                            sku: true,
                            nombre: true
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
}
exports.InventarioService = InventarioService;
