import { Prisma, TipoAuditoria } from '@prisma/client';
import prisma from '../../../config/prisma';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';
import { buildSearch } from '../../../utils/search';
import { AuditoriaQueryDto } from '../dto/auditoria.dto';

export class AuditoriaService {
    async registrar(data: {
        empresaId?: string;
        usuarioId?: string;
        modulo: string;
        accion: TipoAuditoria;
        descripcion: string;
        registroId?: string;
        ip?: string;
        userAgent?: string;
    }) {
        return await prisma.auditoria.create({
            data: {
                empresaId: data.empresaId,
                usuarioId: data.usuarioId,
                modulo: data.modulo,
                accion: data.accion,
                descripcion: data.descripcion,
                registroId: data.registroId,
                ip: data.ip,
                userAgent: data.userAgent
            }
        });
    }

    async obtenerTodos(
        usuario: Express.UserPayload,
        query: AuditoriaQueryDto
    ) {
        const { page, limit, skip, take, search, orderBy } =
            buildQuery(query);

        const where: Prisma.AuditoriaWhereInput = {
            empresaId: usuario.empresaId,
            ...(query.usuarioId && {
                usuarioId: query.usuarioId
            }),
            ...(query.modulo && {
                modulo: {
                    equals: query.modulo,
                    mode: 'insensitive'
                }
            }),
            ...(query.accion && {
                accion: query.accion
            }),
            ...(query.registroId && {
                registroId: query.registroId
            }),
            ...(query.fechaDesde || query.fechaHasta
                ? {
                    createdAt: {
                        ...(query.fechaDesde && {
                            gte: query.fechaDesde
                        }),
                        ...(query.fechaHasta && {
                            lte: query.fechaHasta
                        })
                    }
                }
                : {}),
            ...buildSearch(search, [
                'modulo',
                'descripcion',
                'registroId',
                'ip'
            ])
        };

        const [auditorias, total] =
            await prisma.$transaction([
                prisma.auditoria.findMany({
                    where,
                    skip,
                    take,
                    orderBy,
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nombres: true,
                                apellidos: true,
                                email: true
                            }
                        },
                        empresa: {
                            select: {
                                id: true,
                                nombre: true
                            }
                        }
                    }
                }),
                prisma.auditoria.count({
                    where
                })
            ]);

        return paginatedResponse(
            auditorias,
            total,
            page,
            limit
        );
    }

    async obtenerPorId(
        id: string,
        usuario: Express.UserPayload
    ) {
        const auditoria =
            await prisma.auditoria.findFirst({
                where: {
                    id,
                    empresaId: usuario.empresaId
                },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nombres: true,
                            apellidos: true,
                            email: true
                        }
                    },
                    empresa: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    }
                }
            });

        if (!auditoria) {
            throw new AppError(
                'Registro de auditoría no encontrado.',
                404
            );
        }

        return auditoria;
    }
}