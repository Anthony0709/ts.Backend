import {
    Prisma,
    EstadoCotizacion
} from '@prisma/client';

import prisma from '../../../config/prisma';

import {
    CrearCotizacionDto,
    ActualizarCotizacionDto,
    ConsultarCotizacionesDto
} from '../dto/cotizacion.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';


export class CotizacionService {

    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/

    private async generarNumero(
        empresaId: string,
        tx: Prisma.TransactionClient | typeof prisma = prisma
    ): Promise<string> {

        const configuracion =
            await tx.configuracion.findUnique({

                where: {
                    empresaId
                },

                select: {
                    prefijoCotizacion: true
                }

            });

        const prefijo =
            configuracion?.prefijoCotizacion || 'COT';

        for (
            let intento = 0;
            intento < 20;
            intento++
        ) {

            const numero =
                `${prefijo}-${Date.now()}-${Math.floor(
                    1000 + Math.random() * 9000
                )}`;

            const existe =
                await tx.cotizacion.findFirst({

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
            'No fue posible generar el número de cotización.',
            500
        );
    }


    private async validarCliente(
        clienteId: string,
        empresaId: string
    ) {

        const cliente =
            await prisma.cliente.findFirst({

                where: {

                    id:
                        clienteId,

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

            throw new AppError(
                'El cliente no existe, está inactivo o no pertenece a la empresa.',
                404
            );
        }

        return cliente;
    }


    private async validarProductos(
        detalles: CrearCotizacionDto['detalles'],
        empresaId: string
    ) {

        const ids =
            detalles.map(
                detalle =>
                    detalle.productoId
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

        const idsUnicos =
            new Set(ids);

        if (
            productos.length !==
            idsUnicos.size
        ) {

            throw new AppError(
                'Uno o más productos no existen, están inactivos o no pertenecen a la empresa.',
                404
            );
        }

        return productos;
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


    private calcularTotales(
        detalles: CrearCotizacionDto['detalles'],
        porcentajeIva: Prisma.Decimal
    ) {

        let subtotal =
            new Prisma.Decimal(0);

        const detallesCalculados =
            detalles.map(
                detalle => {

                    const cantidad =
                        new Prisma.Decimal(
                            detalle.cantidad
                        );

                    const precio =
                        new Prisma.Decimal(
                            detalle.precio
                        );

                    const subtotalDetalle =
                        cantidad.mul(precio);

                    subtotal =
                        subtotal.add(
                            subtotalDetalle
                        );

                    return {

                        productoId:
                            detalle.productoId,

                        cantidad:
                            detalle.cantidad,

                        precio:
                            precio,

                        subtotal:
                            subtotalDetalle

                    };

                }
            );

        const impuesto =
            subtotal
                .mul(porcentajeIva)
                .div(100);

        const total =
            subtotal.add(
                impuesto
            );

        return {

            detallesCalculados,

            subtotal,

            impuesto,

            total

        };
    }


    private async obtenerCotizacion(
        id: string,
        empresaId: string
    ) {

        const cotizacion =
            await prisma.cotizacion.findFirst({

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

            throw new AppError(
                'La cotización no existe.',
                404
            );
        }

        return cotizacion;
    }


    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/

    async obtenerTodos(
        usuario: Express.UserPayload,
        query: ConsultarCotizacionesDto
    ) {

        const {
            page,
            limit,
            skip,
            take
        } = buildQuery(query);

        const where:
            Prisma.CotizacionWhereInput = {

            empresaId:
                usuario.empresaId,

            ...(query.clienteId && {

                clienteId:
                    query.clienteId

            }),

            ...(query.estado && {

                estado:
                    query.estado as EstadoCotizacion

            }),

            ...(query.fechaDesde || query.fechaHasta
                ? {

                    fecha: {

                        ...(query.fechaDesde && {

                            gte:
                                new Date(
                                    query.fechaDesde
                                )

                        }),

                        ...(query.fechaHasta && {

                            lte:
                                new Date(
                                    query.fechaHasta
                                )

                        })

                    }

                }
                : {})

        };

        const [
            cotizaciones,
            total
        ] = await prisma.$transaction([

            prisma.cotizacion.findMany({

                where,

                skip,

                take,

                orderBy: {

                    createdAt:
                        'desc'

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

            prisma.cotizacion.count({

                where

            })

        ]);

        return paginatedResponse(
            cotizaciones,
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

        return this.obtenerCotizacion(
            id,
            usuario.empresaId
        );
    }


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    async crear(
        data: CrearCotizacionDto,
        usuario: Express.UserPayload
    ) {

        const empresaId =
            usuario.empresaId;

        await this.validarCliente(
            data.clienteId,
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

        return prisma.cotizacion.create({

            data: {

                numero,

                cliente: {

                    connect: {

                        id:
                            data.clienteId

                    }

                },

                empresa: {

                    connect: {

                        id:
                            empresaId

                    }

                },

                estado:
                    EstadoCotizacion.BORRADOR,

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

                                precio:
                                    detalle.precio,

                                subtotal:
                                    detalle.subtotal

                            })
                        )

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

    async actualizar(
        id: string,
        data: ActualizarCotizacionDto,
        usuario: Express.UserPayload
    ) {

        const cotizacion =
            await this.obtenerCotizacion(
                id,
                usuario.empresaId
            );

        if (
            cotizacion.estado !==
            EstadoCotizacion.BORRADOR
        ) {

            throw new AppError(
                'Solo se pueden modificar cotizaciones en estado BORRADOR.',
                400
            );
        }

        if (
            data.clienteId
        ) {

            await this.validarCliente(
                data.clienteId,
                usuario.empresaId
            );
        }

        if (
            data.detalles
        ) {

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
            cotizacion.detalles.map(
                detalle => ({

                    productoId:
                        detalle.productoId,

                    cantidad:
                        detalle.cantidad,

                    precio:
                        Number(
                            detalle.precio
                        )

                })
            );

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

                if (
                    data.detalles
                ) {

                    await tx.cotizacionDetalle.deleteMany({

                        where: {

                            cotizacionId:
                                cotizacion.id

                        }

                    });
                }

                return tx.cotizacion.update({

                    where: {

                        id:
                            cotizacion.id

                    },

                    data: {

                        ...(data.clienteId && {

                            cliente: {

                                connect: {

                                    id:
                                        data.clienteId

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

                                            precio:
                                                detalle.precio,

                                            subtotal:
                                                detalle.subtotal

                                        })
                                    )

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

        const cotizacion =
            await this.obtenerCotizacion(
                id,
                usuario.empresaId
            );

        if (
            cotizacion.estado !==
            EstadoCotizacion.BORRADOR
        ) {

            throw new AppError(
                'Solo se pueden aprobar cotizaciones en estado BORRADOR.',
                400
            );
        }

        return prisma.cotizacion.update({

            where: {

                id:
                    cotizacion.id

            },

            data: {

                estado:
                    EstadoCotizacion.APROBADA

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

    async rechazar(
        id: string,
        usuario: Express.UserPayload
    ) {

        const cotizacion =
            await this.obtenerCotizacion(
                id,
                usuario.empresaId
            );

        if (
            cotizacion.estado !==
            EstadoCotizacion.BORRADOR
        ) {

            throw new AppError(
                'Solo se pueden rechazar cotizaciones en estado BORRADOR.',
                400
            );
        }

        return prisma.cotizacion.update({

            where: {

                id:
                    cotizacion.id

            },

            data: {

                estado:
                    EstadoCotizacion.RECHAZADA

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

    async convertir(
        id: string,
        usuario: Express.UserPayload
    ) {

        const cotizacion =
            await this.obtenerCotizacion(
                id,
                usuario.empresaId
            );

        if (
            cotizacion.estado !==
            EstadoCotizacion.APROBADA
        ) {

            throw new AppError(
                'Solo se pueden convertir cotizaciones que estén APROBADAS.',
                400
            );
        }

        return prisma.cotizacion.update({

            where: {

                id:
                    cotizacion.id

            },

            data: {

                estado:
                    EstadoCotizacion.CONVERTIDA

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