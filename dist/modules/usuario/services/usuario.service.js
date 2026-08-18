"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
const query_1 = require("../../../utils/query");
const search_1 = require("../../../utils/search");
class UsuarioService {
    async obtenerUsuario(id, user) {
        const usuario = await prisma_1.default.usuario.findFirst({
            where: user.rol === 'Super Administrador'
                ? { id }
                : {
                    id,
                    empresaId: user.empresaId
                }
        });
        if (!usuario) {
            throw new AppError_1.AppError('El usuario no existe.', 404);
        }
        return usuario;
    }
    async validarEmpresa(empresaId) {
        const empresa = await prisma_1.default.empresa.findUnique({
            where: { id: empresaId }
        });
        if (!empresa) {
            throw new AppError_1.AppError('La empresa no existe.', 404);
        }
        if (!empresa.activo) {
            throw new AppError_1.AppError('La empresa se encuentra inactiva.', 400);
        }
        return empresa;
    }
    async validarRol(rolId, empresaId) {
        const rol = await prisma_1.default.rol.findFirst({
            where: {
                id: rolId,
                empresaId,
                activo: true
            }
        });
        if (!rol) {
            throw new AppError_1.AppError('El rol no existe, no pertenece a la empresa o está inactivo.', 400);
        }
        return rol;
    }
    async validarEmail(email, empresaId, excluirId) {
        const existe = await prisma_1.default.usuario.findFirst({
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
            throw new AppError_1.AppError('Ya existe un usuario con ese correo.', 409);
        }
    }
    async obtenerTodos(user, query) {
        const { page, limit, skip, take, search } = (0, query_1.buildQuery)(query);
        const where = {
            ...(user.rol === 'Super Administrador'
                ? {}
                : {
                    empresaId: user.empresaId
                }),
            ...(query.activo !== undefined && {
                activo: query.activo === true ||
                    query.activo === 'true'
            }),
            ...(0, search_1.buildSearch)(search, [
                'nombres',
                'apellidos',
                'email'
            ])
        };
        const [usuarios, total] = await prisma_1.default.$transaction([
            prisma_1.default.usuario.findMany({
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
            prisma_1.default.usuario.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(usuarios, total, page, limit);
    }
    async obtenerPorId(id, user) {
        const usuario = await prisma_1.default.usuario.findFirst({
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
            throw new AppError_1.AppError('El usuario no existe.', 404);
        }
        return usuario;
    }
    async crear(data, user, meta) {
        const empresaId = user.rol === 'Super Administrador'
            ? data.empresaId
            : user.empresaId;
        await this.validarEmpresa(empresaId);
        await this.validarRol(data.rolId, empresaId);
        const email = data.email.trim().toLowerCase();
        await this.validarEmail(email, empresaId);
        const password = await bcrypt_1.default.hash(data.password, 12);
        return await prisma_1.default.$transaction(async (tx) => {
            const usuario = await tx.usuario.create({
                data: {
                    nombres: data.nombres.trim(),
                    apellidos: data.apellidos.trim(),
                    email,
                    password,
                    activo: data.activo ?? true,
                    empresaId,
                    rolId: data.rolId
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
                    accion: client_1.TipoAuditoria.CREATE,
                    descripcion: `Se creó el usuario ${usuario.email}.`,
                    registroId: usuario.id,
                    ip: meta?.ip,
                    userAgent: meta?.userAgent
                }
            });
            return usuario;
        });
    }
    async actualizar(id, data, user, meta) {
        const usuario = await this.obtenerUsuario(id, user);
        const empresaId = user.rol === 'Super Administrador'
            ? (data.empresaId ??
                usuario.empresaId)
            : user.empresaId;
        await this.validarEmpresa(empresaId);
        if (data.rolId) {
            await this.validarRol(data.rolId, empresaId);
        }
        const email = data.email !== undefined
            ? data.email.trim().toLowerCase()
            : usuario.email;
        if (data.email !== undefined &&
            email !== usuario.email.toLowerCase()) {
            await this.validarEmail(email, empresaId, id);
        }
        const datosActualizar = {
            ...(data.nombres !== undefined && {
                nombres: data.nombres.trim()
            }),
            ...(data.apellidos !== undefined && {
                apellidos: data.apellidos.trim()
            }),
            ...(data.email !== undefined && {
                email
            }),
            ...(data.activo !== undefined && {
                activo: data.activo
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
        if (data.password &&
            data.password.trim()) {
            datosActualizar.password =
                await bcrypt_1.default.hash(data.password, 12);
        }
        return await prisma_1.default.$transaction(async (tx) => {
            const actualizado = await tx.usuario.update({
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
                    accion: client_1.TipoAuditoria.UPDATE,
                    descripcion: `Se actualizó el usuario ${actualizado.email}.`,
                    registroId: actualizado.id,
                    ip: meta?.ip,
                    userAgent: meta?.userAgent
                }
            });
            return actualizado;
        });
    }
    async eliminar(id, user, meta) {
        const usuario = await this.obtenerUsuario(id, user);
        if (usuario.id === user.id) {
            throw new AppError_1.AppError('No puede desactivar su propio usuario.', 400);
        }
        if (!usuario.activo) {
            throw new AppError_1.AppError('El usuario ya se encuentra inactivo.', 400);
        }
        return await prisma_1.default.$transaction(async (tx) => {
            const actualizado = await tx.usuario.update({
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
                    empresaId: usuario.empresaId,
                    usuarioId: user.id,
                    modulo: 'USUARIOS',
                    accion: client_1.TipoAuditoria.DELETE,
                    descripcion: `Se desactivó el usuario ${usuario.email}.`,
                    registroId: usuario.id,
                    ip: meta?.ip,
                    userAgent: meta?.userAgent
                }
            });
            return actualizado;
        });
    }
    async reactivar(id, user, meta) {
        const usuario = await this.obtenerUsuario(id, user);
        if (usuario.activo) {
            throw new AppError_1.AppError('El usuario ya se encuentra activo.', 400);
        }
        return await prisma_1.default.$transaction(async (tx) => {
            const actualizado = await tx.usuario.update({
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
                    empresaId: usuario.empresaId,
                    usuarioId: user.id,
                    modulo: 'USUARIOS',
                    accion: client_1.TipoAuditoria.UPDATE,
                    descripcion: `Se reactivó el usuario ${usuario.email}.`,
                    registroId: usuario.id,
                    ip: meta?.ip,
                    userAgent: meta?.userAgent
                }
            });
            return actualizado;
        });
    }
}
exports.UsuarioService = UsuarioService;
