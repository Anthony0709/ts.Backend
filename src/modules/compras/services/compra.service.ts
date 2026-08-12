import {
    Prisma,
    EstadoCompra
} from '@prisma/client';

import prisma from '../../../config/prisma';

import {
    CrearCompraDto,
    ActualizarCompraDto,
    ConsultarComprasDto
} from '../dto/compra.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';


export class CompraService {

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
                    prefijoCompra: true
                }

            });

        const prefijo =
            configuracion?.prefijoCompra || 'COM';

        for (let intento = 0; intento < 20; intento++) {

            const numero =
                `${prefijo}-${Date.now()}-${Math.floor(
                    1000 + Math.random() * 9000
                )}`;

            const existe =
                await tx.compra.findFirst({

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
            'No fue posible generar el número de compra.',
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


    private async validarProductos(
        detalles: CrearCompraDto['detalles'],
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


    private calcularTotales(
        detalles: CrearCompraDto['detalles'],
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

                const subtotalDetalle =
                    cantidad.mul(costo);

                subtotal =
                    subtotal.add(
                        subtotalDetalle
                    );

                return {

                    productoId:
                        detalle.productoId,

                    cantidad:
                        detalle.cantidad,

                    costo,

                    subtotal:
                        subtotalDetalle

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


    private async obtenerCompra(
        id: string,
        empresaId: string
    ) {

        const compra =
            await prisma.compra.findFirst({

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

                    },

                    cuentaPagar: true

                }

            });

        if (!compra) {

            throw new AppError(
                'La compra no existe.',
                404
            );
        }

        return compra;
    }


    private async generarNumeroCuentaPagar(
        empresaId: string,
        tx: Prisma.TransactionClient
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


    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/

    async obtenerTodos(
        usuario: Express.UserPayload,
        query: ConsultarComprasDto
    ) {

        const {
            page,
            limit,
            skip,
            take
        } = buildQuery(query);

        const where:
            Prisma.CompraWhereInput = {

            empresaId:
                usuario.empresaId,

            ...(query.proveedorId && {

                proveedorId:
                    query.proveedorId

            }),

            ...(query.estado && {

                estado:
                    query.estado as EstadoCompra

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
            compras,
            total
        ] = await prisma.$transaction([

            prisma.compra.findMany({

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

                    },

                    cuentaPagar: true

                }

            }),

            prisma.compra.count({
                where
            })

        ]);

        return paginatedResponse(
            compras,
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

        return this.obtenerCompra(
            id,
            usuario.empresaId
        );
    }


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    async crear(
        data: CrearCompraDto,
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

        return prisma.compra.create({

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
                    EstadoCompra.BORRADOR,

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
        data: ActualizarCompraDto,
        usuario: Express.UserPayload
    ) {

        const compra =
            await this.obtenerCompra(
                id,
                usuario.empresaId
            );

        if (
            compra.estado !==
            EstadoCompra.BORRADOR
        ) {

            throw new AppError(
                'Solo se pueden modificar compras en estado BORRADOR.',
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
            compra.detalles.map(
                detalle => ({

                    productoId:
                        detalle.productoId,

                    cantidad:
                        detalle.cantidad,

                    costo:
                        Number(
                            detalle.costo
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

                if (data.detalles) {

                    await tx.compraDetalle.deleteMany({

                        where: {

                            compraId:
                                compra.id

                        }

                    });
                }

                return tx.compra.update({

                    where: {

                        id:
                            compra.id

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

                        },

                        cuentaPagar: true

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

        const empresaId =
            usuario.empresaId;

        const compra =
            await this.obtenerCompra(
                id,
                empresaId
            );

        if (
            compra.estado !==
            EstadoCompra.BORRADOR
        ) {

            throw new AppError(
                'Solo se pueden aprobar compras en estado BORRADOR.',
                400
            );
        }

        const configuracion =
            await prisma.configuracion.findUnique({

                where: {
                    empresaId
                },

                select: {
                    aprobarCompras: true
                }

            });

        /*
         * Si la configuración exige aprobación,
         * este endpoint representa precisamente
         * la aprobación.
         *
         * Si no la exige, igualmente se permite
         * aprobar manualmente.
         */

        return prisma.$transaction(
            async tx => {

                const compraActualizada =
                    await tx.compra.update({

                        where: {

                            id:
                                compra.id

                        },

                        data: {

                            estado:
                                EstadoCompra.APROBADA

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

                            },

                            cuentaPagar: true

                        }

                    });

                /*
                 * Una compra aprobada genera
                 * la cuenta por pagar.
                 */

                if (!compraActualizada.cuentaPagar) {

                    const numeroCuenta =
                        await this.generarNumeroCuentaPagar(
                            empresaId,
                            tx
                        );

                    const fechaVencimiento =
                        compraActualizada.proveedor.diasCredito > 0
                            ? new Date(
                                Date.now() +
                                compraActualizada.proveedor.diasCredito *
                                24 *
                                60 *
                                60 *
                                1000
                            )
                            : null;

                    await tx.cuentaPagar.create({

                        data: {

                            numero:
                                numeroCuenta,

                            proveedor: {

                                connect: {

                                    id:
                                        compraActualizada.proveedorId

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
                                        compraActualizada.id

                                }

                            },

                            estado:
                                'PENDIENTE',

                            total:
                                compraActualizada.total,

                            saldo:
                                compraActualizada.total,

                            fechaVencimiento,

                            observacion:
                                `Cuenta generada por compra ${compraActualizada.numero}`

                        }

                    });
                }

                return tx.compra.findUnique({

                    where: {

                        id:
                            compraActualizada.id

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

                        },

                        cuentaPagar: true

                    }

                });
            }
        );
    }


    /*=====================================================
    ======================== ANULAR ======================
    =====================================================*/

    async anular(
        id: string,
        usuario: Express.UserPayload
    ) {

        const compra =
            await this.obtenerCompra(
                id,
                usuario.empresaId
            );

        if (
            compra.estado ===
            EstadoCompra.ANULADA
        ) {

            throw new AppError(
                'La compra ya está anulada.',
                400
            );
        }

        if (
            compra.estado ===
            EstadoCompra.APROBADA
        ) {

            throw new AppError(
                'Una compra aprobada no puede anularse directamente. Debe realizarse el proceso de devolución correspondiente.',
                400
            );
        }

        return prisma.compra.update({

            where: {

                id:
                    compra.id

            },

            data: {

                estado:
                    EstadoCompra.ANULADA

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

                },

                cuentaPagar: true

            }

        });
    }
}