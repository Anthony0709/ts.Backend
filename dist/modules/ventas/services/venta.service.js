"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentaService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class VentaService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    async generarNumero(empresaId, tx = prisma_1.default) {
        const configuracion = await tx.configuracion.findUnique({
            where: {
                empresaId
            },
            select: {
                prefijoVenta: true
            }
        });
        const prefijo = configuracion?.prefijoVenta || 'VEN';
        for (let intento = 0; intento < 20; intento++) {
            const numero = `${prefijo}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const existe = await tx.venta.findFirst({
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
        throw new AppError_1.AppError('No fue posible generar el número de venta.', 500);
    }
    /*=====================================================
    ================= VALIDAR CLIENTE ====================
    =====================================================*/
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
                identificacion: true,
                razonSocial: true,
                nombreComercial: true,
                email: true,
                telefono: true
            }
        });
        if (!cliente) {
            throw new AppError_1.AppError('El cliente no existe, está inactivo o no pertenece a la empresa.', 404);
        }
        return cliente;
    }
    /*=====================================================
    ================= VALIDAR PRODUCTOS ==================
    =====================================================*/
    async validarProductos(detalles, empresaId) {
        const ids = detalles.map(detalle => detalle.productoId);
        const idsUnicos = new Set(ids);
        if (ids.length !==
            idsUnicos.size) {
            throw new AppError_1.AppError('No se puede repetir el mismo producto en una venta.', 400);
        }
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
                sku: true,
                precioVenta: true
            }
        });
        if (productos.length !==
            idsUnicos.size) {
            throw new AppError_1.AppError('Uno o más productos no existen, están inactivos o no pertenecen a la empresa.', 404);
        }
        return productos;
    }
    /*=====================================================
    ====================== IVA ===========================
    =====================================================*/
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
    /*=====================================================
    ===================== TOTALES ========================
    =====================================================*/
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
                precio,
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
    /*=====================================================
    ================= OBTENER VENTA ======================
    =====================================================*/
    async obtenerVenta(id, empresaId) {
        const venta = await prisma_1.default.venta.findFirst({
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
                                sku: true,
                                precioVenta: true
                            }
                        }
                    }
                },
                cuentaCobrar: true
            }
        });
        if (!venta) {
            throw new AppError_1.AppError('La venta no existe.', 404);
        }
        return venta;
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
            ...(query.fechaDesde ||
                query.fechaHasta
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
        const [ventas, total] = await prisma_1.default.$transaction([
            prisma_1.default.venta.findMany({
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
            prisma_1.default.venta.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(ventas, total, page, limit);
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        return this.obtenerVenta(id, usuario.empresaId);
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
        const configuracion = await prisma_1.default.configuracion.findUnique({
            where: {
                empresaId
            },
            select: {
                aprobarVentas: true
            }
        });
        /*
         * Si aprobarVentas está activo,
         * la venta nace como BORRADOR.
         *
         * Si está desactivado, queda
         * APROBADA automáticamente.
         */
        const estadoInicial = configuracion?.aprobarVentas
            ? client_1.EstadoVenta.BORRADOR
            : client_1.EstadoVenta.APROBADA;
        const numero = await this.generarNumero(empresaId);
        return prisma_1.default.venta.create({
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
                estado: estadoInicial,
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
        const venta = await this.obtenerVenta(id, usuario.empresaId);
        if (venta.estado !==
            client_1.EstadoVenta.BORRADOR) {
            throw new AppError_1.AppError('Solo se pueden modificar ventas en estado BORRADOR.', 400);
        }
        if (data.clienteId) {
            await this.validarCliente(data.clienteId, usuario.empresaId);
        }
        if (data.detalles) {
            await this.validarProductos(data.detalles, usuario.empresaId);
        }
        const iva = await this.obtenerIva(usuario.empresaId);
        const detalles = data.detalles ??
            venta.detalles.map(detalle => ({
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                precio: Number(detalle.precio)
            }));
        const { detallesCalculados, subtotal, impuesto, total } = this.calcularTotales(detalles, iva);
        return prisma_1.default.$transaction(async (tx) => {
            /*
             * Si se enviaron detalles,
             * reemplazamos todos los anteriores.
             */
            if (data.detalles) {
                await tx.ventaDetalle.deleteMany({
                    where: {
                        ventaId: venta.id
                    }
                });
            }
            return tx.venta.update({
                where: {
                    id: venta.id
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
        const venta = await this.obtenerVenta(id, usuario.empresaId);
        if (venta.estado !==
            client_1.EstadoVenta.BORRADOR) {
            throw new AppError_1.AppError('Solo se pueden aprobar ventas en estado BORRADOR.', 400);
        }
        /*
         * IMPORTANTE:
         *
         * Tu modelo Venta no tiene bodegaId.
         * Por eso aquí NO modificamos inventario.
         *
         * El movimiento de inventario deberá hacerse
         * desde el flujo de inventario/POS cuando
         * definamos la bodega de salida.
         */
        return prisma_1.default.venta.update({
            where: {
                id: venta.id
            },
            data: {
                estado: client_1.EstadoVenta.APROBADA
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
    ======================= ANULAR =======================
    =====================================================*/
    async anular(id, usuario) {
        const venta = await this.obtenerVenta(id, usuario.empresaId);
        if (venta.estado ===
            client_1.EstadoVenta.ANULADA) {
            throw new AppError_1.AppError('La venta ya está anulada.', 400);
        }
        /*
         * Una venta aprobada ya representa
         * una operación realizada.
         *
         * Por ahora no hacemos devolución
         * automática de inventario porque
         * Venta no conoce la bodega.
         */
        return prisma_1.default.venta.update({
            where: {
                id: venta.id
            },
            data: {
                estado: client_1.EstadoVenta.ANULADA
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
exports.VentaService = VentaService;
