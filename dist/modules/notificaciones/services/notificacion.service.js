"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificacionService = exports.NotificacionService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class NotificacionService {
    async crear(data) {
        if (data.usuarioId) {
            const usuario = await prisma_1.default.usuario.findUnique({
                where: {
                    id: data.usuarioId
                },
                select: {
                    id: true
                }
            });
            if (!usuario) {
                throw new AppError_1.AppError('El usuario no existe.', 404);
            }
        }
        return prisma_1.default.notificacion.create({
            data: {
                titulo: data.titulo,
                mensaje: data.mensaje,
                tipo: data.tipo,
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
    async obtenerPorId(id) {
        const notificacion = await prisma_1.default.notificacion.findUnique({
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
            throw new AppError_1.AppError('La notificación no existe.', 404);
        }
        return notificacion;
    }
    async obtenerTodos(query) {
        const { page, limit, skip, take, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
            ...(query.usuarioId ? {
                usuarioId: query.usuarioId
            } : {}),
            ...(query.tipo ? {
                tipo: query.tipo
            } : {}),
            ...(query.leida !== undefined ? {
                leida: query.leida
            } : {})
        };
        const [notificaciones, total] = await prisma_1.default.$transaction([
            prisma_1.default.notificacion.findMany({
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
            prisma_1.default.notificacion.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(notificaciones, total, page, limit);
    }
    async obtenerPorUsuario(usuarioId, query) {
        const { page, limit, skip, take } = (0, query_1.buildQuery)(query);
        const where = {
            usuarioId,
            ...(query.tipo ? {
                tipo: query.tipo
            } : {}),
            ...(query.leida !== undefined ? {
                leida: query.leida
            } : {})
        };
        const [notificaciones, total] = await prisma_1.default.$transaction([
            prisma_1.default.notificacion.findMany({
                where,
                skip,
                take,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma_1.default.notificacion.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(notificaciones, total, page, limit);
    }
    async actualizar(id, data) {
        const notificacion = await prisma_1.default.notificacion.findUnique({
            where: {
                id
            }
        });
        if (!notificacion) {
            throw new AppError_1.AppError('La notificación no existe.', 404);
        }
        return prisma_1.default.notificacion.update({
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
                    tipo: data.tipo
                }),
                ...(data.leida !== undefined && {
                    leida: data.leida
                })
            }
        });
    }
    async marcarLeida(id) {
        const notificacion = await prisma_1.default.notificacion.findUnique({
            where: {
                id
            },
            select: {
                id: true
            }
        });
        if (!notificacion) {
            throw new AppError_1.AppError('La notificación no existe.', 404);
        }
        return prisma_1.default.notificacion.update({
            where: {
                id
            },
            data: {
                leida: true
            }
        });
    }
    async marcarTodasLeidas(usuarioId) {
        const resultado = await prisma_1.default.notificacion.updateMany({
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
    async eliminar(id) {
        const notificacion = await prisma_1.default.notificacion.findUnique({
            where: {
                id
            },
            select: {
                id: true
            }
        });
        if (!notificacion) {
            throw new AppError_1.AppError('La notificación no existe.', 404);
        }
        await prisma_1.default.notificacion.delete({
            where: {
                id
            }
        });
        return null;
    }
}
exports.NotificacionService = NotificacionService;
exports.notificacionService = new NotificacionService();
