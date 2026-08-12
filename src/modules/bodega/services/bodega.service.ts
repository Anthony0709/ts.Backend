import {
    Prisma
} from '@prisma/client';

import {
    randomBytes
} from 'crypto';

import prisma from '../../../config/prisma';

import {
    CrearBodegaDto,
    ActualizarBodegaDto,
    ConsultarBodegasDto
} from '../dto/bodega.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';


export class BodegaService {

    /*=====================================================
    ================= GENERAR CÓDIGO =====================
    =====================================================*/

    private generarCodigo(): string {

        return `BOD-${randomBytes(4)
            .toString('hex')
            .toUpperCase()}`;
    }


    /*=====================================================
    ============ GENERAR CÓDIGO ÚNICO ====================
    =====================================================*/

    private async generarCodigoUnico(
        empresaId: string
    ): Promise<string> {

        let codigo: string;

        let existe: {
            id: string;
        } | null;


        do {

            codigo =
                this.generarCodigo();

            existe =
                await prisma.bodega.findFirst({

                    where: {

                        empresaId,

                        codigo

                    },

                    select: {

                        id: true

                    }

                });

        } while (existe);


        return codigo;
    }


    /*=====================================================
    ====================== CREAR =========================
    =====================================================*/

    async crear(
        empresaId: string,
        data: CrearBodegaDto
    ) {

        /*
         * El código NO lo tomamos del frontend.
         * El backend lo genera automáticamente.
         */

        const codigo =
            await this.generarCodigoUnico(
                empresaId
            );


        /*
         * Verificar nombre duplicado.
         */

        const existeNombre =
            await prisma.bodega.findFirst({

                where: {

                    empresaId,

                    nombre:
                        data.nombre

                },

                select: {

                    id: true

                }

            });


        if (existeNombre) {

            throw new AppError(
                'Ya existe una bodega con ese nombre.',
                400
            );
        }


        const bodega =
            await prisma.bodega.create({

                data: {

                    nombre:
                        data.nombre,

                    codigo,

                    direccion:
                        data.direccion,

                    responsable:
                        data.responsable,

                    telefono:
                        data.telefono,

                    estado:
                        data.estado ??
                        true,

                    empresa: {

                        connect: {

                            id:
                                empresaId

                        }

                    }

                },

                include: {

                    _count: {

                        select: {

                            inventarios: true,

                            movimientos: true,

                            transferenciasOrigen: true,

                            transferenciasDestino: true,

                            devoluciones: true

                        }

                    }

                }

            });


        return bodega;
    }


    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/

    async obtenerPorId(
        id: string,
        empresaId: string
    ) {

        const bodega =
            await prisma.bodega.findFirst({

                where: {

                    id,

                    empresaId

                },

                include: {

                    _count: {

                        select: {

                            inventarios: true,

                            movimientos: true,

                            transferenciasOrigen: true,

                            transferenciasDestino: true,

                            devoluciones: true

                        }

                    }

                }

            });


        if (!bodega) {

            throw new AppError(
                'La bodega no existe.',
                404
            );
        }


        return bodega;
    }


    /*=====================================================
    ====================== LISTAR ========================
    =====================================================*/

    async obtenerTodos(
        empresaId: string,
        query: ConsultarBodegasDto
    ) {

        const {
            page,
            limit,
            skip,
            take,
            orderBy
        } = buildQuery(query);


        const where:
            Prisma.BodegaWhereInput = {

            empresaId,


            ...(query.nombre
                ? {

                    nombre: {

                        contains:
                            query.nombre,

                        mode:
                            'insensitive'

                    }

                }
                : {}),


            ...(query.codigo
                ? {

                    codigo: {

                        contains:
                            query.codigo,

                        mode:
                            'insensitive'

                    }

                }
                : {}),


            ...(query.estado !== undefined
                ? {

                    estado:
                        query.estado

                }
                : {})

        };


        const [
            bodegas,
            total
        ] =
            await prisma.$transaction([

                prisma.bodega.findMany({

                    where,

                    skip,

                    take,

                    orderBy,

                    include: {

                        _count: {

                            select: {

                                inventarios: true,

                                movimientos: true,

                                transferenciasOrigen:
                                    true,

                                transferenciasDestino:
                                    true,

                                devoluciones:
                                    true

                            }

                        }

                    }

                }),


                prisma.bodega.count({

                    where

                })

            ]);


        return paginatedResponse(
            bodegas,
            total,
            page,
            limit
        );
    }


