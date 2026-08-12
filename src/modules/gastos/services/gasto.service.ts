import {
    Prisma,
    EstadoGasto
} from '@prisma/client';

import prisma from '../../../config/prisma';

import {
    CrearGastoDto,
    ActualizarGastoDto,
    ConsultarGastosDto
} from '../dto/gasto.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';


export class GastoService {

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
                    prefijoGasto: true
                }

            });

        const prefijo =
            configuracion?.prefijoGasto || 'GAS';

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
                await tx.gasto.findFirst({

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
            'No fue posible generar el número del gasto.',
            500
        );
    }


    private async obtenerGasto(
        id: string,
        empresaId: string
    ) {

        const gasto =
            await prisma.gasto.findFirst({

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

                    }

                }

            });

        if (!gasto) {

            throw new AppError(
                'El gasto no existe.',
                404
            );
        }

        return gasto;
    }


    private async validarProveedor(
        proveedorId: string,
        empresaId: string
    ) {

        const proveedor =
            await prisma.proveedor.findFirst({

                where: {

                    id:
                        proveedorId,

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


    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/

    async obtenerTodos(
        usuario: Express.UserPayload,
        query: ConsultarGastosDto
    ) {

        const {
            page,
            limit,
            skip,
            take
        } = buildQuery(query);

        const where:
            Prisma.GastoWhereInput = {

            empresaId:
                usuario.empresaId,

            ...(query.proveedorId && {

                proveedorId:
                    query.proveedorId

            }),

            ...(query.estado && {

                estado:
                    query.estado as EstadoGasto

            }),

            ...(query.categoria && {

                categoria: {
                    contains:
                        query.categoria,
                    mode:
                        'insensitive'
                }

            }),

            ...(query.metodoPago && {

                metodoPago:
                    query.metodoPago

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
                : {}),

            ...(query.montoMinimo !== undefined ||
                query.montoMaximo !== undefined
                ? {

                    monto: {

                        ...(query.montoMinimo !== undefined && {

                            gte:
                                new Prisma.Decimal(
                                    query.montoMinimo
                                )

                        }),

                        ...(query.montoMaximo !== undefined && {

                            lte:
                                new Prisma.Decimal(
                                    query.montoMaximo
                                )

                        })

                    }

                }
                : {})

        };

        const [
            gastos,
            total
        ] = await prisma.$transaction([

            prisma.gasto.findMany({

                where,

                skip,

                take,

                orderBy: {

                    createdAt:
                        'desc'

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

            prisma.gasto.count({
                where
            })

        ]);

        return paginatedResponse(
            gastos,
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

        return this.obtenerGasto(
            id,
            usuario.empresaId
        );
    }


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    async crear(
        data: CrearGastoDto,
        usuario: Express.UserPayload
    ) {

        const empresaId =
            usuario.empresaId;

        /*
         * Si viene proveedorId,
         * validamos que pertenezca a la empresa.
         */

        if (data.proveedorId) {

            await this.validarProveedor(
                data.proveedorId,
                empresaId
            );
        }

        const numero =
            await this.generarNumero(
                empresaId
            );

        return prisma.gasto.create({

            data: {

                numero,

                concepto:
                    data.concepto.trim(),

                descripcion:
                    data.descripcion?.trim(),

                ...(data.proveedorId && {

                    proveedor: {

                        connect: {

                            id:
                                data.proveedorId

                        }

                    }

                }),

                empresa: {

                    connect: {

                        id:
                            empresaId

                    }

                },

                categoria:
                    data.categoria.trim(),

                monto:
                    new Prisma.Decimal(
                        data.monto
                    ),

                estado:
                    EstadoGasto.PENDIENTE,

                metodoPago:
                    data.metodoPago,

                referencia:
                    data.referencia?.trim()

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

        });
    }


    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/

    async actualizar(
        id: string,
        data: ActualizarGastoDto,
        usuario: Express.UserPayload
    ) {

        const gasto =
            await this.obtenerGasto(
                id,
                usuario.empresaId
            );

        /*
         * Un gasto pagado o anulado no debe
         * modificarse.
         */

        if (
            gasto.estado ===
            EstadoGasto.PAGADO
        ) {

            throw new AppError(
                'No se puede modificar un gasto que ya está pagado.',
                400
            );
        }

        if (
            gasto.estado ===
            EstadoGasto.ANULADO
        ) {

            throw new AppError(
                'No se puede modificar un gasto que está anulado.',
                400
            );
        }

        /*
         * Si se envía proveedorId,
         * validamos el proveedor.
         */

        if (
            data.proveedorId
        ) {

            await this.validarProveedor(
                data.proveedorId,
                usuario.empresaId
            );
        }

        return prisma.gasto.update({

            where: {

                id:
                    gasto.id

            },

            data: {

                ...(data.concepto !== undefined && {

                    concepto:
                        data.concepto.trim()

                }),

                ...(data.descripcion !== undefined && {

                    descripcion:
                        data.descripcion?.trim()

                }),

                ...(data.proveedorId !== undefined && (

                    data.proveedorId === null

                        ? {

                            proveedor: {
                                disconnect: true
                            }

                        }

                        : {

                            proveedor: {

                                connect: {

                                    id:
                                        data.proveedorId

                                }

                            }

                        }

                )),

                ...(data.categoria !== undefined && {

                    categoria:
                        data.categoria.trim()

                }),

                ...(data.monto !== undefined && {

                    monto:
                        new Prisma.Decimal(
                            data.monto
                        )

                }),

                ...(data.metodoPago !== undefined && (

                    data.metodoPago === null

                        ? {
                            metodoPago: null
                        }

                        : {
                            metodoPago:
                                data.metodoPago
                        }

                )),

                ...(data.referencia !== undefined && (

                    data.referencia === null

                        ? {
                            referencia: null
                        }

                        : {
                            referencia:
                                data.referencia.trim()
                        }

                ))

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

        });
    }


    /*=====================================================
    ====================== PAGAR =========================
    =====================================================*/

    async pagar(
        id: string,
        usuario: Express.UserPayload
    ) {

        const gasto =
            await this.obtenerGasto(
                id,
                usuario.empresaId
            );

        if (
            gasto.estado ===
            EstadoGasto.PAGADO
        ) {

            throw new AppError(
                'El gasto ya está pagado.',
                400
            );
        }

        if (
            gasto.estado ===
            EstadoGasto.ANULADO
        ) {

            throw new AppError(
                'No se puede pagar un gasto anulado.',
                400
            );
        }

        return prisma.gasto.update({

            where: {

                id:
                    gasto.id

            },

            data: {

                estado:
                    EstadoGasto.PAGADO

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

        });
    }


    /*=====================================================
    ====================== ANULAR ========================
    =====================================================*/

    async anular(
        id: string,
        usuario: Express.UserPayload
    ) {

        const gasto =
            await this.obtenerGasto(
                id,
                usuario.empresaId
            );

        if (
            gasto.estado ===
            EstadoGasto.ANULADO
        ) {

            throw new AppError(
                'El gasto ya está anulado.',
                400
            );
        }

        if (
            gasto.estado ===
            EstadoGasto.PAGADO
        ) {

            throw new AppError(
                'No se puede anular un gasto que ya está pagado.',
                400
            );
        }

        return prisma.gasto.update({

            where: {

                id:
                    gasto.id

            },

            data: {

                estado:
                    EstadoGasto.ANULADO

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

        });
    }
}