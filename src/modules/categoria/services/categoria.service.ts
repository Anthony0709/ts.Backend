import { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearCategoriaDto, ActualizarCategoriaDto } from '../dto/categoria.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { buildSearch } from '../../../utils/search';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class CategoriaService {
    private async validarEmpresa(empresaId: string) {
        const empresa = await prisma.empresa.findUnique({
            where: { id: empresaId },
            select: { id: true }
        });
        if (!empresa) {
            throw new AppError('La empresa no existe.', 404);
        }
        return empresa;
    }

    private async obtenerCategoria(
        id: string,
        usuario: Express.UserPayload
    ) {
        const categoria = await prisma.categoria.findFirst({
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
        if (!categoria) {
            throw new AppError(
                'La categoría no existe.',
                404
            );
        }
        return categoria;
    }

    private async validarNombre(
        empresaId: string,
        nombre: string,
        excluirId?: string
    ) {
        const existe = await prisma.categoria.findFirst({
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
                'Ya existe una categoría con ese nombre.',
                400
            );
        }
    }

    private async generarCodigo(
        empresaId: string
    ): Promise<string> {
        for (let intento = 0; intento < 20; intento++) {
            const codigo = Math.floor(
                1000 + Math.random() * 9000
            ).toString();

            const existe = await prisma.categoria.findFirst({
                where: {
                    empresaId,
                    codigo
                },
                select: {
                    id: true
                }
            });

            if (!existe) {
                return codigo;
            }
        }

        throw new AppError(
            'No fue posible generar un código único para la categoría.',
            500
        );
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

        const where: Prisma.CategoriaWhereInput = {
            empresaId: usuario.empresaId,
            ...(query.estado !== undefined && {
                estado: query.estado === 'true'
            }),
            ...buildSearch(search, [
                'nombre',
                'codigo',
                'descripcion'
            ])
        };

        const [categorias, total] =
            await prisma.$transaction([
                prisma.categoria.findMany({
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
                prisma.categoria.count({
                    where
                })
            ]);

        return paginatedResponse(
            categorias,
            total,
            page,
            limit
        );
    }

    async obtenerPorId(
        id: string,
        usuario: Express.UserPayload
    ) {
        return this.obtenerCategoria(
            id,
            usuario
        );
    }

    async crear(
        data: CrearCategoriaDto,
        usuario: Express.UserPayload
    ) {
        const empresaId = usuario.empresaId;

        await this.validarEmpresa(
            empresaId
        );

        await this.validarNombre(
            empresaId,
            data.nombre
        );

        const codigo =
            await this.generarCodigo(
                empresaId
            );

        return await prisma.categoria.create({
            data: {
                nombre: data.nombre.trim(),
                descripcion: data.descripcion?.trim(),
                codigo,
                color: data.color?.trim(),
                icono: data.icono?.trim(),
                orden: data.orden ?? 0,
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
        data: ActualizarCategoriaDto,
        usuario: Express.UserPayload
    ) {
        const categoria =
            await this.obtenerCategoria(
                id,
                usuario
            );

        if (data.nombre !== undefined) {
            await this.validarNombre(
                usuario.empresaId,
                data.nombre,
                id
            );
        }

        return await prisma.categoria.update({
            where: {
                id: categoria.id
            },
            data: {
                ...(data.nombre !== undefined && {
                    nombre: data.nombre.trim()
                }),
                ...(data.descripcion !== undefined && {
                    descripcion: data.descripcion?.trim()
                }),
                ...(data.color !== undefined && {
                    color: data.color?.trim()
                }),
                ...(data.icono !== undefined && {
                    icono: data.icono?.trim()
                }),
                ...(data.orden !== undefined && {
                    orden: data.orden
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
        const categoria =
            await this.obtenerCategoria(
                id,
                usuario
            );

        if (!categoria.estado) {
            throw new AppError(
                'La categoría ya está desactivada.',
                400
            );
        }

        return await prisma.categoria.update({
            where: {
                id: categoria.id
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
        const categoria =
            await this.obtenerCategoria(
                id,
                usuario
            );

        if (categoria.estado) {
            throw new AppError(
                'La categoría ya se encuentra activa.',
                400
            );
        }

        return await prisma.categoria.update({
            where: {
                id: categoria.id
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