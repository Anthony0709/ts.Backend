import { Prisma, TipoMovimiento } from '@prisma/client';

import prisma from '../../../config/prisma';

import {
    CrearInventarioDto,
    AjustarInventarioDto,
    ActualizarInventarioDto
} from '../dto/inventario.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class InventarioService {

    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/

    private async validarProducto(
        productoId: string,
        empresaId: string
    ) {

        const producto =
            await prisma.producto.findFirst({

                where: {
                    id: productoId,
                    empresaId,
                    estado: true
                },

                select: {
                    id: true,
                    nombre: true,
                    codigo: true,
                    sku: true,
                    codigoBarras: true,
                    stockMinimo: true,
                    stockMaximo: true
                }

            });

        if (!producto) {

            throw new AppError(
                'El producto no existe, está inactivo o no pertenece a la empresa.',
                404
            );
        }

        return producto;
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

    private async obtenerInventario(
        id: string,
        empresaId: string
    ) {

        const inventario =
            await prisma.productoBodega.findFirst({

                where: {
                    id,

                    producto: {
                        empresaId
                    },

                    bodega: {
                        empresaId
                    }
                },

                include: {

                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            sku: true,
                            codigoBarras: true,
                            nombre: true,
                            stockMinimo: true,
                            stockMaximo: true,
                            estado: true
                        }
                    },

                    bodega: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true,
                            estado: true
                        }
                    }

                }

            });

        if (!inventario) {

            throw new AppError(
                'El registro de inventario no existe.',
                404
            );
        }

        return inventario;
    }

    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/

    async obtenerTodos(
        usuario: Express.UserPayload,
        query: any
    ) {

        const {
            page,
            limit,
            skip,
            take,
            search,
            orderBy
        } = buildQuery(query);

        const where:
            Prisma.ProductoBodegaWhereInput = {

            producto: {
                empresaId:
                    usuario.empresaId
            },

            bodega: {
                empresaId:
                    usuario.empresaId
            },

            ...(query.productoId && {
                productoId:
                    query.productoId
            }),

            ...(query.bodegaId && {
                bodegaId:
                    query.bodegaId
            }),

            ...(search && {
                OR: [

                    {
                        producto: {
                            nombre: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    },

                    {
                        producto: {
                            codigo: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    },

                    {
                        producto: {
                            sku: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    },

                    {
                        bodega: {
                            nombre: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    },

                    {
                        bodega: {
                            codigo: {
                                contains: search,
                                mode: 'insensitive'
                            }
                        }
                    }

                ]
            })

        };

        const [
            inventarios,
            total
        ] = await prisma.$transaction([

            prisma.productoBodega.findMany({

                where,

                skip,

                take,

                orderBy,

                include: {

                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            sku: true,
                            codigoBarras: true,
                            nombre: true,
                            stockMinimo: true,
                            stockMaximo: true
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

            prisma.productoBodega.count({
                where
            })

        ]);

        return paginatedResponse(
            inventarios,
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

        return this.obtenerInventario(
            id,
            usuario.empresaId
        );
    }

    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    async crear(
        data: CrearInventarioDto,
        usuario: Express.UserPayload
    ) {

        const empresaId =
            usuario.empresaId;

        await this.validarProducto(
            data.productoId,
            empresaId
        );

        await this.validarBodega(
            data.bodegaId,
            empresaId
        );

        const existente =
            await prisma.productoBodega.findUnique({

                where: {
                    productoId_bodegaId: {
                        productoId:
                            data.productoId,

                        bodegaId:
                            data.bodegaId
                    }
                },

                select: {
                    id: true
                }

            });

        if (existente) {

            throw new AppError(
                'El producto ya tiene inventario registrado en esta bodega.',
                400
            );
        }

        const stockInicial =
            data.stock ?? 0;

        return await prisma.$transaction(
            async (tx) => {

                const inventario =
                    await tx.productoBodega.create({

                        data: {

                            productoId:
                                data.productoId,

                            bodegaId:
                                data.bodegaId,

                            stock:
                                stockInicial

                        },

                        include: {

                            producto: {
                                select: {
                                    id: true,
                                    codigo: true,
                                    sku: true,
                                    codigoBarras: true,
                                    nombre: true
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

                    });

                /*
                 * Si existe stock inicial,
                 * registramos el movimiento.
                 */

                if (stockInicial > 0) {

                    await tx.movimientoInventario.create({

                        data: {

                            productoId:
                                data.productoId,

                            bodegaId:
                                data.bodegaId,

                            tipo:
                                TipoMovimiento.AJUSTE,

                            cantidad:
                                stockInicial,

                            stockAnterior:
                                0,

                            stockNuevo:
                                stockInicial

                        }

                    });
                }

                return inventario;
            }
        );
    }

    /*=====================================================
    ===================== AJUSTAR STOCK ==================
    =====================================================*/

    async ajustar(
        data: AjustarInventarioDto,
        usuario: Express.UserPayload
    ) {

        const empresaId =
            usuario.empresaId;

        await this.validarProducto(
            data.productoId,
            empresaId
        );

        await this.validarBodega(
            data.bodegaId,
            empresaId
        );

        return await prisma.$transaction(
            async (tx) => {

                const inventario =
                    await tx.productoBodega.findUnique({

                        where: {
                            productoId_bodegaId: {

                                productoId:
                                    data.productoId,

                                bodegaId:
                                    data.bodegaId
                            }
                        }

                    });

                if (!inventario) {

                    throw new AppError(
                        'No existe inventario para este producto en la bodega indicada.',
                        404
                    );
                }

                const stockAnterior =
                    inventario.stock;

                let stockNuevo: number;

                switch (data.tipo) {

                    /*---------------------------------
                    | ENTRADA
                    ---------------------------------*/

                    case TipoMovimiento.ENTRADA:

                        stockNuevo =
                            stockAnterior +
                            data.cantidad;

                        break;

                    /*---------------------------------
                    | SALIDA
                    ---------------------------------*/

                    case TipoMovimiento.SALIDA:

                        stockNuevo =
                            stockAnterior -
                            data.cantidad;

                        if (stockNuevo < 0) {

                            throw new AppError(
                                'No existe stock suficiente para realizar la salida.',
                                400
                            );
                        }

                        break;

                    /*---------------------------------
                    | AJUSTE
                    ---------------------------------*/

                    case TipoMovimiento.AJUSTE:

                        /*
                         * En un ajuste, cantidad
                         * representa el nuevo stock.
                         */

                        stockNuevo =
                            data.cantidad;

                        break;

                    default:

                        throw new AppError(
                            'Tipo de movimiento no permitido en este módulo.',
                            400
                        );
                }

                const actualizado =
                    await tx.productoBodega.update({

                        where: {
                            id:
                                inventario.id
                        },

                        data: {
                            stock:
                                stockNuevo
                        },

                        include: {

                            producto: {
                                select: {
                                    id: true,
                                    codigo: true,
                                    sku: true,
                                    codigoBarras: true,
                                    nombre: true
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

                    });

                const movimiento =
                    await tx.movimientoInventario.create({

                        data: {

                            productoId:
                                data.productoId,

                            bodegaId:
                                data.bodegaId,

                            tipo:
                                data.tipo,

                            cantidad:
                                data.cantidad,

                            stockAnterior,

                            stockNuevo,

                            observacion:
                                data.observacion?.trim()

                        }

                    });

                return {

                    inventario:
                        actualizado,

                    movimiento
                };
            }
        );
    }

    /*=====================================================
    ================= ACTUALIZAR STOCK ===================
    =====================================================*/

    async actualizar(
        id: string,
        data: ActualizarInventarioDto,
        usuario: Express.UserPayload
    ) {

        const inventario =
            await this.obtenerInventario(
                id,
                usuario.empresaId
            );

        const stockAnterior =
            inventario.stock;

        const stockNuevo =
            data.stock;

        return await prisma.$transaction(
            async (tx) => {

                const actualizado =
                    await tx.productoBodega.update({

                        where: {
                            id:
                                inventario.id
                        },

                        data: {
                            stock:
                                stockNuevo
                        },

                        include: {

                            producto: {
                                select: {
                                    id: true,
                                    codigo: true,
                                    sku: true,
                                    codigoBarras: true,
                                    nombre: true
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

                    });

                await tx.movimientoInventario.create({

                    data: {

                        productoId:
                            inventario.productoId,

                        bodegaId:
                            inventario.bodegaId,

                        tipo:
                            TipoMovimiento.AJUSTE,

                        cantidad:
                            stockNuevo,

                        stockAnterior,

                        stockNuevo,

                        observacion:
                            'Actualización manual de inventario.'

                    }

                });

                return actualizado;
            }
        );
    }

    /*=====================================================
    ================== MOVIMIENTOS =======================
    =====================================================*/

    async obtenerMovimientos(
        usuario: Express.UserPayload,
        query: any
    ) {

        const {
            page,
            limit,
            skip,
            take,
            orderBy
        } = buildQuery(query);

        const where:
            Prisma.MovimientoInventarioWhereInput = {

            producto: {
                empresaId:
                    usuario.empresaId
            },

            bodega: {
                empresaId:
                    usuario.empresaId
            },

            ...(query.productoId && {
                productoId:
                    query.productoId
            }),

            ...(query.bodegaId && {
                bodegaId:
                    query.bodegaId
            }),

            ...(query.tipo && {
                tipo:
                    query.tipo
            })

        };

        const [
            movimientos,
            total
        ] = await prisma.$transaction([

            prisma.movimientoInventario.findMany({

                where,

                skip,

                take,

                orderBy,

                include: {

                    producto: {
                        select: {
                            id: true,
                            codigo: true,
                            sku: true,
                            nombre: true
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

            prisma.movimientoInventario.count({
                where
            })

        ]);

        return paginatedResponse(
            movimientos,
            total,
            page,
            limit
        );
    }
}