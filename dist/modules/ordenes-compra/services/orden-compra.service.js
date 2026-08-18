"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenCompraService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class OrdenCompraService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    async generarNumero(empresaId) {
        for (let intento = 0; intento < 20; intento++) {
            const numero = `OC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const existe = await prisma_1.default.ordenCompra.findFirst({
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
        throw new AppError_1.AppError('No fue posible generar el número de la orden de compra.', 500);
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
        if (productos.length !==
            new Set(ids).size) {
            throw new AppError_1.AppError('Uno o más productos no existen, están inactivos o no pertenecen a la empresa.', 404);
        }
        return productos;
    }
    calcularTotales(detalles, porcentajeIva) {
        let subtotal = new client_1.Prisma.Decimal(0);
        const detallesCalculados = detalles.map(detalle => {
            const cantidad = new client_1.Prisma.Decimal(detalle.cantidad);
            const costo = new client_1.Prisma.Decimal(detalle.costo);
            const detalleSubtotal = cantidad.mul(costo);
            subtotal =
                subtotal.add(detalleSubtotal);
            return {
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                costo,
                subtotal: detalleSubtotal
            };
        });
        const impuesto = subtotal
            .mul(porcentajeIva)
            .div(100);
        const total = subtotal.add(impuesto);
        return {
            detallesCalculados,
            subtotal,
            impuesto,
            total
        };
    }
    async obtenerIva(empresaId) {
        const configuracion = await prisma_1.default.configuracion.findUnique({
            where: {
                empresaId
            },
            select: {
                iva: true
            }
        });
        return configuracion?.iva ??
            new client_1.Prisma.Decimal(0);
    }
    async obtenerOrden(id, empresaId) {
        const orden = await prisma_1.default.ordenCompra.findFirst({
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
        if (!orden) {
            throw new AppError_1.AppError('La orden de compra no existe.', 404);
        }
        return orden;
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
            ...(query.fechaDesde && {
                fecha: {
                    gte: new Date(query.fechaDesde)
                }
            }),
            ...(query.fechaHasta && {
                fecha: {
                    ...(query.fechaDesde && {
                        gte: new Date(query.fechaDesde)
                    }),
                    lte: new Date(query.fechaHasta)
                }
            })
        };
        const [ordenes, total] = await prisma_1.default.$transaction([
            prisma_1.default.ordenCompra.findMany({
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
            prisma_1.default.ordenCompra.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(ordenes, total, page, limit);
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        return this.obtenerOrden(id, usuario.empresaId);
    }
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        await this.validarProveedor(data.proveedorId, empresaId);
        await this.validarProductos(data.detalles, empresaId);
        const iva = await this.obtenerIva(empresaId);
        const { detallesCalculados, subtotal, impuesto, total } = this.calcularTotales(data.detalles, iva);
        const numero = await this.generarNumero(empresaId);
        return prisma_1.default.ordenCompra.create({
            data: {
                numero,
                proveedor: {
                    connect: {
                        id: data.proveedorId
                    }
                },
                empresa: {
                    connect: {
                        id: empresaId
                    }
                },
                estado: client_1.EstadoOrdenCompra.BORRADOR,
                observacion: data.observacion?.trim(),
                subtotal,
                impuesto,
                total,
                detalles: {
                    create: detallesCalculados.map(detalle => ({
                        producto: {
                            connect: {
                                id: detalle.productoId
                            }
                        },
                        cantidad: detalle.cantidad,
                        costo: detalle.costo,
                        subtotal: detalle.subtotal
                    }))
                }
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
        const orden = await this.obtenerOrden(id, usuario.empresaId);
        if (orden.estado !==
            client_1.EstadoOrdenCompra.BORRADOR) {
            throw new AppError_1.AppError('Solo se pueden modificar órdenes de compra en estado BORRADOR.', 400);
        }
        if (data.proveedorId) {
            await this.validarProveedor(data.proveedorId, usuario.empresaId);
        }
        if (data.detalles) {
            await this.validarProductos(data.detalles, usuario.empresaId);
        }
        const iva = await this.obtenerIva(usuario.empresaId);
        const detalles = data.detalles ??
            orden.detalles.map(detalle => ({
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                costo: Number(detalle.costo)
            }));
        const { detallesCalculados, subtotal, impuesto, total } = this.calcularTotales(detalles, iva);
        return prisma_1.default.$transaction(async (tx) => {
            if (data.detalles) {
                await tx.ordenCompraDetalle.deleteMany({
                    where: {
                        ordenCompraId: orden.id
                    }
                });
            }
            return tx.ordenCompra.update({
                where: {
                    id: orden.id
                },
                data: {
                    ...(data.proveedorId && {
                        proveedor: {
                            connect: {
                                id: data.proveedorId
                            }
                        }
                    }),
                    ...(data.observacion !== undefined && {
                        observacion: data.observacion?.trim()
                    }),
                    subtotal,
                    impuesto,
                    total,
                    ...(data.detalles && {
                        detalles: {
                            create: detallesCalculados.map(detalle => ({
                                producto: {
                                    connect: {
                                        id: detalle.productoId
                                    }
                                },
                                cantidad: detalle.cantidad,
                                costo: detalle.costo,
                                subtotal: detalle.subtotal
                            }))
                        }
                    })
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
    ======================= APROBAR ======================
    =====================================================*/
    async aprobar(id, usuario) {
        const orden = await this.obtenerOrden(id, usuario.empresaId);
        if (orden.estado !==
            client_1.EstadoOrdenCompra.BORRADOR) {
            throw new AppError_1.AppError('Solo se pueden aprobar órdenes de compra en estado BORRADOR.', 400);
        }
        return prisma_1.default.ordenCompra.update({
            where: {
                id: orden.id
            },
            data: {
                estado: client_1.EstadoOrdenCompra.APROBADA
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
    ======================= CANCELAR =====================
    =====================================================*/
    async cancelar(id, usuario) {
        const orden = await this.obtenerOrden(id, usuario.empresaId);
        if (orden.estado ===
            client_1.EstadoOrdenCompra.CANCELADA) {
            throw new AppError_1.AppError('La orden de compra ya está cancelada.', 400);
        }
        if (orden.estado ===
            client_1.EstadoOrdenCompra.CONVERTIDA) {
            throw new AppError_1.AppError('Una orden de compra convertida no puede cancelarse.', 400);
        }
        return prisma_1.default.ordenCompra.update({
            where: {
                id: orden.id
            },
            data: {
                estado: client_1.EstadoOrdenCompra.CANCELADA
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
exports.OrdenCompraService = OrdenCompraService;
