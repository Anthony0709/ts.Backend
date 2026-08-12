import {
    Prisma,
    TipoMovimiento
} from '@prisma/client';

import prisma from '../../../config/prisma';

import {
    CrearTransferenciaDto,
    ConsultarTransferenciasDto
} from '../dto/transferencia.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class TransferenciaService {

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
        query: ConsultarTransferenciasDto
    ) {

        const {
            page,
            limit,
            skip,
            take
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

            tipo:
                TipoMovimiento.TRANSFERENCIA,

            ...(query.productoId && {
                productoId:
                    query.productoId
            }),

            ...(query.bodegaOrigenId && {
                bodegaId:
                    query.bodegaOrigenId
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

                orderBy: {
                    createdAt: 'desc'
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
    ======================= CREAR ========================
    =====================================================*/

    async crear(
        data: CrearTransferenciaDto,
        usuario: Express.UserPayload
    ) {

        const empresaId =
            usuario.empresaId;

        /*
         * Validar que origen y destino sean diferentes.
         */

        if (
            data.bodegaOrigenId ===
            data.bodegaDestinoId
        ) {

            throw new AppError(
                'La bodega de origen y destino deben ser diferentes.',
                400
            );
        }

        const producto =
            await this.validarProducto(
                data.productoId,
                empresaId
            );

        const bodegaOrigen =
            await this.validarBodega(
                data.bodegaOrigenId,
                empresaId
            );

        const bodegaDestino =
            await this.validarBodega(
                data.bodegaDestinoId,
                empresaId
            );

        return await prisma.$transaction(
            async (tx) => {

                /*
                 * Buscar inventario de origen.
                 */

                const inventarioOrigen =
                    await tx.productoBodega.findUnique({

                        where: {
                            productoId_bodegaId: {

                                productoId:
                                    data.productoId,

                                bodegaId:
                                    data.bodegaOrigenId

                            }
                        }

                    });

                if (!inventarioOrigen) {

                    throw new AppError(
                        'El producto no tiene inventario registrado en la bodega de origen.',
                        404
                    );
                }

                /*
                 * Validar stock suficiente.
                 */

                if (
                    inventarioOrigen.stock <
                    data.cantidad
                ) {

                    throw new AppError(
                        `Stock insuficiente en la bodega ${bodegaOrigen.nombre}. Stock disponible: ${inventarioOrigen.stock}.`,
                        400
                    );
                }

                /*
                 * Buscar inventario de destino.
                 */

                const inventarioDestino =
                    await tx.productoBodega.findUnique({

                        where: {
                            productoId_bodegaId: {

                                productoId:
                                    data.productoId,

                                bodegaId:
                                    data.bodegaDestinoId

                            }
                        }

                    });

                /*
                 * Si no existe inventario en destino,
                 * se crea automáticamente.
                 */

                const stockOrigenAnterior =
                    inventarioOrigen.stock;

                const stockOrigenNuevo =
                    stockOrigenAnterior -
                    data.cantidad;

                let stockDestinoAnterior: number;
                let stockDestinoNuevo: number;

                if (!inventarioDestino) {

                    stockDestinoAnterior = 0;

                    stockDestinoNuevo =
                        data.cantidad;

                    await tx.productoBodega.create({

                        data: {

                            productoId:
                                data.productoId,

                            bodegaId:
                                data.bodegaDestinoId,

                            stock:
                                stockDestinoNuevo

                        }

                    });

                } else {

                    stockDestinoAnterior =
                        inventarioDestino.stock;

                    stockDestinoNuevo =
                        stockDestinoAnterior +
                        data.cantidad;

                    await tx.productoBodega.update({

                        where: {
                            id:
                                inventarioDestino.id
                        },

                        data: {
                            stock:
                                stockDestinoNuevo
                        }

                    });
                }

                /*
                 * Actualizar stock de origen.
                 */

                await tx.productoBodega.update({

                    where: {
                        id:
                            inventarioOrigen.id
                    },

                    data: {
                        stock:
                            stockOrigenNuevo
                    }

                });

                /*
                 * Movimiento de salida de origen.
                 */

                const movimientoOrigen =
                    await tx.movimientoInventario.create({

                        data: {

                            productoId:
                                data.productoId,

                            bodegaId:
                                data.bodegaOrigenId,

                            tipo:
                                TipoMovimiento.TRANSFERENCIA,

                            cantidad:
                                data.cantidad,

                            stockAnterior:
                                stockOrigenAnterior,

                            stockNuevo:
                                stockOrigenNuevo,

                            observacion:
                                data.observacion
                                    ? `Transferencia hacia ${bodegaDestino.nombre}: ${data.observacion.trim()}`
                                    : `Transferencia hacia ${bodegaDestino.nombre}.`

                        }

                    });

                /*
                 * Movimiento de entrada en destino.
                 */

                const movimientoDestino =
                    await tx.movimientoInventario.create({

                        data: {

                            productoId:
                                data.productoId,

                            bodegaId:
                                data.bodegaDestinoId,

                            tipo:
                                TipoMovimiento.TRANSFERENCIA,

                            cantidad:
                                data.cantidad,

                            stockAnterior:
                                stockDestinoAnterior,

                            stockNuevo:
                                stockDestinoNuevo,

                            observacion:
                                data.observacion
                                    ? `Transferencia desde ${bodegaOrigen.nombre}: ${data.observacion.trim()}`
                                    : `Transferencia desde ${bodegaOrigen.nombre}.`

                        }

                    });

                return {

                    producto,

                    origen: {

                        bodega:
                            bodegaOrigen,

                        stockAnterior:
                            stockOrigenAnterior,

                        stockNuevo:
                            stockOrigenNuevo,

                        movimiento:
                            movimientoOrigen

                    },

                    destino: {

                        bodega:
                            bodegaDestino,

                        stockAnterior:
                            stockDestinoAnterior,

                        stockNuevo:
                            stockDestinoNuevo,

                        movimiento:
                            movimientoDestino

                    },

                    cantidad:
                        data.cantidad
                };
            }
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

                    tipo:
                        TipoMovimiento.TRANSFERENCIA,

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
                'La transferencia no existe.',
                404
            );
        }

        return movimiento;
    }
}