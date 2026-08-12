import {
    Prisma,
    TipoMovimiento
} from '@prisma/client';

import prisma from '../../../config/prisma';

import {
    CrearMovimientoInventarioDto,
    ConsultarMovimientoInventarioDto
} from '../dto/movimiento-inventario.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class MovimientoInventarioService {

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
                    sku: true
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

    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/

    async obtenerTodos(
        usuario: Express.UserPayload,
        query: ConsultarMovimientoInventarioDto
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
                    query.tipo as TipoMovimiento
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
                            nombre: true,
                            codigo: true,
                            sku: true
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

    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/

    async obtenerPorId(
        id: string,
        usuario: Express.UserPayload
    ) {

        const movimiento =
            await prisma.movimientoInventario.findFirst({

                where: {

                    id,

                    producto: {
                        empresaId:
                            usuario.empresaId
                    },

                    bodega: {
                        empresaId:
                            usuario.empresaId
                    }

                },

                include: {

                    producto: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true,
                            sku: true
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

        if (!movimiento) {

            throw new AppError(
                'El movimiento de inventario no existe.',
                404
            );
        }

        return movimiento;
    }

    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    async crear(
        data: CrearMovimientoInventarioDto,
        usuario: Express.UserPayload
    ) {

        const empresaId =
            usuario.empresaId;

        /*
         * TRANSFERENCIA no se crea directamente aquí.
         * Debe utilizar el módulo de Transferencias,
         * porque una transferencia afecta dos bodegas.
         */

        if (
            data.tipo ===
            TipoMovimiento.TRANSFERENCIA
        ) {

            throw new AppError(
                'Las transferencias deben realizarse desde el módulo de Transferencias.',
                400
            );
        }

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

                    case TipoMovimiento.ENTRADA:

                        stockNuevo =
                            stockAnterior +
                            data.cantidad;

                        break;

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

                    case TipoMovimiento.AJUSTE:

                        /*
                         * En un ajuste, la cantidad
                         * representa el nuevo stock.
                         */

                        stockNuevo =
                            data.cantidad;

                        break;

                    default:

                        throw new AppError(
                            'Tipo de movimiento no permitido.',
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

                        },

                        include: {

                            producto: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    codigo: true,
                                    sku: true
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

                return movimiento;
            }
        );
    }
}