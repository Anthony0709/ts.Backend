import { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearClienteDto, ActualizarClienteDto } from '../dto/cliente.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class ClienteService {
    private async obtenerCliente(
        id: string,
        usuario: Express.UserPayload
    ) {
        const cliente = await prisma.cliente.findFirst({
            where: {
                id,
                empresaId: usuario.empresaId
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
        if (!cliente) {
            throw new AppError(
                'El cliente no existe.',
                404
            );
        }
        return cliente;
    }

    private async validarIdentificacion(
        empresaId: string,
        identificacion: string,
        excluirId?: string
    ) {
        const existe = await prisma.cliente.findFirst({
            where: {
                empresaId,
                identificacion: identificacion.trim(),
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
                'La identificación ya está registrada para esta empresa.',
                400
            );
        }
    }

    private normalizarEmail(
        email?: string
    ) {
        if (!email) {
            return undefined;
        }
        const valor = email.trim().toLowerCase();
        return valor || undefined;
    }

    private validarDatosCredito(
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
    ): Prisma.ClienteWhereInput {
        if (!search) {
            return {};
        }

        return {
            OR: [
                {
                    nombre: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    apellido: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    identificacion: {
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
                    razonSocial: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    nombreComercial: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    telefono: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        };
    }

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

        const where: Prisma.ClienteWhereInput = {
            empresaId: usuario.empresaId,
            ...(query.estado !== undefined && {
                estado: query.estado === 'true'
            }),
            ...(query.tipoCliente && {
                tipoCliente: query.tipoCliente
            }),
            ...(query.tipoIdentificacion && {
                tipoIdentificacion:
                    query.tipoIdentificacion
            }),
            ...this.construirBusqueda(search)
        };

        const [clientes, total] =
            await prisma.$transaction([
                prisma.cliente.findMany({
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
                prisma.cliente.count({
                    where
                })
            ]);

        return paginatedResponse(
            clientes,
            total,
            page,
            limit
        );
    }

    async obtenerPorId(
        id: string,
        usuario: Express.UserPayload
    ) {
        return this.obtenerCliente(
            id,
            usuario
        );
    }

    async crear(
        data: CrearClienteDto,
        usuario: Express.UserPayload
    ) {
        const empresaId = usuario.empresaId;

        await this.validarIdentificacion(
            empresaId,
            data.identificacion
        );

        this.validarDatosCredito(
            data.limiteCredito,
            data.diasCredito
        );

        return await prisma.cliente.create({
            data: {
                nombre: data.nombre.trim(),
                apellido: data.apellido.trim(),
                tipoIdentificacion:
                    data.tipoIdentificacion,
                identificacion:
                    data.identificacion.trim(),
                tipoCliente:
                    data.tipoCliente ?? 'PERSONA',
                razonSocial:
                    data.razonSocial?.trim(),
                nombreComercial:
                    data.nombreComercial?.trim(),
                email:
                    this.normalizarEmail(data.email),
                telefono:
                    data.telefono?.trim(),
                direccion:
                    data.direccion?.trim(),
                limiteCredito:
                    data.limiteCredito,
                diasCredito:
                    data.diasCredito,
                observacion:
                    data.observacion?.trim(),
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

    async actualizar(
        id: string,
        data: ActualizarClienteDto,
        usuario: Express.UserPayload
    ) {
        const cliente =
            await this.obtenerCliente(
                id,
                usuario
            );

        if (
            data.identificacion !== undefined
        ) {
            await this.validarIdentificacion(
                usuario.empresaId,
                data.identificacion,
                cliente.id
            );
        }

        this.validarDatosCredito(
            data.limiteCredito,
            data.diasCredito
        );

        return await prisma.cliente.update({
            where: {
                id: cliente.id
            },
            data: {
                ...(data.nombre !== undefined && {
                    nombre: data.nombre.trim()
                }),
                ...(data.apellido !== undefined && {
                    apellido: data.apellido.trim()
                }),
                ...(data.tipoIdentificacion !== undefined && {
                    tipoIdentificacion:
                        data.tipoIdentificacion
                }),
                ...(data.identificacion !== undefined && {
                    identificacion:
                        data.identificacion.trim()
                }),
                ...(data.tipoCliente !== undefined && {
                    tipoCliente:
                        data.tipoCliente
                }),
                ...(data.razonSocial !== undefined && {
                    razonSocial:
                        data.razonSocial?.trim()
                }),
                ...(data.nombreComercial !== undefined && {
                    nombreComercial:
                        data.nombreComercial?.trim()
                }),
                ...(data.email !== undefined && {
                    email:
                        this.normalizarEmail(data.email)
                }),
                ...(data.telefono !== undefined && {
                    telefono:
                        data.telefono?.trim()
                }),
                ...(data.direccion !== undefined && {
                    direccion:
                        data.direccion?.trim()
                }),
                ...(data.limiteCredito !== undefined && {
                    limiteCredito:
                        data.limiteCredito
                }),
                ...(data.diasCredito !== undefined && {
                    diasCredito:
                        data.diasCredito
                }),
                ...(data.observacion !== undefined && {
                    observacion:
                        data.observacion?.trim()
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

    async eliminar(
        id: string,
        usuario: Express.UserPayload
    ) {
        const cliente =
            await this.obtenerCliente(
                id,
                usuario
            );

        if (!cliente.estado) {
            throw new AppError(
                'El cliente ya está desactivado.',
                400
            );
        }

        return await prisma.cliente.update({
            where: {
                id: cliente.id
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

    async reactivar(
        id: string,
        usuario: Express.UserPayload
    ) {
        const cliente =
            await this.obtenerCliente(
                id,
                usuario
            );

        if (cliente.estado) {
            throw new AppError(
                'El cliente ya se encuentra activo.',
                400
            );
        }

        return await prisma.cliente.update({
            where: {
                id: cliente.id
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