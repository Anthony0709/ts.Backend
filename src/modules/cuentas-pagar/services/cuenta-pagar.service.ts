import {
    Prisma,
    EstadoCuentaPagar
} from '@prisma/client';

import prisma from '../../../config/prisma';

import {
    CrearCuentaPagarDto,
    ActualizarCuentaPagarDto,
    ConsultarCuentasPagarDto,
    RegistrarPagoCuentaPagarDto,
    ConsultarPagosCuentaPagarDto
} from '../dto/cuenta-pagar.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';


export class CuentaPagarService {

    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/

    private async generarNumero(
        empresaId: string,
        tx: Prisma.TransactionClient | typeof prisma = prisma
    ): Promise<string> {

        for (let intento = 0; intento < 20; intento++) {

            const numero =
                `CP-${Date.now()}-${Math.floor(
                    1000 + Math.random() * 9000
                )}`;

            const existe =
                await tx.cuentaPagar.findFirst({

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
            'No fue posible generar el número de cuenta por pagar.',
            500
        );
    }


    private async obtenerCuenta(
        id: string,
        empresaId: string
    ) {

        const cuenta =
            await prisma.cuentaPagar.findFirst({

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
                            ruc: true,
                            diasCredito: true
                        }
                    },

                    compra: {
                        select: {
                            id: true,
                            numero: true,
                            fecha: true,
                            estado: true,
                            subtotal: true,
                            impuesto: true,
                            total: true
                        }
                    },

                    pagos: {
                        orderBy: {
                            fecha: 'desc'
                        }
                    }

                }

            });

        if (!cuenta) {

            throw new AppError(
                'La cuenta por pagar no existe.',
                404
            );
        }

