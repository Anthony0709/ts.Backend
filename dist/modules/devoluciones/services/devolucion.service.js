"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevolucionService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class DevolucionService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    async generarNumero(empresaId) {
        for (let intento = 0; intento < 20; intento++) {
            const numero = `DEV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const existe = await prisma_1.default.devolucion.findFirst({
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
        throw new AppError_1.AppError('No fue posible generar el número de devolución.', 500);
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
    async validarProductos(detalles, empresaId) {
        const ids = detalles.map(detalle => detalle.productoId);
        const productos = await prisma_1.default.producto.findMany({
            where: {
                id: {
                    in: ids
                },
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
        if (productos.length !== ids.length) {
            throw new AppError_1.AppError('Uno o más productos no existen, están inactivos o no pertenecen a la empresa.', 404);
        }
        return productos;
    }
    async obtenerDevolucion(id, empresaId) {
        const devolucion = await prisma_1.default.devolucion.findFirst({
            where: {
                id,
                empresaId
            },
            include: {
                empresa: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                bodega: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
                    }
                },
                venta: true,
                compra: true,
                detalles: {
                    include: {
                        producto: {
                            select: {
                                id: true,
                                nombre: true,
                                codigo: true,
                                sku: true
                            }
                        }
                    }
                }
            }
        });
        if (!devolucion) {
            throw new AppError_1.AppError('La devolución no existe.', 404);
        }
        return devolucion;
    }
    /*=====================================================
    ====================== LISTAR ========================
    =====================================================*/
    async obtenerTodos(usuario, query) {
        const { page, limit, skip, take, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
            empresaId: usuario.empresaId,
            ...(query.tipo && {
                tipo: query.tipo
            }),
            ...(query.estado && {
                estado: query.estado
            }),
            ...(query.ventaId && {
                ventaId: query.ventaId
            }),
            ...(query.compraId && {
                compraId: query.compraId
            }),
            ...(query.bodegaId && {
                bodegaId: query.bodegaId
            })
        };
        const [devoluciones, total] = await prisma_1.default.$transaction([
            prisma_1.default.devolucion.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    bodega: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true
                        }
                    },
                    detalles: {
                        include: {
                            producto: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    codigo: true,
                                    sku: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma_1.default.devolucion.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(devoluciones, total, page, limit);
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        return this.obtenerDevolucion(id, usuario.empresaId);
    }
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        /*
         * Validar bodega.
         */
        await this.validarBodega(data.bodegaId, empresaId);
        /*
         * Validar productos.
         */
        await this.validarProductos(data.detalles, empresaId);
        /*
         * Validar que venta y compra
         * pertenezcan a la empresa.
         */
        if (data.tipo === 'VENTA') {
            const venta = await prisma_1.default.venta.findFirst({
                where: {
                    id: data.ventaId,
                    empresaId
                },
                select: {
                    id: true
                }
            });
            if (!venta) {
                throw new AppError_1.AppError('La venta no existe o no pertenece a la empresa.', 404);
            }
        }
        if (data.tipo === 'COMPRA') {
            const compra = await prisma_1.default.compra.findFirst({
                where: {
                    id: data.compraId,
                    empresaId
                },
                select: {
                    id: true
                }
            });
            if (!compra) {
                throw new AppError_1.AppError('La compra no existe o no pertenece a la empresa.', 404);
            }
        }
        const numero = await this.generarNumero(empresaId);
        /*
         * Crear devolución en BORRADOR.
         *
         * NO modifica stock todavía.
         */
        return await prisma_1.default.devolucion.create({
            data: {
                numero,
                tipo: data.tipo,
                estado: 'BORRADOR',
                empresa: {
                    connect: {
                        id: empresaId
                    }
                },
                bodega: {
                    connect: {
                        id: data.bodegaId
                    }
                },
                ...(data.ventaId && {
                    venta: {
                        connect: {
                            id: data.ventaId
                        }
                    }
                }),
                ...(data.compraId && {
                    compra: {
                        connect: {
                            id: data.compraId
                        }
                    }
                }),
                observacion: data.observacion?.trim(),
                detalles: {
                    create: data.detalles.map(detalle => ({
                        producto: {
                            connect: {
                                id: detalle.productoId
                            }
                        },
                        cantidad: detalle.cantidad
                    }))
                }
            },
            include: {
                bodega: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
                    }
                },
                detalles: {
                    include: {
                        producto: {
                            select: {
                                id: true,
                                nombre: true,
                                codigo: true,
                                sku: true
                            }
                        }
                    }
                }
            }
        });
    }
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    async actualizar(id, data, usuario) {
        const devolucion = await this.obtenerDevolucion(id, usuario.empresaId);
        if (devolucion.estado !==
            'BORRADOR') {
            throw new AppError_1.AppError('Solo se pueden modificar devoluciones en estado BORRADOR.', 400);
        }
        return prisma_1.default.devolucion.update({
            where: {
                id: devolucion.id
            },
            data: {
                ...(data.observacion !== undefined && {
                    observacion: data.observacion?.trim()
                })
            },
            include: {
                bodega: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
                    }
                },
                detalles: {
                    include: {
                        producto: {
                            select: {
                                id: true,
                                nombre: true,
                                codigo: true,
                                sku: true
                            }
                        }
                    }
                }
            }
        });
    }
    /*=====================================================
    ====================== APROBAR =======================
    =====================================================*/
    async aprobar(id, usuario) {
        const devolucion = await this.obtenerDevolucion(id, usuario.empresaId);
        if (devolucion.estado !==
            'BORRADOR') {
            throw new AppError_1.AppError('Solo se pueden aprobar devoluciones en estado BORRADOR.', 400);
        }
        return prisma_1.default.$transaction(async (tx) => {
            /*
             * Procesar cada detalle.
             */
            for (const detalle of devolucion.detalles) {
                const inventario = await tx.productoBodega.findUnique({
                    where: {
                        productoId_bodegaId: {
                            productoId: detalle.productoId,
                            bodegaId: devolucion.bodegaId
                        }
                    }
                });
                /*
                 * Si es devolución de VENTA:
                 *
                 * Producto vuelve a nuestra bodega.
                 */
                if (devolucion.tipo ===
                    'VENTA') {
                    if (inventario) {
                        const stockAnterior = inventario.stock;
                        const stockNuevo = stockAnterior +
                            detalle.cantidad;
                        await tx.productoBodega.update({
                            where: {
                                id: inventario.id
                            },
                            data: {
                                stock: stockNuevo
                            }
                        });
                        await tx.movimientoInventario.create({
                            data: {
                                productoId: detalle.productoId,
                                bodegaId: devolucion.bodegaId,
                                tipo: client_1.TipoMovimiento.ENTRADA,
                                cantidad: detalle.cantidad,
                                stockAnterior,
                                stockNuevo,
                                observacion: `Devolución de venta ${devolucion.numero}`
                            }
                        });
                    }
                    else {
                        await tx.productoBodega.create({
                            data: {
                                productoId: detalle.productoId,
                                bodegaId: devolucion.bodegaId,
                                stock: detalle.cantidad
                            }
                        });
                        await tx.movimientoInventario.create({
                            data: {
                                productoId: detalle.productoId,
                                bodegaId: devolucion.bodegaId,
                                tipo: client_1.TipoMovimiento.ENTRADA,
                                cantidad: detalle.cantidad,
                                stockAnterior: 0,
                                stockNuevo: detalle.cantidad,
                                observacion: `Devolución de venta ${devolucion.numero}`
                            }
                        });
                    }
                }
                /*
                 * Si es devolución de COMPRA:
                 *
                 * Producto sale de nuestra bodega.
                 */
                if (devolucion.tipo ===
                    'COMPRA') {
                    if (!inventario) {
                        throw new AppError_1.AppError(`No existe inventario para el producto ${detalle.producto.nombre}.`, 400);
                    }
                    const stockAnterior = inventario.stock;
                    const stockNuevo = stockAnterior -
                        detalle.cantidad;
                    if (stockNuevo < 0) {
                        throw new AppError_1.AppError(`Stock insuficiente para devolver el producto ${detalle.producto.nombre}.`, 400);
                    }
                    await tx.productoBodega.update({
                        where: {
                            id: inventario.id
                        },
                        data: {
                            stock: stockNuevo
                        }
                    });
                    await tx.movimientoInventario.create({
                        data: {
                            productoId: detalle.productoId,
                            bodegaId: devolucion.bodegaId,
                            tipo: client_1.TipoMovimiento.SALIDA,
                            cantidad: detalle.cantidad,
                            stockAnterior,
                            stockNuevo,
                            observacion: `Devolución de compra ${devolucion.numero}`
                        }
                    });
                }
            }
            /*
             * Cambiar estado.
             */
            return tx.devolucion.update({
                where: {
                    id: devolucion.id
                },
                data: {
                    estado: 'APROBADA'
                },
                include: {
                    bodega: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true
                        }
                    },
                    detalles: {
                        include: {
                            producto: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    codigo: true,
                                    sku: true
                                }
                            }
                        }
                    }
                }
            });
        });
    }
    /*=====================================================
    ====================== ANULAR ========================
    =====================================================*/
    async anular(id, usuario) {
        const devolucion = await this.obtenerDevolucion(id, usuario.empresaId);
        if (devolucion.estado ===
            'ANULADA') {
            throw new AppError_1.AppError('La devolución ya está anulada.', 400);
        }
        if (devolucion.estado ===
            'APROBADA') {
            throw new AppError_1.AppError('Una devolución aprobada no puede anularse directamente.', 400);
        }
        return prisma_1.default.devolucion.update({
            where: {
                id: devolucion.id
            },
            data: {
                estado: 'ANULADA'
            },
            include: {
                bodega: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
                    }
                },
                detalles: {
                    include: {
                        producto: {
                            select: {
                                id: true,
                                nombre: true,
                                codigo: true,
                                sku: true
                            }
                        }
                    }
                }
            }
        });
    }
}
exports.DevolucionService = DevolucionService;
