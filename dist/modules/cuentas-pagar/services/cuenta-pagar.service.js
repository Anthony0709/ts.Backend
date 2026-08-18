"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuentaPagarService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class CuentaPagarService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    async generarNumero(empresaId, tx = prisma_1.default) {
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
    async obtenerCuenta(id, empresaId) {
        const cuenta = await prisma_1.default.cuentaPagar.findFirst({
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
                compra: {
                    select: {
                        id: true,
                        numero: true,
                        fecha: true,
                        estado: true,
                        subtotal: true,
                        impuesto: true,
                        total: true
                    }
                },
                pagos: {
                    orderBy: {
                        fecha: 'desc'
                    }
                }
            }
        });
        if (!cuenta) {
            throw new AppError_1.AppError('La cuenta por pagar no existe.', 404);
        }
        return cuenta;
    }
    calcularEstado(saldo, fechaVencimiento) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (saldo.lessThanOrEqualTo(0)) {
            return client_1.EstadoCuentaPagar.PAGADA;
        }
        if (fechaVencimiento) {
            const vencimiento = new Date(fechaVencimiento);
            vencimiento.setHours(0, 0, 0, 0);
            if (vencimiento < hoy) {
                return client_1.EstadoCuentaPagar.VENCIDA;
            }
        }
        return client_1.EstadoCuentaPagar.PENDIENTE;
    }
    async actualizarVencida(cuenta) {
        if (cuenta.saldo.lessThanOrEqualTo(0)) {
            return;
        }
        const nuevoEstado = this.calcularEstado(cuenta.saldo, cuenta.fechaVencimiento);
        if (nuevoEstado !==
            cuenta.estado) {
            return prisma_1.default.cuentaPagar.update({
                where: {
                    id: cuenta.id
                },
                data: {
                    estado: nuevoEstado
                }
            });
        }
    }
    async obtenerProveedor(proveedorId, empresaId) {
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
            ...(query.compraId && {
                compraId: query.compraId
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
            }),
            ...(query.vencimientoDesde && {
                fechaVencimiento: {
                    gte: new Date(query.vencimientoDesde)
                }
            }),
            ...(query.vencimientoHasta && {
                fechaVencimiento: {
                    ...(query.vencimientoDesde && {
                        gte: new Date(query.vencimientoDesde)
                    }),
                    lte: new Date(query.vencimientoHasta)
                }
            })
        };
        const [cuentas, total] = await prisma_1.default.$transaction([
            prisma_1.default.cuentaPagar.findMany({
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
                    compra: {
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
            prisma_1.default.cuentaPagar.count({
                where
            })
        ]);
        /*
         * Actualizamos las cuentas vencidas
         * después de obtenerlas.
         */
        for (const cuenta of cuentas) {
            await this.actualizarVencida({
                id: cuenta.id,
                estado: cuenta.estado,
                saldo: cuenta.saldo,
                fechaVencimiento: cuenta.fechaVencimiento
            });
        }
        return (0, paginatedResponse_1.paginatedResponse)(cuentas, total, page, limit);
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        const cuenta = await this.obtenerCuenta(id, usuario.empresaId);
        await this.actualizarVencida({
            id: cuenta.id,
            estado: cuenta.estado,
            saldo: cuenta.saldo,
            fechaVencimiento: cuenta.fechaVencimiento
        });
        return this.obtenerCuenta(id, usuario.empresaId);
    }
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        /*
         * La cuenta nace desde una compra.
         */
        const compra = await prisma_1.default.compra.findFirst({
            where: {
                id: data.compraId,
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
                cuentaPagar: {
                    select: {
                        id: true
                    }
                }
            }
        });
        if (!compra) {
            throw new AppError_1.AppError('La compra no existe o no pertenece a la empresa.', 404);
        }
        /*
         * Solo una cuenta por compra.
         */
        if (compra.cuentaPagar) {
            throw new AppError_1.AppError('La compra ya tiene una cuenta por pagar asociada.', 400);
        }
        /*
         * Una cuenta por pagar solo debe
         * generarse sobre una compra aprobada.
         */
        if (compra.estado !==
            'APROBADA') {
            throw new AppError_1.AppError('Solo se puede crear una cuenta por pagar para una compra APROBADA.', 400);
        }
        const numero = await this.generarNumero(empresaId);
        let fechaVencimiento = null;
        if (data.fechaVencimiento) {
            fechaVencimiento =
                new Date(data.fechaVencimiento);
        }
        else if (compra.proveedor.diasCredito > 0) {
            fechaVencimiento =
                new Date();
            fechaVencimiento.setDate(fechaVencimiento.getDate() +
                compra.proveedor.diasCredito);
        }
        return prisma_1.default.cuentaPagar.create({
            data: {
                numero,
                fechaVencimiento,
                proveedor: {
                    connect: {
                        id: compra.proveedorId
                    }
                },
                empresa: {
                    connect: {
                        id: empresaId
                    }
                },
                compra: {
                    connect: {
                        id: compra.id
                    }
                },
                estado: client_1.EstadoCuentaPagar.PENDIENTE,
                total: compra.total,
                saldo: compra.total,
                observacion: data.observacion?.trim()
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
                compra: {
                    select: {
                        id: true,
                        numero: true,
                        fecha: true,
                        total: true,
                        estado: true
                    }
                },
                pagos: true
            }
        });
    }
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    async actualizar(id, data, usuario) {
        const cuenta = await this.obtenerCuenta(id, usuario.empresaId);
        if (cuenta.estado ===
            client_1.EstadoCuentaPagar.PAGADA) {
            throw new AppError_1.AppError('No se puede modificar una cuenta por pagar que ya está pagada.', 400);
        }
        if (data.fechaVencimiento) {
            const fecha = new Date(data.fechaVencimiento);
            if (fecha < cuenta.fecha) {
                throw new AppError_1.AppError('La fecha de vencimiento no puede ser anterior a la fecha de la cuenta.', 400);
            }
        }
        return prisma_1.default.cuentaPagar.update({
            where: {
                id: cuenta.id
            },
            data: {
                ...(data.fechaVencimiento !== undefined && {
                    fechaVencimiento: new Date(data.fechaVencimiento)
                }),
                ...(data.observacion !== undefined && {
                    observacion: data.observacion?.trim()
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
                compra: {
                    select: {
                        id: true,
                        numero: true,
                        fecha: true,
                        total: true,
                        estado: true
                    }
                },
                pagos: {
                    orderBy: {
                        fecha: 'desc'
                    }
                }
            }
        });
    }
    /*=====================================================
    ==================== REGISTRAR PAGO ==================
    =====================================================*/
    async registrarPago(id, data, usuario) {
        const cuenta = await this.obtenerCuenta(id, usuario.empresaId);
        /*
         * No se puede pagar una cuenta
         * que ya está completamente pagada.
         */
        if (cuenta.saldo.lessThanOrEqualTo(0)) {
            throw new AppError_1.AppError('La cuenta por pagar ya está completamente pagada.', 400);
        }
        const monto = new client_1.Prisma.Decimal(data.monto);
        /*
         * El pago no puede superar el saldo.
         */
        if (monto.greaterThan(cuenta.saldo)) {
            throw new AppError_1.AppError('El monto del pago no puede ser mayor al saldo pendiente.', 400);
        }
        const nuevoSaldo = cuenta.saldo.sub(monto);
        let nuevoEstado;
        if (nuevoSaldo.equals(0)) {
            nuevoEstado =
                client_1.EstadoCuentaPagar.PAGADA;
        }
        else {
            nuevoEstado =
                client_1.EstadoCuentaPagar.PARCIAL;
        }
        return prisma_1.default.$transaction(async (tx) => {
            /*
             * Crear el abono.
             */
            const pago = await tx.abonoCuentaPagar.create({
                data: {
                    cuentaPagar: {
                        connect: {
                            id: cuenta.id
                        }
                    },
                    monto,
                    metodoPago: data.metodoPago,
                    referencia: data.referencia?.trim(),
                    observacion: data.observacion?.trim()
                }
            });
            /*
             * Actualizar saldo y estado.
             */
            const cuentaActualizada = await tx.cuentaPagar.update({
                where: {
                    id: cuenta.id
                },
                data: {
                    saldo: nuevoSaldo,
                    estado: nuevoEstado
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
                    compra: {
                        select: {
                            id: true,
                            numero: true,
                            total: true
                        }
                    },
                    pagos: {
                        orderBy: {
                            fecha: 'desc'
                        }
                    }
                }
            });
            return {
                pago,
                cuenta: cuentaActualizada
            };
        });
    }
    /*=====================================================
    =================== CONSULTAR PAGOS ==================
    =====================================================*/
    async obtenerPagos(id, usuario, query) {
        const cuenta = await prisma_1.default.cuentaPagar.findFirst({
            where: {
                id,
                empresaId: usuario.empresaId
            },
            select: {
                id: true,
                numero: true
            }
        });
        if (!cuenta) {
            throw new AppError_1.AppError('La cuenta por pagar no existe.', 404);
        }
        const { page, limit, skip, take } = (0, query_1.buildQuery)(query);
        const where = {
            cuentaPagarId: cuenta.id,
            ...(query.metodoPago && {
                metodoPago: query.metodoPago
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
        const [pagos, total] = await prisma_1.default.$transaction([
            prisma_1.default.abonoCuentaPagar.findMany({
                where,
                skip,
                take,
                orderBy: {
                    fecha: 'desc'
                }
            }),
            prisma_1.default.abonoCuentaPagar.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(pagos, total, page, limit);
    }
}
exports.CuentaPagarService = CuentaPagarService;
