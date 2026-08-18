"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class CotizacionService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    async generarNumero(empresaId, tx = prisma_1.default) {
        const configuracion = await tx.configuracion.findUnique({
            where: {
                empresaId
            },
            select: {
                prefijoCotizacion: true
            }
        });
        const prefijo = configuracion?.prefijoCotizacion || 'COT';
        for (let intento = 0; intento < 20; intento++) {
            const numero = `${prefijo}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const existe = await tx.cotizacion.findFirst({
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
        throw new AppError_1.AppError('No fue posible generar el número de cotización.', 500);
    }
    async validarCliente(clienteId, empresaId) {
        const cliente = await prisma_1.default.cliente.findFirst({
            where: {
                id: clienteId,
                empresaId,
                estado: true
            },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                razonSocial: true,
                nombreComercial: true,
                identificacion: true
            }
        });
        if (!cliente) {
            throw new AppError_1.AppError('El cliente no existe, está inactivo o no pertenece a la empresa.', 404);
        }
        return cliente;
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
        const idsUnicos = new Set(ids);
        if (productos.length !==
            idsUnicos.size) {
            throw new AppError_1.AppError('Uno o más productos no existen, están inactivos o no pertenecen a la empresa.', 404);
        }
        return productos;
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
    calcularTotales(detalles, porcentajeIva) {
        let subtotal = new client_1.Prisma.Decimal(0);
        const detallesCalculados = detalles.map(detalle => {
            const cantidad = new client_1.Prisma.Decimal(detalle.cantidad);
            const precio = new client_1.Prisma.Decimal(detalle.precio);
            const subtotalDetalle = cantidad.mul(precio);
            subtotal =
                subtotal.add(subtotalDetalle);
            return {
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                precio: precio,
                subtotal: subtotalDetalle
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
    async obtenerCotizacion(id, empresaId) {
        const cotizacion = await prisma_1.default.cotizacion.findFirst({
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
                        razonSocial: true,
                        nombreComercial: true,
                        email: true,
                        telefono: true
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
        if (!cotizacion) {
            throw new AppError_1.AppError('La cotización no existe.', 404);
        }
        return cotizacion;
    }
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    async obtenerTodos(usuario, query) {
        const { page, limit, skip, take } = (0, query_1.buildQuery)(query);
        const where = {
            empresaId: usuario.empresaId,
            ...(query.clienteId && {
                clienteId: query.clienteId
            }),
            ...(query.estado && {
                estado: query.estado
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
                : {})
        };
        const [cotizaciones, total] = await prisma_1.default.$transaction([
            prisma_1.default.cotizacion.findMany({
                where,
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
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
            prisma_1.default.cotizacion.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(cotizaciones, total, page, limit);
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        return this.obtenerCotizacion(id, usuario.empresaId);
    }
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        await this.validarCliente(data.clienteId, empresaId);
        await this.validarProductos(data.detalles, empresaId);
        const iva = await this.obtenerIva(empresaId);
        const { detallesCalculados, subtotal, impuesto, total } = this.calcularTotales(data.detalles, iva);
        const numero = await this.generarNumero(empresaId);
        return prisma_1.default.cotizacion.create({
            data: {
                numero,
                cliente: {
                    connect: {
                        id: data.clienteId
                    }
                },
                empresa: {
                    connect: {
                        id: empresaId
                    }
                },
                estado: client_1.EstadoCotizacion.BORRADOR,
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
                        precio: detalle.precio,
                        subtotal: detalle.subtotal
                    }))
                }
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
        const cotizacion = await this.obtenerCotizacion(id, usuario.empresaId);
        if (cotizacion.estado !==
            client_1.EstadoCotizacion.BORRADOR) {
            throw new AppError_1.AppError('Solo se pueden modificar cotizaciones en estado BORRADOR.', 400);
        }
        if (data.clienteId) {
            await this.validarCliente(data.clienteId, usuario.empresaId);
        }
        if (data.detalles) {
            await this.validarProductos(data.detalles, usuario.empresaId);
        }
        const iva = await this.obtenerIva(usuario.empresaId);
        const detalles = data.detalles ??
            cotizacion.detalles.map(detalle => ({
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                precio: Number(detalle.precio)
            }));
        const { detallesCalculados, subtotal, impuesto, total } = this.calcularTotales(detalles, iva);
        return prisma_1.default.$transaction(async (tx) => {
            if (data.detalles) {
                await tx.cotizacionDetalle.deleteMany({
                    where: {
                        cotizacionId: cotizacion.id
                    }
                });
            }
            return tx.cotizacion.update({
                where: {
                    id: cotizacion.id
                },
                data: {
                    ...(data.clienteId && {
                        cliente: {
                            connect: {
                                id: data.clienteId
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
                                precio: detalle.precio,
                                subtotal: detalle.subtotal
                            }))
                        }
                    })
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
        const cotizacion = await this.obtenerCotizacion(id, usuario.empresaId);
        if (cotizacion.estado !==
            client_1.EstadoCotizacion.BORRADOR) {
            throw new AppError_1.AppError('Solo se pueden aprobar cotizaciones en estado BORRADOR.', 400);
        }
        return prisma_1.default.cotizacion.update({
            where: {
                id: cotizacion.id
            },
            data: {
                estado: client_1.EstadoCotizacion.APROBADA
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
    ====================== RECHAZAR ======================
    =====================================================*/
    async rechazar(id, usuario) {
        const cotizacion = await this.obtenerCotizacion(id, usuario.empresaId);
        if (cotizacion.estado !==
            client_1.EstadoCotizacion.BORRADOR) {
            throw new AppError_1.AppError('Solo se pueden rechazar cotizaciones en estado BORRADOR.', 400);
        }
        return prisma_1.default.cotizacion.update({
            where: {
                id: cotizacion.id
            },
            data: {
                estado: client_1.EstadoCotizacion.RECHAZADA
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
    ===================== CONVERTIR ======================
    =====================================================*/
    async convertir(id, usuario) {
        const cotizacion = await this.obtenerCotizacion(id, usuario.empresaId);
        if (cotizacion.estado !==
            client_1.EstadoCotizacion.APROBADA) {
            throw new AppError_1.AppError('Solo se pueden convertir cotizaciones que estén APROBADAS.', 400);
        }
        return prisma_1.default.cotizacion.update({
            where: {
                id: cotizacion.id
            },
            data: {
                estado: client_1.EstadoCotizacion.CONVERTIDA
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
exports.CotizacionService = CotizacionService;
