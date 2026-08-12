import { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearMarcaDto, ActualizarMarcaDto } from '../dto/dto.marca';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { buildSearch } from '../../../utils/search';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class MarcaService {
    private async obtenerMarca(
        id: string,
        usuario: Express.UserPayload
    ) {
        const marca = await prisma.marca.findFirst({
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
        if (!marca) {
            throw new AppError(
                'La marca no existe.',
                404
            );
        }
        return marca;
    }

    private async validarNombre(
        empresaId: string,
        nombre: string,
        excluirId?: string
    ) {
        const existe = await prisma.marca.findFirst({
            where: {
                empresaId,
                nombre: {
                    equals: nombre.trim(),
                    mode: 'insensitive'
                },
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
                'Ya existe una marca con ese nombre.',
                400
            );
        }
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

        const where: Prisma.MarcaWhereInput = {
            empresaId: usuario.empresaId,
            ...(query.estado !== undefined && {
                estado: query.estado === 'true'
            }),
            ...buildSearch(search, [
                'nombre',
                'descripcion'
            ])
        };

        const [marcas, total] =
            await prisma.$transaction([
                prisma.marca.findMany({
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
                prisma.marca.count({
                    where
                })
            ]);

        return paginatedResponse(
            marcas,
            total,
            page,
            limit
        );
    }

    async obtenerPorId(
        id: string,
        usuario: Express.UserPayload
    ) {
        return this.obtenerMarca(
            id,
            usuario
        );
    }

    async crear(
        data: CrearMarcaDto,
        usuario: Express.UserPayload
    ) {
        const empresaId = usuario.empresaId;

        await this.validarNombre(
            empresaId,
            data.nombre
        );

        return await prisma.marca.create({
            data: {
                nombre: data.nombre.trim(),
                descripcion: data.descripcion?.trim(),
                estado: data.estado ?? true,
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
        data: ActualizarMarcaDto,
        usuario: Express.UserPayload
    ) {
        const marca = await this.obtenerMarca(
            id,
            usuario
        );

        if (data.nombre !== undefined) {
            await this.validarNombre(
                usuario.empresaId,
                data.nombre,
                marca.id
            );
        }

        return await prisma.marca.update({
            where: {
                id: marca.id
            },
            data: {
                ...(data.nombre !== undefined && {
                    nombre: data.nombre.trim()
                }),
                ...(data.descripcion !== undefined && {
                    descripcion: data.descripcion?.trim()
                }),
                ...(data.estado !== undefined && {
                    estado: data.estado
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
        const marca = await this.obtenerMarca(
            id,
            usuario
        );

        if (!marca.estado) {
            throw new AppError(
                'La marca ya está desactivada.',
                400
            );
        }

        return await prisma.marca.update({
            where: {
                id: marca.id
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
        const marca = await this.obtenerMarca(
            id,
            usuario
        );

        if (marca.estado) {
            throw new AppError(
                'La marca ya se encuentra activa.',
                400
            );
        }

        return await prisma.marca.update({
            where: {
                id: marca.id
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