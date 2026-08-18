"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const search_1 = require("../../../utils/search");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class RolService {
    async obtenerRol(id) {
        const rol = await prisma_1.default.rol.findUnique({
            where: { id },
            include: { empresa: true }
        });
        if (!rol) {
            throw new AppError_1.AppError('Rol no encontrado.', 404);
        }
        return rol;
    }
    async validarEmpresa(empresaId) {
        const empresa = await prisma_1.default.empresa.findUnique({
            where: { id: empresaId }
        });
        if (!empresa) {
            throw new AppError_1.AppError('La empresa no existe.', 404);
        }
        return empresa;
    }
    async validarNombre(empresaId, nombre, id) {
        const existe = await prisma_1.default.rol.findFirst({
            where: {
                empresaId,
                nombre: {
                    equals: nombre.trim(),
                    mode: 'insensitive'
                },
                ...(id && { NOT: { id } })
            }
        });
        if (existe) {
            throw new AppError_1.AppError('Ya existe un rol con ese nombre para esta empresa.', 400);
        }
    }
    async validarCodigo(empresaId, codigo, id) {
        if (!codigo)
            return;
        const existe = await prisma_1.default.rol.findFirst({
            where: {
                empresaId,
                codigo: {
                    equals: codigo.trim(),
                    mode: 'insensitive'
                },
                ...(id && { NOT: { id } })
            }
        });
        if (existe) {
            throw new AppError_1.AppError('Ya existe un rol con ese código para esta empresa.', 400);
        }
    }
    async obtenerTodos(query) {
        const where = {
            ...(query.empresaId && { empresaId: query.empresaId }),
            ...(query.activo !== undefined && {
                activo: query.activo === 'true'
            }),
            ...(0, search_1.buildSearch)(query.search, [
                'nombre',
                'codigo',
                'descripcion'
            ])
        };
        const { page, limit, skip, take, orderBy } = (0, query_1.buildQuery)(query);
        const [roles, total] = await prisma_1.default.$transaction([
            prisma_1.default.rol.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    empresa: true,
                    _count: {
                        select: {
                            usuarios: true
                        }
                    }
                }
            }),
            prisma_1.default.rol.count({ where })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(roles, total, page, limit);
    }
    async obtenerPorId(id) {
        return this.obtenerRol(id);
    }
    async crear(data) {
        await this.validarEmpresa(data.empresaId);
        await this.validarNombre(data.empresaId, data.nombre);
        await this.validarCodigo(data.empresaId, data.codigo);
        return prisma_1.default.rol.create({
            data: {
                codigo: data.codigo?.trim(),
                nombre: data.nombre.trim(),
                descripcion: data.descripcion?.trim(),
                empresaId: data.empresaId,
                activo: data.activo ?? true
            },
            include: {
                empresa: true,
                _count: {
                    select: {
                        usuarios: true
                    }
                }
            }
        });
    }
    async actualizar(id, data) {
        const rol = await this.obtenerRol(id);
        const empresaId = data.empresaId ?? rol.empresaId;
        await this.validarEmpresa(empresaId);
        if (data.nombre !== undefined) {
            await this.validarNombre(empresaId, data.nombre, id);
        }
        if (data.codigo !== undefined) {
            await this.validarCodigo(empresaId, data.codigo, id);
        }
        return prisma_1.default.rol.update({
            where: { id },
            data: {
                ...(data.codigo !== undefined && {
                    codigo: data.codigo.trim()
                }),
                ...(data.nombre !== undefined && {
                    nombre: data.nombre.trim()
                }),
                ...(data.descripcion !== undefined && {
                    descripcion: data.descripcion.trim()
                }),
                ...(data.empresaId !== undefined && {
                    empresaId: data.empresaId
                }),
                ...(data.activo !== undefined && {
                    activo: data.activo
                })
            },
            include: {
                empresa: true,
                _count: {
                    select: {
                        usuarios: true
                    }
                }
            }
        });
    }
    async eliminar(id) {
        const rol = await this.obtenerRol(id);
        if (!rol.activo) {
            throw new AppError_1.AppError('El rol ya está desactivado.', 400);
        }
        const usuarios = await prisma_1.default.usuario.count({
            where: { rolId: id }
        });
        if (usuarios > 0) {
            throw new AppError_1.AppError('No se puede desactivar un rol que tiene usuarios asignados.', 400);
        }
        return prisma_1.default.rol.update({
            where: { id },
            data: { activo: false }
        });
    }
    async reactivar(id) {
        const rol = await this.obtenerRol(id);
        if (rol.activo) {
            throw new AppError_1.AppError('El rol ya se encuentra activo.', 400);
        }
        return prisma_1.default.rol.update({
            where: { id },
            data: { activo: true }
        });
    }
    async obtenerPermisos(id) {
        await this.obtenerRol(id);
        const permisos = await prisma_1.default.permiso.findMany({
            include: {
                roles: {
                    where: { rolId: id }
                }
            },
            orderBy: [
                { modulo: 'asc' },
                { accion: 'asc' }
            ]
        });
        return permisos.map(permiso => ({
            id: permiso.id,
            modulo: permiso.modulo,
            accion: permiso.accion,
            nombre: permiso.nombre,
            descripcion: permiso.descripcion,
            asignado: permiso.roles.length > 0
        }));
    }
    async guardarPermisos(rolId, permisos) {
        await this.obtenerRol(rolId);
        if (!Array.isArray(permisos)) {
            throw new AppError_1.AppError('La lista de permisos es inválida.', 400);
        }
        const permisosUnicos = [...new Set(permisos)];
        if (permisosUnicos.length > 0) {
            const total = await prisma_1.default.permiso.count({
                where: {
                    id: {
                        in: permisosUnicos
                    }
                }
            });
            if (total !== permisosUnicos.length) {
                throw new AppError_1.AppError('Uno o más permisos no existen.', 400);
            }
        }
        await prisma_1.default.$transaction(async (tx) => {
            await tx.rolPermiso.deleteMany({
                where: { rolId }
            });
            if (permisosUnicos.length > 0) {
                await tx.rolPermiso.createMany({
                    data: permisosUnicos.map(permisoId => ({
                        rolId,
                        permisoId
                    }))
                });
            }
        });
        return {
            success: true,
            message: 'Permisos actualizados correctamente.'
        };
    }
}
exports.RolService = RolService;
