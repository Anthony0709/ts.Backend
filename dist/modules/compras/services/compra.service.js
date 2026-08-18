"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompraService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class CompraService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    async generarNumero(empresaId, tx = prisma_1.default) {
        const configuracion = await tx.configuracion.findUnique({
            where: {
                empresaId
            },
            select: {
                prefijoCompra: true
            }
        });
        const prefijo = configuracion?.prefijoCompra || 'COM';
        for (let intento = 0; intento < 20; intento++) {
            const numero = `${prefijo}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const existe = await tx.compra.findFirst({
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
        throw new AppError_1.AppError('No fue posible generar el número de compra.', 500);
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
                ruc: true,
                diasCredito: true
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
        const idsUnicos = new Set(ids);
        if (productos.length !==
            idsUnicos.size) {
            throw new AppError_1.AppError('Uno o más productos no existen, están inactivos o no pertenecen a la empresa.', 404);
        }
        return productos;
    }
    calcularTotales(detalles, porcentajeIva) {
        let subtotal = new client_1.Prisma.Decimal(0);
        const detallesCalculados = detalles.map(detalle => {
            const cantidad = new client_1.Prisma.Decimal(detalle.cantidad);
            const costo = new client_1.Prisma.Decimal(detalle.costo);
            const subtotalDetalle = cantidad.mul(costo);
            subtotal =
                subtotal.add(subtotalDetalle);
            return {
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                costo,
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
    async obtenerCompra(id, empresaId) {
        const compra = await prisma_1.default.compra.findFirst({
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
                        ruc: true,
                        diasCredito: true
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
                },
                cuentaPagar: true
            }
        });
        if (!compra) {
            throw new AppError_1.AppError('La compra no existe.', 404);
        }
        return compra;
    }
    async generarNumeroCuentaPagar(empresaId, tx) {
        for (let intento = 0; intento < 20; intento++) {
            const numero = `CP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const existe = await tx.cuentaPagar.findFirst({
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
        throw new AppError_1.AppError('No fue posible generar el número de cuenta por pagar.', 500);
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
        const [compras, total] = await prisma_1.default.$transaction([
            prisma_1.default.compra.findMany({
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
                    },
                    cuentaPagar: true
                }
            }),
            prisma_1.default.compra.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(compras, total, page, limit);
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        return this.obtenerCompra(id, usuario.empresaId);
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
        return prisma_1.default.compra.create({
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
                estado: client_1.EstadoCompra.BORRADOR,
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
        const compra = await this.obtenerCompra(id, usuario.empresaId);
        if (compra.estado !==
            client_1.EstadoCompra.BORRADOR) {
            throw new AppError_1.AppError('Solo se pueden modificar compras en estado BORRADOR.', 400);
        }
        if (data.proveedorId) {
            await this.validarProveedor(data.proveedorId, usuario.empresaId);
        }
        if (data.detalles) {
            await this.validarProductos(data.detalles, usuario.empresaId);
        }
        const iva = await this.obtenerIva(usuario.empresaId);
        const detalles = data.detalles ??
            compra.detalles.map(detalle => ({
                productoId: detalle.productoId,
                cantidad: detalle.cantidad,
                costo: Number(detalle.costo)
            }));
        const { detallesCalculados, subtotal, impuesto, total } = this.calcularTotales(detalles, iva);
        return prisma_1.default.$transaction(async (tx) => {
            if (data.detalles) {
                await tx.compraDetalle.deleteMany({
                    where: {
                        compraId: compra.id
                    }
                });
            }
            return tx.compra.update({
                where: {
                    id: compra.id
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
                    },
                    cuentaPagar: true
                }
            });
        });
    }
    /*=====================================================
    ======================= APROBAR ======================
    =====================================================*/
    async aprobar(id, usuario) {
        const empresaId = usuario.empresaId;
        const compra = await this.obtenerCompra(id, empresaId);
        if (compra.estado !==
            client_1.EstadoCompra.BORRADOR) {
            throw new AppError_1.AppError('Solo se pueden aprobar compras en estado BORRADOR.', 400);
        }
        const configuracion = await prisma_1.default.configuracion.findUnique({
            where: {
                empresaId
            },
            select: {
                aprobarCompras: true
            }
        });
        /*
         * Si la configuración exige aprobación,
         * este endpoint representa precisamente
         * la aprobación.
         *
         * Si no la exige, igualmente se permite
         * aprobar manualmente.
         */
        return prisma_1.default.$transaction(async (tx) => {
            const compraActualizada = await tx.compra.update({
                where: {
                    id: compra.id
                },
                data: {
                    estado: client_1.EstadoCompra.APROBADA
                },
                include: {
                    proveedor: {
                        select: {
                            id: true,
                            nombreComercial: true,
                            razonSocial: true,
                            ruc: true,
                            diasCredito: true
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
                    },
                    cuentaPagar: true
                }
            });
            /*
             * Una compra aprobada genera
             * la cuenta por pagar.
             */
            if (!compraActualizada.cuentaPagar) {
                const numeroCuenta = await this.generarNumeroCuentaPagar(empresaId, tx);
                const fechaVencimiento = compraActualizada.proveedor.diasCredito > 0
                    ? new Date(Date.now() +
                        compraActualizada.proveedor.diasCredito *
                            24 *
                            60 *
                            60 *
                            1000)
                    : null;
                await tx.cuentaPagar.create({
                    data: {
                        numero: numeroCuenta,
                        proveedor: {
                            connect: {
                                id: compraActualizada.proveedorId
                            }
                        },
                        empresa: {
                            connect: {
                                id: empresaId
                            }
                        },
                        compra: {
                            connect: {
                                id: compraActualizada.id
                            }
                        },
                        estado: 'PENDIENTE',
                        total: compraActualizada.total,
                        saldo: compraActualizada.total,
                        fechaVencimiento,
                        observacion: `Cuenta generada por compra ${compraActualizada.numero}`
                    }
                });
            }
            return tx.compra.findUnique({
                where: {
                    id: compraActualizada.id
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
                    },
                    cuentaPagar: true
                }
            });
        });
    }
    /*=====================================================
    ======================== ANULAR ======================
    =====================================================*/
    async anular(id, usuario) {
        const compra = await this.obtenerCompra(id, usuario.empresaId);
        if (compra.estado ===
            client_1.EstadoCompra.ANULADA) {
            throw new AppError_1.AppError('La compra ya está anulada.', 400);
        }
        if (compra.estado ===
            client_1.EstadoCompra.APROBADA) {
            throw new AppError_1.AppError('Una compra aprobada no puede anularse directamente. Debe realizarse el proceso de devolución correspondiente.', 400);
        }
        return prisma_1.default.compra.update({
            where: {
                id: compra.id
            },
            data: {
                estado: client_1.EstadoCompra.ANULADA
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
                },
                cuentaPagar: true
            }
        });
    }
}
exports.CompraService = CompraService;
