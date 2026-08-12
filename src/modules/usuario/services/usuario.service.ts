import { Prisma, TipoAuditoria } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../../config/prisma';
import { CrearUsuarioDto, ActualizarUsuarioDto } from '../dto/usuario.dto';
import { AppError } from '../../../utils/AppError';
import { paginatedResponse } from '../../../utils/paginatedResponse';
import { buildQuery } from '../../../utils/query';
import { buildSearch } from '../../../utils/search';

export class UsuarioService {
    private async obtenerUsuario(id: string, user: Express.UserPayload) {
        const usuario = await prisma.usuario.findFirst({
            where: user.rol === 'Super Administrador'
                ? { id }
                : {
                    id,
                    empresaId: user.empresaId
                }
        });

        if (!usuario) {
            throw new AppError('El usuario no existe.', 404);
        }

        return usuario;
    }

    private async validarEmpresa(empresaId: string) {
        const empresa = await prisma.empresa.findUnique({
            where: { id: empresaId }
        });

        if (!empresa) {
            throw new AppError('La empresa no existe.', 404);
        }

        if (!empresa.activo) {
            throw new AppError('La empresa se encuentra inactiva.', 400);
        }

        return empresa;
    }

    private async validarRol(rolId: string, empresaId: string) {
        const rol = await prisma.rol.findFirst({
            where: {
                id: rolId,
                empresaId,
                activo: true
            }
        });

        if (!rol) {
            throw new AppError(
                'El rol no existe, no pertenece a la empresa o está inactivo.',
                400
            );
        }

        return rol;
    }

    private async validarEmail(
        email: string,
        empresaId: string,
        excluirId?: string
    ) {
        const existe = await prisma.usuario.findFirst({
            where: {
                empresaId,
                email: {
                    equals: email.trim().toLowerCase(),
                    mode: 'insensitive'
                },
                ...(excluirId ? { NOT: { id: excluirId } } : {})
            }
        });

        if (existe) {
            throw new AppError(
                'Ya existe un usuario con ese correo.',
                409
            );
        }
    }

