import {
    Prisma,
    TipoMovimiento
} from '@prisma/client';

import prisma from '../../../config/prisma';

import {
    CrearDevolucionDto,
    ActualizarDevolucionDto,
    ConsultarDevolucionesDto
} from '../dto/devolucion.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';


export class DevolucionService {

    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/

    private async generarNumero(
        empresaId: string
    ): Promise<string> {

        for (let intento = 0; intento < 20; intento++) {

            const numero =
                `DEV-${Date.now()}-${Math.floor(
                    1000 + Math.random() * 9000
                )}`;

            const existe =
                await prisma.devolucion.findFirst({
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
            'No fue posible generar el número de devolución.',
            500
        );
    }


    private async validarBodega(
        bodegaId: string,
        empresaId: string
    ) {

        const bodega =
            await prisma.bodega.findFirst({
                where: {
                    id: bodegaId,
                    empresaId,
                    estado: true
                },
                select: {
                    id: true,
                    nombre: true,
                    codigo: true
                }
            });

        if (!bodega) {

            throw new AppError(
                'La bodega no existe, está inactiva o no pertenece a la empresa.',
                404
            );
        }

        return bodega;
    }


    private async validarProductos(
        detalles: CrearDevolucionDto['detalles'],
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

        if (productos.length !== ids.length) {

            throw new AppError(
                'Uno o más productos no existen, están inactivos o no pertenecen a la empresa.',
                404
            );
        }

        return productos;
    }


    private async obtenerDevolucion(
        id: string,
        empresaId: string
    ) {

        const devolucion =
            await prisma.devolucion.findFirst({

                where: {
                    id,
                    empresaId
                },

                include: {

                    empresa: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    },

                    bodega: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true
                        }
                    },

                    venta: true,

                    compra: true,

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

        if (!devolucion) {

            throw new AppError(
                'La devolución no existe.',
                404
            );
        }

        return devolucion;
    }


    /*=====================================================
    ====================== LISTAR ========================
    =====================================================*/

    async obtenerTodos(
        usuario: Express.UserPayload,
        query: ConsultarDevolucionesDto
    ) {

        const {
            page,
            limit,
            skip,
            take,
            orderBy
        } = buildQuery(query);

        const where:
            Prisma.DevolucionWhereInput = {

            empresaId:
                usuario.empresaId,

            ...(query.tipo && {
                tipo:
                    query.tipo
            }),

            ...(query.estado && {
                estado:
                    query.estado
            }),

            ...(query.ventaId && {
                ventaId:
                    query.ventaId
            }),

            ...(query.compraId && {
                compraId:
                    query.compraId
            }),

            ...(query.bodegaId && {
                bodegaId:
                    query.bodegaId
            })

        };

        const [
            devoluciones,
            total
        ] = await prisma.$transaction([

            prisma.devolucion.findMany({

                where,

                skip,

                take,

                orderBy,

                include: {

                    bodega: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true
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

            prisma.devolucion.count({
                where
            })

        ]);

        return paginatedResponse(
            devoluciones,
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

        return this.obtenerDevolucion(
            id,
            usuario.empresaId
        );
    }


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    async crear(
        data: CrearDevolucionDto,
        usuario: Express.UserPayload
    ) {

        const empresaId =
            usuario.empresaId;

        /*
         * Validar bodega.
         */

        await this.validarBodega(
            data.bodegaId,
            empresaId
        );

        /*
         * Validar productos.
         */

        await this.validarProductos(
            data.detalles,
            empresaId
        );

        /*
         * Validar que venta y compra
         * pertenezcan a la empresa.
         */

        if (
            data.tipo === 'VENTA'
        ) {

            const venta =
                await prisma.venta.findFirst({

                    where: {
                        id: data.ventaId,
                        empresaId
                    },

                    select: {
                        id: true
                    }

                });

            if (!venta) {

                throw new AppError(
                    'La venta no existe o no pertenece a la empresa.',
                    404
                );
            }
        }


        if (
            data.tipo === 'COMPRA'
        ) {

            const compra =
                await prisma.compra.findFirst({

                    where: {
                        id: data.compraId,
                        empresaId
                    },

                    select: {
                        id: true
                    }

                });

            if (!compra) {

                throw new AppError(
                    'La compra no existe o no pertenece a la empresa.',
                    404
                );
            }
        }


        const numero =
            await this.generarNumero(
                empresaId
            );


        /*
         * Crear devolución en BORRADOR.
         *
         * NO modifica stock todavía.
         */

        return await prisma.devolucion.create({

            data: {

                numero,

                tipo:
                    data.tipo,

                estado:
                    'BORRADOR',

                empresa: {
                    connect: {
                        id: empresaId
                    }
                },

                bodega: {
                    connect: {
                        id: data.bodegaId
                    }
                },

                ...(data.ventaId && {
                    venta: {
                        connect: {
                            id: data.ventaId
                        }
                    }
                }),

                ...(data.compraId && {
                    compra: {
                        connect: {
                            id: data.compraId
                        }
                    }
                }),

                observacion:
                    data.observacion?.trim(),

                detalles: {

                    create: data.detalles.map(
                        detalle => ({
                            producto: {
                                connect: {
                                    id:
                                        detalle.productoId
                                }
                            },
                            cantidad:
                                detalle.cantidad
                        })
                    )

                }

            },

            include: {

                bodega: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
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
        data: ActualizarDevolucionDto,
        usuario: Express.UserPayload
    ) {

        const devolucion =
            await this.obtenerDevolucion(
                id,
                usuario.empresaId
            );

        if (
            devolucion.estado !==
            'BORRADOR'
        ) {

            throw new AppError(
                'Solo se pueden modificar devoluciones en estado BORRADOR.',
                400
            );
        }

        return prisma.devolucion.update({

            where: {
                id: devolucion.id
            },

            data: {

                ...(data.observacion !== undefined && {
                    observacion:
                        data.observacion?.trim()
                })

            },

            include: {

                bodega: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
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
    ====================== APROBAR =======================
    =====================================================*/

    async aprobar(
        id: string,
        usuario: Express.UserPayload
    ) {

        const devolucion =
            await this.obtenerDevolucion(
                id,
                usuario.empresaId
            );

        if (
            devolucion.estado !==
            'BORRADOR'
        ) {

            throw new AppError(
                'Solo se pueden aprobar devoluciones en estado BORRADOR.',
                400
            );
        }

        return prisma.$transaction(
            async (tx) => {

                /*
                 * Procesar cada detalle.
                 */

                for (
                    const detalle
                    of devolucion.detalles
                ) {

                    const inventario =
                        await tx.productoBodega.findUnique({

                            where: {
                                productoId_bodegaId: {

                                    productoId:
                                        detalle.productoId,

                                    bodegaId:
                                        devolucion.bodegaId

                                }
                            }

                        });

                    /*
                     * Si es devolución de VENTA:
                     *
                     * Producto vuelve a nuestra bodega.
                     */

                    if (
                        devolucion.tipo ===
                        'VENTA'
                    ) {

                        if (inventario) {

                            const stockAnterior =
                                inventario.stock;

                            const stockNuevo =
                                stockAnterior +
                                detalle.cantidad;

                            await tx.productoBodega.update({

                                where: {
                                    id:
                                        inventario.id
                                },

                                data: {
                                    stock:
                                        stockNuevo
                                }

                            });

                            await tx.movimientoInventario.create({

                                data: {

                                    productoId:
                                        detalle.productoId,

                                    bodegaId:
                                        devolucion.bodegaId,

                                    tipo:
                                        TipoMovimiento.ENTRADA,

                                    cantidad:
                                        detalle.cantidad,

                                    stockAnterior,

                                    stockNuevo,

                                    observacion:
                                        `Devolución de venta ${devolucion.numero}`

                                }

                            });

                        } else {

                            await tx.productoBodega.create({

                                data: {

                                    productoId:
                                        detalle.productoId,

                                    bodegaId:
                                        devolucion.bodegaId,

                                    stock:
                                        detalle.cantidad

                                }

                            });

                            await tx.movimientoInventario.create({

                                data: {

                                    productoId:
                                        detalle.productoId,

                                    bodegaId:
                                        devolucion.bodegaId,

                                    tipo:
                                        TipoMovimiento.ENTRADA,

                                    cantidad:
                                        detalle.cantidad,

                                    stockAnterior: 0,

                                    stockNuevo:
                                        detalle.cantidad,

                                    observacion:
                                        `Devolución de venta ${devolucion.numero}`

                                }

                            });
                        }
                    }


                    /*
                     * Si es devolución de COMPRA:
                     *
                     * Producto sale de nuestra bodega.
                     */

                    if (
                        devolucion.tipo ===
                        'COMPRA'
                    ) {

                        if (!inventario) {

                            throw new AppError(
                                `No existe inventario para el producto ${detalle.producto.nombre}.`,
                                400
                            );
                        }

                        const stockAnterior =
                            inventario.stock;

                        const stockNuevo =
                            stockAnterior -
                            detalle.cantidad;

                        if (
                            stockNuevo < 0
                        ) {

                            throw new AppError(
                                `Stock insuficiente para devolver el producto ${detalle.producto.nombre}.`,
                                400
                            );
                        }

                        await tx.productoBodega.update({

                            where: {
                                id:
                                    inventario.id
                            },

                            data: {
                                stock:
                                    stockNuevo
                            }

                        });

                        await tx.movimientoInventario.create({

                            data: {

                                productoId:
                                    detalle.productoId,

                                bodegaId:
                                    devolucion.bodegaId,

                                tipo:
                                    TipoMovimiento.SALIDA,

                                cantidad:
                                    detalle.cantidad,

                                stockAnterior,

                                stockNuevo,

                                observacion:
                                    `Devolución de compra ${devolucion.numero}`

                            }

                        });
                    }
                }


                /*
                 * Cambiar estado.
                 */

                return tx.devolucion.update({

                    where: {
                        id:
                            devolucion.id
                    },

                    data: {
                        estado:
                            'APROBADA'
                    },

                    include: {

                        bodega: {
                            select: {
                                id: true,
                                nombre: true,
                                codigo: true
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
    ====================== ANULAR ========================
    =====================================================*/

    async anular(
        id: string,
        usuario: Express.UserPayload
    ) {

        const devolucion =
            await this.obtenerDevolucion(
                id,
                usuario.empresaId
            );

        if (
            devolucion.estado ===
            'ANULADA'
        ) {

            throw new AppError(
                'La devolución ya está anulada.',
                400
            );
        }

        if (
            devolucion.estado ===
            'APROBADA'
        ) {

            throw new AppError(
                'Una devolución aprobada no puede anularse directamente.',
                400
            );
        }

        return prisma.devolucion.update({

            where: {
                id: devolucion.id
            },

            data: {
                estado:
                    'ANULADA'
            },

            include: {

                bodega: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
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