        return cuenta;
    }


    private calcularEstado(
        saldo: Prisma.Decimal,
        fechaVencimiento: Date | null
    ): EstadoCuentaPagar {

        const hoy =
            new Date();

        hoy.setHours(
            0,
            0,
            0,
            0
        );

        if (
            saldo.lessThanOrEqualTo(0)
        ) {
            return EstadoCuentaPagar.PAGADA;
        }

        if (
            fechaVencimiento
        ) {

            const vencimiento =
                new Date(
                    fechaVencimiento
                );

            vencimiento.setHours(
                0,
                0,
                0,
                0
            );

            if (
                vencimiento < hoy
            ) {
                return EstadoCuentaPagar.VENCIDA;
            }
        }

        return EstadoCuentaPagar.PENDIENTE;
    }


    private async actualizarVencida(
        cuenta: {
            id: string;
            estado: EstadoCuentaPagar;
            saldo: Prisma.Decimal;
            fechaVencimiento: Date | null;
        }
    ) {

        if (
            cuenta.saldo.lessThanOrEqualTo(0)
        ) {
            return;
        }

        const nuevoEstado =
            this.calcularEstado(
                cuenta.saldo,
                cuenta.fechaVencimiento
            );

        if (
            nuevoEstado !==
            cuenta.estado
        ) {

            return prisma.cuentaPagar.update({

                where: {
                    id: cuenta.id
                },

                data: {
                    estado:
                        nuevoEstado
                }

            });
        }
    }


    private async obtenerProveedor(
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
                    ruc: true,
                    diasCredito: true

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
        query: ConsultarCuentasPagarDto
    ) {

        const {
            page,
            limit,
            skip,
            take
        } = buildQuery(query);

        const where:
            Prisma.CuentaPagarWhereInput = {

            empresaId:
                usuario.empresaId,

            ...(query.proveedorId && {

                proveedorId:
                    query.proveedorId

            }),

            ...(query.estado && {

                estado:
                    query.estado

            }),

            ...(query.compraId && {

                compraId:
                    query.compraId

            }),

            ...(query.fechaDesde && {

                fecha: {

                    gte:
                        new Date(
                            query.fechaDesde
                        )

                }

            }),

            ...(query.fechaHasta && {

                fecha: {

                    ...(query.fechaDesde && {

                        gte:
                            new Date(
                                query.fechaDesde
                            )

                    }),

                    lte:
                        new Date(
                            query.fechaHasta
                        )

                }

            }),

            ...(query.vencimientoDesde && {

                fechaVencimiento: {

                    gte:
                        new Date(
                            query.vencimientoDesde
                        )

                }

            }),

            ...(query.vencimientoHasta && {

                fechaVencimiento: {

                    ...(query.vencimientoDesde && {

                        gte:
                            new Date(
                                query.vencimientoDesde
                            )

                    }),

                    lte:
                        new Date(
                            query.vencimientoHasta
                        )

                }

            })

        };

        const [
            cuentas,
            total
        ] = await prisma.$transaction([

            prisma.cuentaPagar.findMany({

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

                    compra: {

                        select: {

                            id: true,
                            numero: true,
                            fecha: true,
                            total: true,
                            estado: true

                        }

                    }

                }

            }),

            prisma.cuentaPagar.count({
                where
            })

        ]);

        /*
         * Actualizamos las cuentas vencidas
         * después de obtenerlas.
         */

        for (
            const cuenta of cuentas
        ) {

            await this.actualizarVencida({

                id:
                    cuenta.id,

                estado:
                    cuenta.estado,

                saldo:
                    cuenta.saldo,

                fechaVencimiento:
                    cuenta.fechaVencimiento

            });
        }

        return paginatedResponse(
            cuentas,
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

        const cuenta =
            await this.obtenerCuenta(
                id,
                usuario.empresaId
            );

        await this.actualizarVencida({

            id:
                cuenta.id,

            estado:
                cuenta.estado,

            saldo:
                cuenta.saldo,

            fechaVencimiento:
                cuenta.fechaVencimiento

        });

        return this.obtenerCuenta(
            id,
            usuario.empresaId
        );
    }


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    async crear(
        data: CrearCuentaPagarDto,
        usuario: Express.UserPayload
    ) {

        const empresaId =
            usuario.empresaId;

        /*
         * La cuenta nace desde una compra.
         */

        const compra =
            await prisma.compra.findFirst({

                where: {

                    id:
                        data.compraId,

                    empresaId

                },

                include: {

                    proveedor: {

                        select: {

                            id: true,
                            nombreComercial: true,
                            razonSocial: true,
                            ruc: true,
                            diasCredito: true

                        }

                    },

                    cuentaPagar: {
                        select: {
                            id: true
                        }
                    }

                }

            });

        if (!compra) {

            throw new AppError(
                'La compra no existe o no pertenece a la empresa.',
                404
            );
        }

        /*
         * Solo una cuenta por compra.
         */

        if (
            compra.cuentaPagar
        ) {

            throw new AppError(
                'La compra ya tiene una cuenta por pagar asociada.',
                400
            );
        }

        /*
         * Una cuenta por pagar solo debe
         * generarse sobre una compra aprobada.
         */

        if (
            compra.estado !==
            'APROBADA'
        ) {

            throw new AppError(
                'Solo se puede crear una cuenta por pagar para una compra APROBADA.',
                400
            );
        }

        const numero =
            await this.generarNumero(
                empresaId
            );

        let fechaVencimiento:
            Date | null = null;

        if (
            data.fechaVencimiento
        ) {

            fechaVencimiento =
                new Date(
                    data.fechaVencimiento
                );

        } else if (
            compra.proveedor.diasCredito > 0
        ) {

            fechaVencimiento =
                new Date();

            fechaVencimiento.setDate(

                fechaVencimiento.getDate() +
                compra.proveedor.diasCredito

            );
        }

        return prisma.cuentaPagar.create({

            data: {

                numero,

                fechaVencimiento,

                proveedor: {

                    connect: {

                        id:
                            compra.proveedorId

                    }

                },

                empresa: {

                    connect: {

                        id:
                            empresaId

                    }

                },

                compra: {

                    connect: {

                        id:
                            compra.id

                    }

                },

                estado:
                    EstadoCuentaPagar.PENDIENTE,

                total:
                    compra.total,

                saldo:
                    compra.total,

                observacion:
                    data.observacion?.trim()

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

                compra: {

                    select: {

                        id: true,
                        numero: true,
                        fecha: true,
                        total: true,
                        estado: true

                    }

                },

                pagos: true

            }

        });
    }


    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/

    async actualizar(
        id: string,
        data: ActualizarCuentaPagarDto,
        usuario: Express.UserPayload
    ) {

        const cuenta =
            await this.obtenerCuenta(
                id,
                usuario.empresaId
            );

        if (
            cuenta.estado ===
            EstadoCuentaPagar.PAGADA
        ) {

            throw new AppError(
                'No se puede modificar una cuenta por pagar que ya está pagada.',
                400
            );
        }

        if (
            data.fechaVencimiento
        ) {

            const fecha =
                new Date(
                    data.fechaVencimiento
                );

            if (
                fecha < cuenta.fecha
            ) {

                throw new AppError(
                    'La fecha de vencimiento no puede ser anterior a la fecha de la cuenta.',
                    400
                );
            }
        }

        return prisma.cuentaPagar.update({

            where: {

                id:
                    cuenta.id

            },

            data: {

                ...(data.fechaVencimiento !== undefined && {

                    fechaVencimiento:
                        new Date(
                            data.fechaVencimiento
                        )

                }),

                ...(data.observacion !== undefined && {

                    observacion:
                        data.observacion?.trim()

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

                compra: {

                    select: {

                        id: true,
                        numero: true,
                        fecha: true,
                        total: true,
                        estado: true

                    }

                },

                pagos: {

                    orderBy: {
                        fecha: 'desc'
                    }

                }

            }

        });
    }


    /*=====================================================
    ==================== REGISTRAR PAGO ==================
    =====================================================*/

    async registrarPago(
        id: string,
        data: RegistrarPagoCuentaPagarDto,
        usuario: Express.UserPayload
    ) {

        const cuenta =
            await this.obtenerCuenta(
                id,
                usuario.empresaId
            );

        /*
         * No se puede pagar una cuenta
         * que ya está completamente pagada.
         */

        if (
            cuenta.saldo.lessThanOrEqualTo(0)
        ) {

            throw new AppError(
                'La cuenta por pagar ya está completamente pagada.',
                400
            );
        }

        const monto =
            new Prisma.Decimal(
                data.monto
            );

        /*
         * El pago no puede superar el saldo.
         */

        if (
            monto.greaterThan(
                cuenta.saldo
            )
        ) {

            throw new AppError(
                'El monto del pago no puede ser mayor al saldo pendiente.',
                400
            );
        }

        const nuevoSaldo =
            cuenta.saldo.sub(
                monto
            );

        let nuevoEstado:
            EstadoCuentaPagar;

        if (
            nuevoSaldo.equals(0)
        ) {

            nuevoEstado =
                EstadoCuentaPagar.PAGADA;

        } else {

            nuevoEstado =
                EstadoCuentaPagar.PARCIAL;
        }

        return prisma.$transaction(
            async tx => {

                /*
                 * Crear el abono.
                 */

                const pago =
                    await tx.abonoCuentaPagar.create({

                        data: {

                            cuentaPagar: {

                                connect: {

                                    id:
                                        cuenta.id

                                }

                            },

                            monto,

                            metodoPago:
                                data.metodoPago,

                            referencia:
                                data.referencia?.trim(),

                            observacion:
                                data.observacion?.trim()

                        }

                    });


                /*
                 * Actualizar saldo y estado.
                 */

                const cuentaActualizada =
                    await tx.cuentaPagar.update({

                        where: {

                            id:
                                cuenta.id

                        },

                        data: {

                            saldo:
                                nuevoSaldo,

                            estado:
                                nuevoEstado

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

                            compra: {

                                select: {

                                    id: true,
                                    numero: true,
                                    total: true

                                }

                            },

                            pagos: {

                                orderBy: {

                                    fecha:
                                        'desc'

                                }

                            }

                        }

                    });

                return {

                    pago,

                    cuenta:
                        cuentaActualizada

                };
            }
        );
    }


    /*=====================================================
    =================== CONSULTAR PAGOS ==================
    =====================================================*/

    async obtenerPagos(
        id: string,
        usuario: Express.UserPayload,
        query: ConsultarPagosCuentaPagarDto
    ) {

        const cuenta =
            await prisma.cuentaPagar.findFirst({

                where: {

                    id,

                    empresaId:
                        usuario.empresaId

                },

                select: {

                    id: true,
                    numero: true

                }

            });

        if (!cuenta) {

            throw new AppError(
                'La cuenta por pagar no existe.',
                404
            );
        }

        const {
            page,
            limit,
            skip,
            take
        } = buildQuery(query);

        const where:
            Prisma.AbonoCuentaPagarWhereInput = {

            cuentaPagarId:
                cuenta.id,

            ...(query.metodoPago && {

                metodoPago:
                    query.metodoPago

            }),

            ...(query.fechaDesde && {

                fecha: {

                    gte:
                        new Date(
                            query.fechaDesde
                        )

                }

            }),

            ...(query.fechaHasta && {

                fecha: {

                    ...(query.fechaDesde && {

                        gte:
                            new Date(
                                query.fechaDesde
                            )

                    }),

                    lte:
                        new Date(
                            query.fechaHasta
                        )

                }

            })

        };

        const [
            pagos,
            total
        ] = await prisma.$transaction([

            prisma.abonoCuentaPagar.findMany({

                where,

                skip,

                take,

                orderBy: {

                    fecha:
                        'desc'

                }

            }),

            prisma.abonoCuentaPagar.count({
                where
            })

        ]);

        return paginatedResponse(
            pagos,
            total,
            page,
            limit
        );
    }
}