    async obtenerTodos(
        user: Express.UserPayload,
        query: any
    ) {
        const { page, limit, skip, take, search } = buildQuery(query);

        const where: Prisma.UsuarioWhereInput = {
            ...(user.rol === 'Super Administrador'
                ? {}
                : {
                    empresaId: user.empresaId
                }),
            ...(query.activo !== undefined && {
                activo:
                    query.activo === true ||
                    query.activo === 'true'
            }),
            ...buildSearch(search, [
                'nombres',
                'apellidos',
                'email'
            ])
        };

        const [usuarios, total] = await prisma.$transaction([
            prisma.usuario.findMany({
                where,
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    nombres: true,
                    apellidos: true,
                    email: true,
                    activo: true,
                    createdAt: true,
                    updatedAt: true,
                    empresa: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    },
                    rol: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    }
                }
            }),
            prisma.usuario.count({
                where
            })
        ]);

        return paginatedResponse(
            usuarios,
            total,
            page,
            limit
        );
    }

    async obtenerPorId(
        id: string,
        user: Express.UserPayload
    ) {
        const usuario = await prisma.usuario.findFirst({
            where: user.rol === 'Super Administrador'
                ? { id }
                : {
                    id,
                    empresaId: user.empresaId
                },
            select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true,
                activo: true,
                createdAt: true,
                updatedAt: true,
                empresa: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                rol: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });

        if (!usuario) {
            throw new AppError(
                'El usuario no existe.',
                404
            );
        }

        return usuario;
    }

    async crear(
        data: CrearUsuarioDto,
        user: Express.UserPayload,
        meta?: {
            ip?: string;
            userAgent?: string;
        }
    ) {
        const empresaId =
            user.rol === 'Super Administrador'
                ? data.empresaId
                : user.empresaId;

        await this.validarEmpresa(empresaId);

        await this.validarRol(
            data.rolId,
            empresaId
        );

        const email =
            data.email.trim().toLowerCase();

        await this.validarEmail(
            email,
            empresaId
        );

        const password =
            await bcrypt.hash(
                data.password,
                12
            );

        return await prisma.$transaction(
            async tx => {
                const usuario =
                    await tx.usuario.create({
                        data: {
                            nombres:
                                data.nombres.trim(),
                            apellidos:
                                data.apellidos.trim(),
                            email,
                            password,
                            activo:
                                data.activo ?? true,
                            empresaId,
                            rolId:
                                data.rolId
                        },
                        select: {
                            id: true,
                            nombres: true,
                            apellidos: true,
                            email: true,
                            activo: true,
                            empresa: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            },
                            rol: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            }
                        }
                    });

                await tx.auditoria.create({
                    data: {
                        empresaId,
                        usuarioId: user.id,
                        modulo: 'USUARIOS',
                        accion: TipoAuditoria.CREATE,
                        descripcion:
                            `Se creó el usuario ${usuario.email}.`,
                        registroId: usuario.id,
                        ip: meta?.ip,
                        userAgent: meta?.userAgent
                    }
                });

                return usuario;
            }
        );
    }

    async actualizar(
        id: string,
        data: ActualizarUsuarioDto,
        user: Express.UserPayload,
        meta?: {
            ip?: string;
            userAgent?: string;
        }
    ) {
        const usuario =
            await this.obtenerUsuario(
                id,
                user
            );

        const empresaId =
            user.rol === 'Super Administrador'
                ? (
                    data.empresaId ??
                    usuario.empresaId
                )
                : user.empresaId;

        await this.validarEmpresa(
            empresaId
        );

        if (data.rolId) {
            await this.validarRol(
                data.rolId,
                empresaId
            );
        }

        const email =
            data.email !== undefined
                ? data.email.trim().toLowerCase()
                : usuario.email;

        if (
            data.email !== undefined &&
            email !== usuario.email.toLowerCase()
        ) {
            await this.validarEmail(
                email,
                empresaId,
                id
            );
        }

        const datosActualizar: Prisma.UsuarioUpdateInput = {
            ...(data.nombres !== undefined && {
                nombres:
                    data.nombres.trim()
            }),
            ...(data.apellidos !== undefined && {
                apellidos:
                    data.apellidos.trim()
            }),
            ...(data.email !== undefined && {
                email
            }),
            ...(data.activo !== undefined && {
                activo:
                    data.activo
            }),
            ...(data.rolId !== undefined && {
                rol: {
                    connect: {
                        id: data.rolId
                    }
                }
            }),
            ...(user.rol === 'Super Administrador' &&
                data.empresaId !== undefined && {
                    empresa: {
                        connect: {
                            id: data.empresaId
                        }
                    }
                })
        };

        if (
            data.password &&
            data.password.trim()
        ) {
            datosActualizar.password =
                await bcrypt.hash(
                    data.password,
                    12
                );
        }

        return await prisma.$transaction(
            async tx => {
                const actualizado =
                    await tx.usuario.update({
                        where: { id },
                        data: datosActualizar,
                        select: {
                            id: true,
                            nombres: true,
                            apellidos: true,
                            email: true,
                            activo: true,
                            empresa: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            },
                            rol: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            }
                        }
                    });

                await tx.auditoria.create({
                    data: {
                        empresaId,
                        usuarioId: user.id,
                        modulo: 'USUARIOS',
                        accion: TipoAuditoria.UPDATE,
                        descripcion:
                            `Se actualizó el usuario ${actualizado.email}.`,
                        registroId: actualizado.id,
                        ip: meta?.ip,
                        userAgent: meta?.userAgent
                    }
                });

                return actualizado;
            }
        );
    }

    async eliminar(
        id: string,
        user: Express.UserPayload,
        meta?: {
            ip?: string;
            userAgent?: string;
        }
    ) {
        const usuario =
            await this.obtenerUsuario(
                id,
                user
            );

        if (usuario.id === user.id) {
            throw new AppError(
                'No puede desactivar su propio usuario.',
                400
            );
        }

        if (!usuario.activo) {
            throw new AppError(
                'El usuario ya se encuentra inactivo.',
                400
            );
        }

        return await prisma.$transaction(
            async tx => {
                const actualizado =
                    await tx.usuario.update({
                        where: { id },
                        data: {
                            activo: false
                        },
                        select: {
                            id: true,
                            nombres: true,
                            apellidos: true,
                            email: true,
                            activo: true,
                            empresa: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            },
                            rol: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            }
                        }
                    });

                await tx.auditoria.create({
                    data: {
                        empresaId:
                            usuario.empresaId,
                        usuarioId: user.id,
                        modulo: 'USUARIOS',
                        accion: TipoAuditoria.DELETE,
                        descripcion:
                            `Se desactivó el usuario ${usuario.email}.`,
                        registroId: usuario.id,
                        ip: meta?.ip,
                        userAgent: meta?.userAgent
                    }
                });

                return actualizado;
            }
        );
    }

    async reactivar(
        id: string,
        user: Express.UserPayload,
        meta?: {
            ip?: string;
            userAgent?: string;
        }
    ) {
        const usuario =
            await this.obtenerUsuario(
                id,
                user
            );

        if (usuario.activo) {
            throw new AppError(
                'El usuario ya se encuentra activo.',
                400
            );
        }

        return await prisma.$transaction(
            async tx => {
                const actualizado =
                    await tx.usuario.update({
                        where: { id },
                        data: {
                            activo: true
                        },
                        select: {
                            id: true,
                            nombres: true,
                            apellidos: true,
                            email: true,
                            activo: true,
                            empresa: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            },
                            rol: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            }
                        }
                    });

                await tx.auditoria.create({
                    data: {
                        empresaId:
                            usuario.empresaId,
                        usuarioId: user.id,
                        modulo: 'USUARIOS',
                        accion: TipoAuditoria.UPDATE,
                        descripcion:
                            `Se reactivó el usuario ${usuario.email}.`,
                        registroId: usuario.id,
                        ip: meta?.ip,
                        userAgent: meta?.userAgent
                    }
                });

                return actualizado;
            }
        );
    }
}