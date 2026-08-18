"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporteService = exports.ReporteService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class ReporteService {
    obtenerFechas(filtros) {
        const fechaDesde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : undefined;
        const fechaHasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : undefined;
        if (fechaHasta)
            fechaHasta.setHours(23, 59, 59, 999);
        return { fechaDesde, fechaHasta };
    }
    obtenerRango(fechaDesde, fechaHasta) {
        if (!fechaDesde && !fechaHasta)
            return undefined;
        return {
            ...(fechaDesde ? { gte: fechaDesde } : {}),
            ...(fechaHasta ? { lte: fechaHasta } : {})
        };
    }
    async ventas(empresaId, filtros) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where = {
            empresaId,
            ...(filtros.clienteId ? { clienteId: filtros.clienteId } : {}),
            ...(filtros.estado ? { estado: filtros.estado } : {}),
            ...(fechaDesde || fechaHasta ? { fecha: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [ventas, total, resumen] = await prisma_1.default.$transaction([
            prisma_1.default.venta.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: { fecha: 'desc' },
                include: {
                    cliente: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            identificacion: true,
                            razonSocial: true
                        }
                    },
                    detalles: {
                        include: {
                            producto: {
                                select: {
                                    id: true,
                                    codigo: true,
                                    nombre: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma_1.default.venta.count({ where }),
            prisma_1.default.venta.aggregate({
                where,
                _sum: {
                    subtotal: true,
                    impuesto: true,
                    total: true
                }
            })
        ]);
        return {
            ...(0, paginatedResponse_1.paginatedResponse)(ventas, total, filtros.page, filtros.limit),
            resumen: {
                subtotal: resumen._sum.subtotal ?? new client_1.Prisma.Decimal(0),
                impuesto: resumen._sum.impuesto ?? new client_1.Prisma.Decimal(0),
                total: resumen._sum.total ?? new client_1.Prisma.Decimal(0)
            }
        };
    }
    async compras(empresaId, filtros) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where = {
            empresaId,
            ...(filtros.proveedorId ? { proveedorId: filtros.proveedorId } : {}),
            ...(filtros.estado ? { estado: filtros.estado } : {}),
            ...(fechaDesde || fechaHasta ? { fecha: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [compras, total, resumen] = await prisma_1.default.$transaction([
            prisma_1.default.compra.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: { fecha: 'desc' },
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
                                    codigo: true,
                                    nombre: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma_1.default.compra.count({ where }),
            prisma_1.default.compra.aggregate({
                where,
                _sum: {
                    subtotal: true,
                    impuesto: true,
                    total: true
                }
            })
        ]);
        return {
            ...(0, paginatedResponse_1.paginatedResponse)(compras, total, filtros.page, filtros.limit),
            resumen: {
                subtotal: resumen._sum.subtotal ?? new client_1.Prisma.Decimal(0),
                impuesto: resumen._sum.impuesto ?? new client_1.Prisma.Decimal(0),
                total: resumen._sum.total ?? new client_1.Prisma.Decimal(0)
            }
        };
    }
    async inventario(empresaId, filtros) {
        const where = {
            bodega: {
                empresaId
            },
            ...(filtros.bodegaId ? { bodegaId: filtros.bodegaId } : {}),
            ...(filtros.productoId ? { productoId: filtros.productoId } : {})
        };
        const [inventarios, total] = await prisma_1.default.$transaction([
            prisma_1.default.productoBodega.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: {
                    stock: 'asc'
                },
                include: {
                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            sku: true,
                            codigoBarras: true,
                            nombre: true,
                            precioCompra: true,
                            precioVenta: true,
                            stockMinimo: true,
                            stockMaximo: true,
                            estado: true,
                            categoria: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            },
                            marca: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            }
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
            prisma_1.default.productoBodega.count({ where })
        ]);
        const stockTotal = inventarios.reduce((total, item) => total + item.stock, 0);
        const bajoStock = inventarios.filter(item => item.stock <= item.producto.stockMinimo).length;
        return {
            ...(0, paginatedResponse_1.paginatedResponse)(inventarios, total, filtros.page, filtros.limit),
            resumen: {
                stockTotal,
                registrosBajoStock: bajoStock
            }
        };
    }
    async clientes(empresaId, filtros) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where = {
            empresaId,
            ...(filtros.estado ? { estado: filtros.estado === 'true' } : {}),
            ...(fechaDesde || fechaHasta ? { createdAt: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [clientes, total] = await prisma_1.default.$transaction([
            prisma_1.default.cliente.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    _count: {
                        select: {
                            ventas: true,
                            cuentasCobrar: true
                        }
                    }
                }
            }),
            prisma_1.default.cliente.count({ where })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(clientes, total, filtros.page, filtros.limit);
    }
    async cuentasCobrar(empresaId, filtros) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where = {
            empresaId,
            ...(filtros.clienteId ? { clienteId: filtros.clienteId } : {}),
            ...(filtros.estado ? { estado: filtros.estado } : {}),
            ...(fechaDesde || fechaHasta ? { fecha: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [cuentas, total, resumen] = await prisma_1.default.$transaction([
            prisma_1.default.cuentaCobrar.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: {
                    fechaVencimiento: 'asc'
                },
                include: {
                    cliente: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            identificacion: true,
                            razonSocial: true
                        }
                    },
                    venta: {
                        select: {
                            id: true,
                            numero: true,
                            fecha: true,
                            total: true
                        }
                    },
                    abonos: true
                }
            }),
            prisma_1.default.cuentaCobrar.count({ where }),
            prisma_1.default.cuentaCobrar.aggregate({
                where,
                _sum: {
                    total: true,
                    saldo: true
                }
            })
        ]);
        return {
            ...(0, paginatedResponse_1.paginatedResponse)(cuentas, total, filtros.page, filtros.limit),
            resumen: {
                total: resumen._sum.total ?? new client_1.Prisma.Decimal(0),
                saldo: resumen._sum.saldo ?? new client_1.Prisma.Decimal(0)
            }
        };
    }
    async cuentasPagar(empresaId, filtros) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where = {
            empresaId,
            ...(filtros.proveedorId ? { proveedorId: filtros.proveedorId } : {}),
            ...(filtros.estado ? { estado: filtros.estado } : {}),
            ...(fechaDesde || fechaHasta ? { fecha: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [cuentas, total, resumen] = await prisma_1.default.$transaction([
            prisma_1.default.cuentaPagar.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: {
                    fechaVencimiento: 'asc'
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
                            total: true
                        }
                    },
                    pagos: true
                }
            }),
            prisma_1.default.cuentaPagar.count({ where }),
            prisma_1.default.cuentaPagar.aggregate({
                where,
                _sum: {
                    total: true,
                    saldo: true
                }
            })
        ]);
        return {
            ...(0, paginatedResponse_1.paginatedResponse)(cuentas, total, filtros.page, filtros.limit),
            resumen: {
                total: resumen._sum.total ?? new client_1.Prisma.Decimal(0),
                saldo: resumen._sum.saldo ?? new client_1.Prisma.Decimal(0)
            }
        };
    }
    async gastos(empresaId, filtros) {
        const { fechaDesde, fechaHasta } = this.obtenerFechas(filtros);
        const where = {
            empresaId,
            ...(filtros.proveedorId ? { proveedorId: filtros.proveedorId } : {}),
            ...(filtros.estado ? { estado: filtros.estado } : {}),
            ...(fechaDesde || fechaHasta ? { fecha: this.obtenerRango(fechaDesde, fechaHasta) } : {})
        };
        const [gastos, total, resumen] = await prisma_1.default.$transaction([
            prisma_1.default.gasto.findMany({
                where,
                skip: (filtros.page - 1) * filtros.limit,
                take: filtros.limit,
                orderBy: {
                    fecha: 'desc'
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
            prisma_1.default.gasto.count({ where }),
            prisma_1.default.gasto.aggregate({
                where,
                _sum: {
                    monto: true
                }
            })
        ]);
        return {
            ...(0, paginatedResponse_1.paginatedResponse)(gastos, total, filtros.page, filtros.limit),
            resumen: {
                total: resumen._sum.monto ?? new client_1.Prisma.Decimal(0)
            }
        };
    }
}
exports.ReporteService = ReporteService;
exports.reporteService = new ReporteService();
