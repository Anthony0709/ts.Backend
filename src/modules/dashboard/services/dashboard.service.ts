import { Prisma, EstadoVenta, EstadoCompra, EstadoCuentaCobrar, EstadoCuentaPagar } from '@prisma/client';
import prisma from '../../../config/prisma';
import { DashboardFiltroDto } from '../dto/dashboard.dto';

export class DashboardService {
    async obtenerResumen(empresaId: string, filtros: DashboardFiltroDto) {
        const fechaDesde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : undefined;
        const fechaHasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : undefined;
        if (fechaHasta) {
            fechaHasta.setHours(23, 59, 59, 999);
        }
        const rangoVentas: Prisma.VentaWhereInput = {
            empresaId,
            ...(fechaDesde || fechaHasta ? {
                fecha: {
                    ...(fechaDesde ? { gte: fechaDesde } : {}),
                    ...(fechaHasta ? { lte: fechaHasta } : {})
                }
            } : {})
        };
        const rangoCompras: Prisma.CompraWhereInput = {
            empresaId,
            ...(fechaDesde || fechaHasta ? {
                fecha: {
                    ...(fechaDesde ? { gte: fechaDesde } : {}),
                    ...(fechaHasta ? { lte: fechaHasta } : {})
                }
            } : {})
        };
        const rangoClientes: Prisma.ClienteWhereInput = {
            empresaId,
            ...(fechaDesde || fechaHasta ? {
                createdAt: {
                    ...(fechaDesde ? { gte: fechaDesde } : {}),
                    ...(fechaHasta ? { lte: fechaHasta } : {})
                }
            } : {})
        };
        const rangoProductos: Prisma.ProductoWhereInput = {
            empresaId,
            ...(filtros.bodegaId ? {
                inventarios: {
                    some: {
                        bodegaId: filtros.bodegaId
                    }
                }
            } : {})
        };
        const [
            totalVentas,
            ventasAprobadas,
            ventasAnuladas,
            totalCompras,
            comprasAprobadas,
            totalClientes,
            clientesActivos,
            totalProductos,
            productosActivos,
            totalSucursales,
            sucursalesActivas,
            totalBodegas,
            bodegasActivas,
            cuentasCobrarPendientes,
            cuentasPagarPendientes,
            ventasMonto,
            comprasMonto,
            productosStock,
            ventasRecientes,
            clientesRecientes
        ] = await prisma.$transaction([
            prisma.venta.count({
                where: rangoVentas
            }),
            prisma.venta.count({
                where: {
                    ...rangoVentas,
                    estado: EstadoVenta.APROBADA
                }
            }),
            prisma.venta.count({
                where: {
                    ...rangoVentas,
                    estado: EstadoVenta.ANULADA
                }
            }),
            prisma.compra.count({
                where: rangoCompras
            }),
            prisma.compra.count({
                where: {
                    ...rangoCompras,
                    estado: EstadoCompra.APROBADA
                }
            }),
            prisma.cliente.count({
                where: rangoClientes
            }),
            prisma.cliente.count({
                where: {
                    ...rangoClientes,
                    estado: true
                }
            }),
            prisma.producto.count({
                where: rangoProductos
            }),
            prisma.producto.count({
                where: {
                    ...rangoProductos,
                    estado: true
                }
            }),
            prisma.sucursal.count({
                where: {
                    empresaId
                }
            }),
            prisma.sucursal.count({
                where: {
                    empresaId,
                    estado: true
                }
            }),
            prisma.bodega.count({
                where: {
                    empresaId
                }
            }),
            prisma.bodega.count({
                where: {
                    empresaId,
                    estado: true
                }
            }),
            prisma.cuentaCobrar.aggregate({
                where: {
                    empresaId,
                    estado: {
                        in: [
                            EstadoCuentaCobrar.PENDIENTE,
                            EstadoCuentaCobrar.PARCIAL,
                            EstadoCuentaCobrar.VENCIDA
                        ]
                    }
                },
                _sum: {
                    saldo: true
                }
            }),
            prisma.cuentaPagar.aggregate({
                where: {
                    empresaId,
                    estado: {
                        in: [
                            EstadoCuentaPagar.PENDIENTE,
                            EstadoCuentaPagar.PARCIAL,
                            EstadoCuentaPagar.VENCIDA
                        ]
                    }
                },
                _sum: {
                    saldo: true
                }
            }),
            prisma.venta.aggregate({
                where: {
                    ...rangoVentas,
                    estado: EstadoVenta.APROBADA
                },
                _sum: {
                    subtotal: true,
                    impuesto: true,
                    total: true
                }
            }),
            prisma.compra.aggregate({
                where: {
                    ...rangoCompras,
                    estado: EstadoCompra.APROBADA
                },
                _sum: {
                    subtotal: true,
                    impuesto: true,
                    total: true
                }
            }),
            prisma.productoBodega.aggregate({
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
            prisma.venta.findMany({
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
            prisma.cliente.findMany({
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
        const ventasTotales = ventasMonto._sum.total ?? new Prisma.Decimal(0);
        const comprasTotales = comprasMonto._sum.total ?? new Prisma.Decimal(0);
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
                    subtotal: ventasMonto._sum.subtotal ?? new Prisma.Decimal(0),
                    impuesto: ventasMonto._sum.impuesto ?? new Prisma.Decimal(0),
                    monto: ventasTotales
                },
                compras: {
                    total: totalCompras,
                    aprobadas: comprasAprobadas,
                    subtotal: comprasMonto._sum.subtotal ?? new Prisma.Decimal(0),
                    impuesto: comprasMonto._sum.impuesto ?? new Prisma.Decimal(0),
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
                    saldoPendiente: cuentasCobrarPendientes._sum.saldo ?? new Prisma.Decimal(0)
                },
                cuentasPagar: {
                    saldoPendiente: cuentasPagarPendientes._sum.saldo ?? new Prisma.Decimal(0)
                }
            },
            ventasRecientes,
            clientesRecientes
        };
    }
    async obtenerVentasPorPeriodo(empresaId: string, filtros: DashboardFiltroDto) {
        const fechaDesde = filtros.fechaDesde ? new Date(filtros.fechaDesde) : undefined;
        const fechaHasta = filtros.fechaHasta ? new Date(filtros.fechaHasta) : undefined;
        if (fechaHasta) {
            fechaHasta.setHours(23, 59, 59, 999);
        }
        const ventas = await prisma.venta.groupBy({
            by: ['fecha'],
            where: {
                empresaId,
                estado: EstadoVenta.APROBADA,
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
    async obtenerProductosBajoStock(empresaId: string, bodegaId?: string) {
        const inventarios = await prisma.productoBodega.findMany({
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
export const dashboardService = new DashboardService();