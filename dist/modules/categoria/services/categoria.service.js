"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const search_1 = require("../../../utils/search");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class CategoriaService {
    async validarEmpresa(empresaId) {
        const empresa = await prisma_1.default.empresa.findUnique({
            where: { id: empresaId },
            select: { id: true }
        });
        if (!empresa) {
            throw new AppError_1.AppError('La empresa no existe.', 404);
        }
        return empresa;
    }
    async obtenerCategoria(id, usuario) {
        const categoria = await prisma_1.default.categoria.findFirst({
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
            throw new AppError_1.AppError('La categoría no existe.', 404);
        }
        return categoria;
    }
    async validarNombre(empresaId, nombre, excluirId) {
        const existe = await prisma_1.default.categoria.findFirst({
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
            throw new AppError_1.AppError('Ya existe una categoría con ese nombre.', 400);
        }
    }
    async generarCodigo(empresaId) {
        for (let intento = 0; intento < 20; intento++) {
            const codigo = Math.floor(1000 + Math.random() * 9000).toString();
            const existe = await prisma_1.default.categoria.findFirst({
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
        throw new AppError_1.AppError('No fue posible generar un código único para la categoría.', 500);
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
                'codigo',
                'descripcion'
            ])
        };
        const [categorias, total] = await prisma_1.default.$transaction([
            prisma_1.default.categoria.findMany({
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
            prisma_1.default.categoria.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(categorias, total, page, limit);
    }
    async obtenerPorId(id, usuario) {
        return this.obtenerCategoria(id, usuario);
    }
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        await this.validarEmpresa(empresaId);
        await this.validarNombre(empresaId, data.nombre);
        const codigo = await this.generarCodigo(empresaId);
        return await prisma_1.default.categoria.create({
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
    async actualizar(id, data, usuario) {
        const categoria = await this.obtenerCategoria(id, usuario);
        if (data.nombre !== undefined) {
            await this.validarNombre(usuario.empresaId, data.nombre, id);
        }
        return await prisma_1.default.categoria.update({
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
    async eliminar(id, usuario) {
        const categoria = await this.obtenerCategoria(id, usuario);
        if (!categoria.estado) {
            throw new AppError_1.AppError('La categoría ya está desactivada.', 400);
        }
        return await prisma_1.default.categoria.update({
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
    async reactivar(id, usuario) {
        const categoria = await this.obtenerCategoria(id, usuario);
        if (categoria.estado) {
            throw new AppError_1.AppError('La categoría ya se encuentra activa.', 400);
        }
        return await prisma_1.default.categoria.update({
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
exports.CategoriaService = CategoriaService;
