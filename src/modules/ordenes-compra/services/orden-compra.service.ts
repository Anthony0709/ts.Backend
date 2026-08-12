import {
    Prisma,
    EstadoOrdenCompra
} from '@prisma/client';

import prisma from '../../../config/prisma';

import {
    CrearOrdenCompraDto,
    ActualizarOrdenCompraDto,
    ConsultarOrdenesCompraDto
} from '../dto/orden-compra.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';


export class OrdenCompraService {

    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/

    private async generarNumero(
        empresaId: string
    ): Promise<string> {

        for (let intento = 0; intento < 20; intento++) {

            const numero =
                `OC-${Date.now()}-${Math.floor(
                    1000 + Math.random() * 9000
                )}`;

            const existe =
                await prisma.ordenCompra.findFirst({

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

        throw new AppError(
            'No fue posible generar el número de la orden de compra.',
            500
        );
    }


    private async validarProveedor(
        proveedorId: string,
        empresaId: string
    ) {

        const proveedor =
            await prisma.proveedor.findFirst({

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

            throw new AppError(
                'El proveedor no existe, está inactivo o no pertenece a la empresa.',
                404
            );
        }

        return proveedor;
    }


    private async validarProductos(
        detalles: CrearOrdenCompraDto['detalles'],
        empresaId: string
    ) {

        const ids =
            detalles.map(
                detalle => detalle.productoId
            );

        const productos =
            await prisma.producto.findMany({

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

        if (
            productos.length !==
            new Set(ids).size
        ) {

            throw new AppError(
                'Uno o más productos no existen, están inactivos o no pertenecen a la empresa.',
                404
            );
        }

        return productos;
    }


    private calcularTotales(
        detalles: CrearOrdenCompraDto['detalles'],
        porcentajeIva: Prisma.Decimal
    ) {

        let subtotal =
            new Prisma.Decimal(0);

        const detallesCalculados =
            detalles.map(detalle => {

                const cantidad =
                    new Prisma.Decimal(
                        detalle.cantidad
                    );

                const costo =
                    new Prisma.Decimal(
                        detalle.costo
                    );

                const detalleSubtotal =
                    cantidad.mul(costo);

                subtotal =
                    subtotal.add(
                        detalleSubtotal
                    );

                return {
                    productoId:
                        detalle.productoId,

                    cantidad:
                        detalle.cantidad,

                    costo,

                    subtotal:
                        detalleSubtotal
                };
            });

        const impuesto =
            subtotal
                .mul(porcentajeIva)
                .div(100);

        const total =
            subtotal.add(impuesto);

        return {
            detallesCalculados,
            subtotal,
            impuesto,
            total
        };
    }


    private async obtenerIva(
        empresaId: string
    ): Promise<Prisma.Decimal> {

        const configuracion =
            await prisma.configuracion.findUnique({

                where: {
                    empresaId
                },

                select: {
                    iva: true
                }

            });

        return configuracion?.iva ??
            new Prisma.Decimal(0);
    }


    private async obtenerOrden(
        id: string,
        empresaId: string
    ) {

        const orden =
            await prisma.ordenCompra.findFirst({

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

            throw new AppError(
                'La orden de compra no existe.',
                404
            );
        }

        return orden;
    }


    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/

    async obtenerTodos(
        usuario: Express.UserPayload,
        query: ConsultarOrdenesCompraDto
    ) {

        const {
            page,
            limit,
            skip,
            take
        } = buildQuery(query);

        const where:
            Prisma.OrdenCompraWhereInput = {

            empresaId:
                usuario.empresaId,

            ...(query.proveedorId && {
                proveedorId:
                    query.proveedorId
            }),

            ...(query.estado && {
                estado:
                    query.estado as EstadoOrdenCompra
            }),

            ...(query.fechaDesde && {
                fecha: {
                    gte:
                        new Date(query.fechaDesde)
                }
            }),

            ...(query.fechaHasta && {
                fecha: {
                    ...(query.fechaDesde && {
                        gte:
                            new Date(query.fechaDesde)
                    }),

                    lte:
                        new Date(query.fechaHasta)
                }
            })

        };

        const [
            ordenes,
            total
        ] = await prisma.$transaction([

            prisma.ordenCompra.findMany({

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

            prisma.ordenCompra.count({
                where
            })

        ]);

        return paginatedResponse(
            ordenes,
            total,
            page,
            limit
        );
    }


    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/

    async obtenerPorId(
        id: string,
        usuario: Express.UserPayload
    ) {

        return this.obtenerOrden(
            id,
            usuario.empresaId
        );
    }


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    async crear(
        data: CrearOrdenCompraDto,
        usuario: Express.UserPayload
    ) {

        const empresaId =
            usuario.empresaId;

        await this.validarProveedor(
            data.proveedorId,
            empresaId
        );

        await this.validarProductos(
            data.detalles,
            empresaId
        );

        const iva =
            await this.obtenerIva(
                empresaId
            );

        const {
            detallesCalculados,
            subtotal,
            impuesto,
            total
        } =
            this.calcularTotales(
                data.detalles,
                iva
            );

        const numero =
            await this.generarNumero(
                empresaId
            );

        return prisma.ordenCompra.create({

            data: {

                numero,

                proveedor: {
                    connect: {
                        id:
                            data.proveedorId
                    }
                },

                empresa: {
                    connect: {
                        id:
                            empresaId
                    }
                },

                estado:
                    EstadoOrdenCompra.BORRADOR,

                observacion:
                    data.observacion?.trim(),

                subtotal,

                impuesto,

                total,

                detalles: {

                    create:
                        detallesCalculados.map(
                            detalle => ({

                                producto: {
                                    connect: {
                                        id:
                                            detalle.productoId
                                    }
                                },

                                cantidad:
                                    detalle.cantidad,

                                costo:
                                    detalle.costo,

                                subtotal:
                                    detalle.subtotal

                            })
                        )

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

    async actualizar(
        id: string,
        data: ActualizarOrdenCompraDto,
        usuario: Express.UserPayload
    ) {

        const orden =
            await this.obtenerOrden(
                id,
                usuario.empresaId
            );

        if (
            orden.estado !==
            EstadoOrdenCompra.BORRADOR
        ) {

            throw new AppError(
                'Solo se pueden modificar órdenes de compra en estado BORRADOR.',
                400
            );
        }

        if (data.proveedorId) {

            await this.validarProveedor(
                data.proveedorId,
                usuario.empresaId
            );
        }

        if (data.detalles) {

            await this.validarProductos(
                data.detalles,
                usuario.empresaId
            );
        }

        const iva =
            await this.obtenerIva(
                usuario.empresaId
            );

        const detalles =
            data.detalles ??
            orden.detalles.map(detalle => ({

                productoId:
                    detalle.productoId,

                cantidad:
                    detalle.cantidad,

                costo:
                    Number(detalle.costo)

            }));

        const {
            detallesCalculados,
            subtotal,
            impuesto,
            total
        } =
            this.calcularTotales(
                detalles,
                iva
            );

        return prisma.$transaction(
            async tx => {

                if (data.detalles) {

                    await tx.ordenCompraDetalle.deleteMany({

                        where: {
                            ordenCompraId:
                                orden.id
                        }

                    });
                }

                return tx.ordenCompra.update({

                    where: {
                        id:
                            orden.id
                    },

                    data: {

                        ...(data.proveedorId && {

                            proveedor: {
                                connect: {
                                    id:
                                        data.proveedorId
                                }
                            }

                        }),

                        ...(data.observacion !== undefined && {

                            observacion:
                                data.observacion?.trim()

                        }),

                        subtotal,

                        impuesto,

                        total,

                        ...(data.detalles && {

                            detalles: {

                                create:
                                    detallesCalculados.map(
                                        detalle => ({

                                            producto: {
                                                connect: {
                                                    id:
                                                        detalle.productoId
                                                }
                                            },

                                            cantidad:
                                                detalle.cantidad,

                                            costo:
                                                detalle.costo,

                                            subtotal:
                                                detalle.subtotal

                                        })
                                    )

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
            }
        );
    }


    /*=====================================================
    ======================= APROBAR ======================
    =====================================================*/

    async aprobar(
        id: string,
        usuario: Express.UserPayload
    ) {

        const orden =
            await this.obtenerOrden(
                id,
                usuario.empresaId
            );

        if (
            orden.estado !==
            EstadoOrdenCompra.BORRADOR
        ) {

            throw new AppError(
                'Solo se pueden aprobar órdenes de compra en estado BORRADOR.',
                400
            );
        }

        return prisma.ordenCompra.update({

            where: {
                id:
                    orden.id
            },

            data: {
                estado:
                    EstadoOrdenCompra.APROBADA
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

    async cancelar(
        id: string,
        usuario: Express.UserPayload
    ) {

        const orden =
            await this.obtenerOrden(
                id,
                usuario.empresaId
            );

        if (
            orden.estado ===
            EstadoOrdenCompra.CANCELADA
        ) {

            throw new AppError(
                'La orden de compra ya está cancelada.',
                400
            );
        }

        if (
            orden.estado ===
            EstadoOrdenCompra.CONVERTIDA
        ) {

            throw new AppError(
                'Una orden de compra convertida no puede cancelarse.',
                400
            );
        }

        return prisma.ordenCompra.update({

            where: {
                id:
                    orden.id
            },

            data: {

                estado:
                    EstadoOrdenCompra.CANCELADA

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