"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = exports.DashboardService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
class DashboardService {
    async obtenerResumen(empresaId, filtros) {
        const fechaDesde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : undefined;
        const fechaHasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : undefined;
        if (fechaHasta) {
            fechaHasta.setHours(23, 59, 59, 999);
        }
        const rangoVentas = {
            empresaId,
            ...(fechaDesde || fechaHasta ? {
                fecha: {
                    ...(fechaDesde ? { gte: fechaDesde } : {}),
                    ...(fechaHasta ? { lte: fechaHasta } : {})
                }
            } : {})
        };
        const rangoCompras = {
            empresaId,
            ...(fechaDesde || fechaHasta ? {
                fecha: {
                    ...(fechaDesde ? { gte: fechaDesde } : {}),
                    ...(fechaHasta ? { lte: fechaHasta } : {})
                }
            } : {})
        };
        const rangoClientes = {
            empresaId,
            ...(fechaDesde || fechaHasta ? {
                createdAt: {
                    ...(fechaDesde ? { gte: fechaDesde } : {}),
                    ...(fechaHasta ? { lte: fechaHasta } : {})
                }
            } : {})
        };
        const rangoProductos = {
            empresaId,
            ...(filtros.bodegaId ? {
                inventarios: {
                    some: {
                        bodegaId: filtros.bodegaId
                    }
                }
            } : {})
        };
        const [totalVentas, ventasAprobadas, ventasAnuladas, totalCompras, comprasAprobadas, totalClientes, clientesActivos, totalProductos, productosActivos, totalSucursales, sucursalesActivas, totalBodegas, bodegasActivas, cuentasCobrarPendientes, cuentasPagarPendientes, ventasMonto, comprasMonto, productosStock, ventasRecientes, clientesRecientes] = await prisma_1.default.$transaction([
            prisma_1.default.venta.count({
                where: rangoVentas
            }),
            prisma_1.default.venta.count({
                where: {
                    ...rangoVentas,
                    estado: client_1.EstadoVenta.APROBADA
                }
            }),
            prisma_1.default.venta.count({
                where: {
                    ...rangoVentas,
                    estado: client_1.EstadoVenta.ANULADA
                }
            }),
            prisma_1.default.compra.count({
                where: rangoCompras
            }),
            prisma_1.default.compra.count({
                where: {
                    ...rangoCompras,
                    estado: client_1.EstadoCompra.APROBADA
                }
            }),
            prisma_1.default.cliente.count({
                where: rangoClientes
            }),
            prisma_1.default.cliente.count({
                where: {
                    ...rangoClientes,
                    estado: true
                }
            }),
            prisma_1.default.producto.count({
                where: rangoProductos
            }),
            prisma_1.default.producto.count({
                where: {
                    ...rangoProductos,
                    estado: true
                }
            }),
            prisma_1.default.sucursal.count({
                where: {
                    empresaId
                }
            }),
            prisma_1.default.sucursal.count({
                where: {
                    empresaId,
                    estado: true
                }
            }),
            prisma_1.default.bodega.count({
                where: {
                    empresaId
                }
            }),
            prisma_1.default.bodega.count({
                where: {
                    empresaId,
                    estado: true
                }
            }),
            prisma_1.default.cuentaCobrar.aggregate({
                where: {
                    empresaId,
                    estado: {
                        in: [
                            client_1.EstadoCuentaCobrar.PENDIENTE,
                            client_1.EstadoCuentaCobrar.PARCIAL,
                            client_1.EstadoCuentaCobrar.VENCIDA
                        ]
                    }
                },
                _sum: {
                    saldo: true
                }
            }),
            prisma_1.default.cuentaPagar.aggregate({
                where: {
                    empresaId,
                    estado: {
                        in: [
                            client_1.EstadoCuentaPagar.PENDIENTE,
                            client_1.EstadoCuentaPagar.PARCIAL,
                            client_1.EstadoCuentaPagar.VENCIDA
                        ]
                    }
                },
                _sum: {
                    saldo: true
                }
            }),
            prisma_1.default.venta.aggregate({
                where: {
                    ...rangoVentas,
                    estado: client_1.EstadoVenta.APROBADA
                },
                _sum: {
                    subtotal: true,
                    impuesto: true,
                    total: true
                }
            }),
            prisma_1.default.compra.aggregate({
                where: {
                    ...rangoCompras,
                    estado: client_1.EstadoCompra.APROBADA
                },
                _sum: {
                    subtotal: true,
                    impuesto: true,
                    total: true
                }
            }),
            prisma_1.default.productoBodega.aggregate({
                where: {
                    bodega: {
                        empresaId
                    },
                    ...(filtros.bodegaId ? {
                        bodegaId: filtros.bodegaId
                    } : {})
                },
                _sum: {
                    stock: true
                }
            }),
            prisma_1.default.venta.findMany({
                where: rangoVentas,
                orderBy: {
                    createdAt: 'desc'
                },
                take: 10,
                include: {
                    cliente: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            identificacion: true
                        }
                    }
                }
            }),
            prisma_1.default.cliente.findMany({
                where: rangoClientes,
                orderBy: {
                    createdAt: 'desc'
                },
                take: 10,
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    identificacion: true,
                    estado: true,
                    createdAt: true
                }
            })
        ]);
        const ventasTotales = ventasMonto._sum.total ?? new client_1.Prisma.Decimal(0);
        const comprasTotales = comprasMonto._sum.total ?? new client_1.Prisma.Decimal(0);
        const utilidad = ventasTotales.sub(comprasTotales);
        return {
            filtros: {
                fechaDesde: fechaDesde ?? null,
                fechaHasta: fechaHasta ?? null,
                sucursalId: filtros.sucursalId ?? null,
                bodegaId: filtros.bodegaId ?? null
            },
            resumen: {
                ventas: {
                    total: totalVentas,
                    aprobadas: ventasAprobadas,
                    anuladas: ventasAnuladas,
                    subtotal: ventasMonto._sum.subtotal ?? new client_1.Prisma.Decimal(0),
                    impuesto: ventasMonto._sum.impuesto ?? new client_1.Prisma.Decimal(0),
                    monto: ventasTotales
                },
                compras: {
                    total: totalCompras,
                    aprobadas: comprasAprobadas,
                    subtotal: comprasMonto._sum.subtotal ?? new client_1.Prisma.Decimal(0),
                    impuesto: comprasMonto._sum.impuesto ?? new client_1.Prisma.Decimal(0),
                    monto: comprasTotales
                },
                utilidad,
                clientes: {
                    total: totalClientes,
                    activos: clientesActivos,
                    inactivos: totalClientes - clientesActivos
                },
                productos: {
                    total: totalProductos,
                    activos: productosActivos,
                    inactivos: totalProductos - productosActivos,
                    stockTotal: productosStock._sum.stock ?? 0
                },
                sucursales: {
                    total: totalSucursales,
                    activas: sucursalesActivas,
                    inactivas: totalSucursales - sucursalesActivas
                },
                bodegas: {
                    total: totalBodegas,
                    activas: bodegasActivas,
                    inactivas: totalBodegas - bodegasActivas
                },
                cuentasCobrar: {
                    saldoPendiente: cuentasCobrarPendientes._sum.saldo ?? new client_1.Prisma.Decimal(0)
                },
                cuentasPagar: {
                    saldoPendiente: cuentasPagarPendientes._sum.saldo ?? new client_1.Prisma.Decimal(0)
                }
            },
            ventasRecientes,
            clientesRecientes
        };
    }
    async obtenerVentasPorPeriodo(empresaId, filtros) {
        const fechaDesde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : undefined;
        const fechaHasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : undefined;
        if (fechaHasta) {
            fechaHasta.setHours(23, 59, 59, 999);
        }
        const ventas = await prisma_1.default.venta.groupBy({
            by: ['fecha'],
            where: {
                empresaId,
                estado: client_1.EstadoVenta.APROBADA,
                ...(fechaDesde || fechaHasta ? {
                    fecha: {
                        ...(fechaDesde ? { gte: fechaDesde } : {}),
                        ...(fechaHasta ? { lte: fechaHasta } : {})
                    }
                } : {})
            },
            _sum: {
                total: true
            },
            _count: {
                id: true
            },
            orderBy: {
                fecha: 'asc'
            }
        });
        return ventas;
    }
    async obtenerProductosBajoStock(empresaId, bodegaId) {
        const inventarios = await prisma_1.default.productoBodega.findMany({
            where: {
                bodega: {
                    empresaId
                },
                ...(bodegaId ? {
                    bodegaId
                } : {})
            },
            include: {
                producto: {
                    select: {
                        id: true,
                        codigo: true,
                        sku: true,
                        nombre: true,
                        stockMinimo: true,
                        stockMaximo: true,
                        precioVenta: true
                    }
                },
                bodega: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
                    }
                }
            },
            orderBy: {
                stock: 'asc'
            }
        });
        return inventarios.filter(item => item.stock <= item.producto.stockMinimo);
    }
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
