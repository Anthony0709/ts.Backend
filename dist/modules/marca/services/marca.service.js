"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcaService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const search_1 = require("../../../utils/search");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class MarcaService {
    async obtenerMarca(id, usuario) {
        const marca = await prisma_1.default.marca.findFirst({
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
            throw new AppError_1.AppError('La marca no existe.', 404);
        }
        return marca;
    }
    async validarNombre(empresaId, nombre, excluirId) {
        const existe = await prisma_1.default.marca.findFirst({
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
            throw new AppError_1.AppError('Ya existe una marca con ese nombre.', 400);
        }
    }
    async obtenerTodos(usuario, query) {
        const { page, limit, skip, take, search, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
            empresaId: usuario.empresaId,
            ...(query.estado !== undefined && {
                estado: query.estado === 'true'
            }),
            ...(0, search_1.buildSearch)(search, [
                'nombre',
                'descripcion'
            ])
        };
        const [marcas, total] = await prisma_1.default.$transaction([
            prisma_1.default.marca.findMany({
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
            prisma_1.default.marca.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(marcas, total, page, limit);
    }
    async obtenerPorId(id, usuario) {
        return this.obtenerMarca(id, usuario);
    }
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        await this.validarNombre(empresaId, data.nombre);
        return await prisma_1.default.marca.create({
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
    async actualizar(id, data, usuario) {
        const marca = await this.obtenerMarca(id, usuario);
        if (data.nombre !== undefined) {
            await this.validarNombre(usuario.empresaId, data.nombre, marca.id);
        }
        return await prisma_1.default.marca.update({
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
    async eliminar(id, usuario) {
        const marca = await this.obtenerMarca(id, usuario);
        if (!marca.estado) {
            throw new AppError_1.AppError('La marca ya está desactivada.', 400);
        }
        return await prisma_1.default.marca.update({
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
    async reactivar(id, usuario) {
        const marca = await this.obtenerMarca(id, usuario);
        if (marca.estado) {
            throw new AppError_1.AppError('La marca ya se encuentra activa.', 400);
        }
        return await prisma_1.default.marca.update({
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
exports.MarcaService = MarcaService;
