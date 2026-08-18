"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditoriaService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
const search_1 = require("../../../utils/search");
class AuditoriaService {
    async registrar(data) {
        return await prisma_1.default.auditoria.create({
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
    async obtenerTodos(usuario, query) {
        const { page, limit, skip, take, search, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
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
            ...(0, search_1.buildSearch)(search, [
                'modulo',
                'descripcion',
                'registroId',
                'ip'
            ])
        };
        const [auditorias, total] = await prisma_1.default.$transaction([
            prisma_1.default.auditoria.findMany({
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
            prisma_1.default.auditoria.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(auditorias, total, page, limit);
    }
    async obtenerPorId(id, usuario) {
        const auditoria = await prisma_1.default.auditoria.findFirst({
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
            throw new AppError_1.AppError('Registro de auditoría no encontrado.', 404);
        }
        return auditoria;
    }
}
exports.AuditoriaService = AuditoriaService;
