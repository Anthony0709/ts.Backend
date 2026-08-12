import { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';

import {
    CrearProveedorDto,
    ActualizarProveedorDto
} from '../dto/proveedor.dto';

import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class ProveedorService {

    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/

    private async obtenerProveedor(
        id: string,
        empresaId: string
    ) {

        const proveedor =
            await prisma.proveedor.findFirst({

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
                    }
                }

            });

        if (!proveedor) {

            throw new AppError(
                'El proveedor no existe.',
                404
            );

        }

        return proveedor;
    }

    private normalizarEmail(
        email?: string
    ) {

        if (!email) {
            return undefined;
        }

        const valor =
            email.trim().toLowerCase();

        return valor || undefined;
    }

    private async validarRuc(
        ruc: string,
        empresaId: string,
        excluirId?: string
    ) {

        const existe =
            await prisma.proveedor.findFirst({

                where: {

                    empresaId,

                    ruc: ruc.trim(),

                    ...(excluirId && {
                        NOT: {
                            id: excluirId
                        }
                    })

                },

                select: {
                    id: true
                }

            });

        if (existe) {

            throw new AppError(
                'El RUC ya está registrado para esta empresa.',
                400
            );

        }
    }

    private validarCredito(
        limiteCredito?: number,
        diasCredito?: number
    ) {

        if (
            limiteCredito !== undefined &&
            limiteCredito < 0
        ) {

            throw new AppError(
                'El límite de crédito no puede ser negativo.',
                400
            );

        }

        if (
            diasCredito !== undefined &&
            diasCredito < 0
        ) {

            throw new AppError(
                'Los días de crédito no pueden ser negativos.',
                400
            );

        }
    }

    private construirBusqueda(
        search: string
    ): Prisma.ProveedorWhereInput {

        if (!search) {
            return {};
        }

        return {

            OR: [

                {
                    nombreComercial: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },

                {
                    razonSocial: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },

                {
                    ruc: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },

                {
                    contacto: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },

                {
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },

                {
                    telefono: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },

                {
                    celular: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }

            ]

        };
    }

    /*=====================================================
    ====================== LISTAR ========================
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
            Prisma.ProveedorWhereInput = {

            empresaId:
                usuario.empresaId,

            ...(query.estado !== undefined && {
                estado:
                    query.estado === 'true'
            }),

            ...this.construirBusqueda(
                search
            )

        };

        const [
            proveedores,
            total
        ] = await prisma.$transaction([

            prisma.proveedor.findMany({

                where,

                skip,

                take,

                orderBy,

                include: {

                    empresa: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    }

                }

            }),

            prisma.proveedor.count({
                where
            })

        ]);

        return paginatedResponse(
            proveedores,
            total,
            page,
            limit
        );
    }

    /*=====================================================
    ==================== OBTENER POR ID ==================
    =====================================================*/

    async obtenerPorId(
        id: string,
        usuario: Express.UserPayload
    ) {

        return this.obtenerProveedor(
            id,
            usuario.empresaId
        );
    }

    /*=====================================================
    ======================== CREAR =======================
    =====================================================*/

    async crear(
        data: CrearProveedorDto,
        usuario: Express.UserPayload
    ) {

        const empresaId =
            usuario.empresaId;

        await this.validarRuc(
            data.ruc,
            empresaId
        );

        this.validarCredito(
            data.limiteCredito,
            data.diasCredito
        );

        return prisma.proveedor.create({

            data: {

                nombreComercial:
                    data.nombreComercial.trim(),

                razonSocial:
                    data.razonSocial.trim(),

                ruc:
                    data.ruc.trim(),

                contacto:
                    data.contacto?.trim(),

                cargoContacto:
                    data.cargoContacto?.trim(),

                email:
                    this.normalizarEmail(
                        data.email
                    ),

                telefono:
                    data.telefono?.trim(),

                celular:
                    data.celular?.trim(),

                direccion:
                    data.direccion?.trim(),

                ciudad:
                    data.ciudad?.trim(),

                provincia:
                    data.provincia?.trim(),

                pais:
                    data.pais?.trim() || 'Ecuador',

                observaciones:
                    data.observaciones?.trim(),

                diasCredito:
                    data.diasCredito ?? 0,

                limiteCredito:
                    data.limiteCredito,

                estado:
                    data.estado ?? true,

                empresaId

            },

            include: {

                empresa: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }

            }

        });
    }

    /*=====================================================
    ====================== ACTUALIZAR ====================
    =====================================================*/

    async actualizar(
        id: string,
        data: ActualizarProveedorDto,
        usuario: Express.UserPayload
    ) {

        const proveedor =
            await this.obtenerProveedor(
                id,
                usuario.empresaId
            );

        if (
            data.ruc !== undefined
        ) {

            await this.validarRuc(
                data.ruc,
                usuario.empresaId,
                proveedor.id
            );

        }

        this.validarCredito(
            data.limiteCredito,
            data.diasCredito
        );

        return prisma.proveedor.update({

            where: {
                id: proveedor.id
            },

            data: {

                ...(data.nombreComercial !== undefined && {
                    nombreComercial:
                        data.nombreComercial.trim()
                }),

                ...(data.razonSocial !== undefined && {
                    razonSocial:
                        data.razonSocial.trim()
                }),

                ...(data.ruc !== undefined && {
                    ruc:
                        data.ruc.trim()
                }),

                ...(data.contacto !== undefined && {
                    contacto:
                        data.contacto?.trim()
                }),

                ...(data.cargoContacto !== undefined && {
                    cargoContacto:
                        data.cargoContacto?.trim()
                }),

                ...(data.email !== undefined && {
                    email:
                        this.normalizarEmail(
                            data.email
                        )
                }),

                ...(data.telefono !== undefined && {
                    telefono:
                        data.telefono?.trim()
                }),

                ...(data.celular !== undefined && {
                    celular:
                        data.celular?.trim()
                }),

                ...(data.direccion !== undefined && {
                    direccion:
                        data.direccion?.trim()
                }),

                ...(data.ciudad !== undefined && {
                    ciudad:
                        data.ciudad?.trim()
                }),

                ...(data.provincia !== undefined && {
                    provincia:
                        data.provincia?.trim()
                }),

                ...(data.pais !== undefined && {
                    pais:
                        data.pais?.trim()
                }),

                ...(data.observaciones !== undefined && {
                    observaciones:
                        data.observaciones?.trim()
                }),

                ...(data.diasCredito !== undefined && {
                    diasCredito:
                        data.diasCredito
                }),

                ...(data.limiteCredito !== undefined && {
                    limiteCredito:
                        data.limiteCredito
                }),

                ...(data.estado !== undefined && {
                    estado:
                        data.estado
                })

            },

            include: {

                empresa: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }

            }

        });
    }

    /*=====================================================
    ======================= ELIMINAR =====================
    =====================================================*/

    async eliminar(
        id: string,
        usuario: Express.UserPayload
    ) {

        const proveedor =
            await this.obtenerProveedor(
                id,
                usuario.empresaId
            );

        if (!proveedor.estado) {

            throw new AppError(
                'El proveedor ya está desactivado.',
                400
            );

        }

        return prisma.proveedor.update({

            where: {
                id: proveedor.id
            },

            data: {
                estado: false
            },

            include: {

                empresa: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }

            }

        });
    }

    /*=====================================================
    ====================== REACTIVAR =====================
    =====================================================*/

    async reactivar(
        id: string,
        usuario: Express.UserPayload
    ) {

        const proveedor =
            await this.obtenerProveedor(
                id,
                usuario.empresaId
            );

        if (proveedor.estado) {

            throw new AppError(
                'El proveedor ya se encuentra activo.',
                400
            );

        }

        return prisma.proveedor.update({

            where: {
                id: proveedor.id
            },

            data: {
                estado: true
            },

            include: {

                empresa: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }

            }

        });
    }
}