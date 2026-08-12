import { Prisma, TipoNotificacion } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearNotificacionDto, ActualizarNotificacionDto, ConsultarNotificacionesDto } from '../dto/notificacion.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class NotificacionService {
    async crear(data: CrearNotificacionDto) {
        if (data.usuarioId) {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: data.usuarioId
                },
                select: {
                    id: true
                }
            });
            if (!usuario) {
                throw new AppError('El usuario no existe.', 404);
            }
        }
        return prisma.notificacion.create({
            data: {
                titulo: data.titulo,
                mensaje: data.mensaje,
                tipo: data.tipo as TipoNotificacion,
                usuarioId: data.usuarioId ?? null
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombres: true,
                        apellidos: true,
                        email: true
                    }
                }
            }
        });
    }
    async obtenerPorId(id: string) {
        const notificacion = await prisma.notificacion.findUnique({
            where: {
                id
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombres: true,
                        apellidos: true,
                        email: true
                    }
                }
            }
        });
        if (!notificacion) {
            throw new AppError('La notificación no existe.', 404);
        }
        return notificacion;
    }
    async obtenerTodos(query: ConsultarNotificacionesDto) {
        const { page, limit, skip, take, orderBy } = buildQuery(query);
        const where: Prisma.NotificacionWhereInput = {
            ...(query.usuarioId ? {
                usuarioId: query.usuarioId
            } : {}),
            ...(query.tipo ? {
                tipo: query.tipo as TipoNotificacion
            } : {}),
            ...(query.leida !== undefined ? {
                leida: query.leida
            } : {})
        };
        const [notificaciones, total] = await prisma.$transaction([
            prisma.notificacion.findMany({
                where,
                skip,
                take,
                orderBy: orderBy ?? {
                    createdAt: 'desc'
                },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nombres: true,
                            apellidos: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.notificacion.count({
                where
            })
        ]);
        return paginatedResponse(notificaciones, total, page, limit);
    }
    async obtenerPorUsuario(usuarioId: string, query: ConsultarNotificacionesDto) {
        const { page, limit, skip, take } = buildQuery(query);
        const where: Prisma.NotificacionWhereInput = {
            usuarioId,
            ...(query.tipo ? {
                tipo: query.tipo as TipoNotificacion
            } : {}),
            ...(query.leida !== undefined ? {
                leida: query.leida
            } : {})
        };
        const [notificaciones, total] = await prisma.$transaction([
            prisma.notificacion.findMany({
                where,
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.notificacion.count({
                where
            })
        ]);
        return paginatedResponse(notificaciones, total, page, limit);
    }
    async actualizar(id: string, data: ActualizarNotificacionDto) {
        const notificacion = await prisma.notificacion.findUnique({
            where: {
                id
            }
        });
        if (!notificacion) {
            throw new AppError('La notificación no existe.', 404);
        }
        return prisma.notificacion.update({
            where: {
                id
            },
            data: {
                ...(data.titulo !== undefined && {
                    titulo: data.titulo
                }),
                ...(data.mensaje !== undefined && {
                    mensaje: data.mensaje
                }),
                ...(data.tipo !== undefined && {
                    tipo: data.tipo as TipoNotificacion
                }),
                ...(data.leida !== undefined && {
                    leida: data.leida
                })
            }
        });
    }
    async marcarLeida(id: string) {
        const notificacion = await prisma.notificacion.findUnique({
            where: {
                id
            },
            select: {
                id: true
            }
        });
        if (!notificacion) {
            throw new AppError('La notificación no existe.', 404);
        }
        return prisma.notificacion.update({
            where: {
                id
            },
            data: {
                leida: true
            }
        });
    }
    async marcarTodasLeidas(usuarioId: string) {
        const resultado = await prisma.notificacion.updateMany({
            where: {
                usuarioId,
                leida: false
            },
            data: {
                leida: true
            }
        });
        return {
            actualizadas: resultado.count
        };
    }
    async eliminar(id: string) {
        const notificacion = await prisma.notificacion.findUnique({
            where: {
                id
            },
            select: {
                id: true
            }
        });
        if (!notificacion) {
            throw new AppError('La notificación no existe.', 404);
        }
        await prisma.notificacion.delete({
            where: {
                id
            }
        });
        return null;
    }
}
export const notificacionService = new NotificacionService();