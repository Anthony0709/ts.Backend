import { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearRolDto, ActualizarRolDto } from '../dto/rol.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { buildSearch } from '../../../utils/search';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class RolService {
    private async obtenerRol(id: string) {
        const rol = await prisma.rol.findUnique({
            where: { id },
            include: { empresa: true }
        });
        if (!rol) {
            throw new AppError('Rol no encontrado.', 404);
        }
        return rol;
    }

    private async validarEmpresa(empresaId: string) {
        const empresa = await prisma.empresa.findUnique({
            where: { id: empresaId }
        });
        if (!empresa) {
            throw new AppError('La empresa no existe.', 404);
        }
        return empresa;
    }

    private async validarNombre(empresaId: string, nombre: string, id?: string) {
        const existe = await prisma.rol.findFirst({
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
            throw new AppError('Ya existe un rol con ese nombre para esta empresa.', 400);
        }
    }

    private async validarCodigo(empresaId: string, codigo?: string, id?: string) {
        if (!codigo) return;
        const existe = await prisma.rol.findFirst({
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
            throw new AppError('Ya existe un rol con ese código para esta empresa.', 400);
        }
    }

    async obtenerTodos(query: any) {
        const where: Prisma.RolWhereInput = {
            ...(query.empresaId && { empresaId: query.empresaId }),
            ...(query.activo !== undefined && {
                activo: query.activo === 'true'
            }),
            ...buildSearch(query.search, [
                'nombre',
                'codigo',
                'descripcion'
            ])
        };
        const { page, limit, skip, take, orderBy } = buildQuery(query);
        const [roles, total] = await prisma.$transaction([
            prisma.rol.findMany({
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
            prisma.rol.count({ where })
        ]);
        return paginatedResponse(roles, total, page, limit);
    }

    async obtenerPorId(id: string) {
        return this.obtenerRol(id);
    }

    async crear(data: CrearRolDto) {
        await this.validarEmpresa(data.empresaId);
        await this.validarNombre(data.empresaId, data.nombre);
        await this.validarCodigo(data.empresaId, data.codigo);
        return prisma.rol.create({
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

    async actualizar(id: string, data: ActualizarRolDto) {
        const rol = await this.obtenerRol(id);
        const empresaId = data.empresaId ?? rol.empresaId;
        await this.validarEmpresa(empresaId);
        if (data.nombre !== undefined) {
            await this.validarNombre(empresaId, data.nombre, id);
        }
        if (data.codigo !== undefined) {
            await this.validarCodigo(empresaId, data.codigo, id);
        }
        return prisma.rol.update({
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

    async eliminar(id: string) {
        const rol = await this.obtenerRol(id);
        if (!rol.activo) {
            throw new AppError('El rol ya está desactivado.', 400);
        }
        const usuarios = await prisma.usuario.count({
            where: { rolId: id }
        });
        if (usuarios > 0) {
            throw new AppError(
                'No se puede desactivar un rol que tiene usuarios asignados.',
                400
            );
        }
        return prisma.rol.update({
            where: { id },
            data: { activo: false }
        });
    }

    async reactivar(id: string) {
        const rol = await this.obtenerRol(id);
        if (rol.activo) {
            throw new AppError('El rol ya se encuentra activo.', 400);
        }
        return prisma.rol.update({
            where: { id },
            data: { activo: true }
        });
    }

    async obtenerPermisos(id: string) {
        await this.obtenerRol(id);
        const permisos = await prisma.permiso.findMany({
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

    async guardarPermisos(rolId: string, permisos: string[]) {
        await this.obtenerRol(rolId);
        if (!Array.isArray(permisos)) {
            throw new AppError('La lista de permisos es inválida.', 400);
        }
        const permisosUnicos = [...new Set(permisos)];
        if (permisosUnicos.length > 0) {
            const total = await prisma.permiso.count({
                where: {
                    id: {
                        in: permisosUnicos
                    }
                }
            });
            if (total !== permisosUnicos.length) {
                throw new AppError('Uno o más permisos no existen.', 400);
            }
        }
        await prisma.$transaction(async tx => {
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