    /*=====================================================
    ===================== ACTUALIZAR =====================
    =====================================================*/

    async actualizar(
        id: string,
        empresaId: string,
        data: ActualizarBodegaDto
    ) {

        const bodega =
            await prisma.bodega.findFirst({

                where: {

                    id,

                    empresaId

                }

            });


        if (!bodega) {

            throw new AppError(
                'La bodega no existe.',
                404
            );
        }


        /*
         * Verificar nombre duplicado.
         */

        if (
            data.nombre !== undefined
        ) {

            const existeNombre =
                await prisma.bodega.findFirst({

                    where: {

                        empresaId,

                        nombre:
                            data.nombre,

                        id: {

                            not:
                                id

                        }

                    },

                    select: {

                        id: true

                    }

                });


            if (existeNombre) {

                throw new AppError(
                    'Ya existe otra bodega con ese nombre.',
                    400
                );
            }
        }


        /*
         * El código NO se modifica.
         *
         * Se mantiene el código generado
         * originalmente.
         */


        const actualizada =
            await prisma.bodega.update({

                where: {

                    id

                },

                data: {

                    ...(data.nombre !== undefined && {

                        nombre:
                            data.nombre

                    }),


                    ...(data.direccion !== undefined && {

                        direccion:
                            data.direccion

                    }),


                    ...(data.responsable !== undefined && {

                        responsable:
                            data.responsable

                    }),


                    ...(data.telefono !== undefined && {

                        telefono:
                            data.telefono

                    }),


                    ...(data.estado !== undefined && {

                        estado:
                            data.estado

                    })

                },

                include: {

                    _count: {

                        select: {

                            inventarios: true,

                            movimientos: true,

                            transferenciasOrigen:
                                true,

                            transferenciasDestino:
                                true,

                            devoluciones:
                                true

                        }

                    }

                }

            });


        return actualizada;
    }


    /*=====================================================
    ==================== CAMBIAR ESTADO ==================
    =====================================================*/

    async cambiarEstado(
        id: string,
        empresaId: string,
        estado: boolean
    ) {

        const bodega =
            await prisma.bodega.findFirst({

                where: {

                    id,

                    empresaId

                }

            });


        if (!bodega) {

            throw new AppError(
                'La bodega no existe.',
                404
            );
        }


        const actualizada =
            await prisma.bodega.update({

                where: {

                    id

                },

                data: {

                    estado

                },

                include: {

                    _count: {

                        select: {

                            inventarios: true,

                            movimientos: true,

                            transferenciasOrigen:
                                true,

                            transferenciasDestino:
                                true,

                            devoluciones:
                                true

                        }

                    }

                }

            });


        return actualizada;
    }


    /*=====================================================
    ================== ELIMINAR ==========================
    =====================================================*/

    async eliminar(
        id: string,
        empresaId: string
    ) {

        const bodega =
            await prisma.bodega.findFirst({

                where: {

                    id,

                    empresaId

                },

                include: {

                    _count: {

                        select: {

                            inventarios: true,

                            movimientos: true,

                            transferenciasOrigen:
                                true,

                            transferenciasDestino:
                                true,

                            devoluciones:
                                true

                        }

                    }

                }

            });


        if (!bodega) {

            throw new AppError(
                'La bodega no existe.',
                404
            );
        }


        /*
         * No eliminar físicamente una bodega
         * que ya tiene movimientos o inventario.
         */

        const tieneMovimientos =
            bodega._count.movimientos > 0;

        const tieneTransferencias =
            bodega._count.transferenciasOrigen > 0 ||
            bodega._count.transferenciasDestino > 0;

        const tieneDevoluciones =
            bodega._count.devoluciones > 0;

        const tieneInventario =
            bodega._count.inventarios > 0;


        if (
            tieneMovimientos ||
            tieneTransferencias ||
            tieneDevoluciones ||
            tieneInventario
        ) {

            throw new AppError(
                'No se puede eliminar la bodega porque tiene información relacionada. Desactívela en su lugar.',
                400
            );
        }


        await prisma.bodega.delete({

            where: {

                id

            }

        });


        return null;
    }
}