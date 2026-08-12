import { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearSucursalDto, ActualizarSucursalDto, ConsultarSucursalesDto } from '../dto/sucursal.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class SucursalService {
    /*=====================================================
    ====================== CREAR =========================
    =====================================================*/
    async crear(empresaId: string, data: CrearSucursalDto) {
        const existeNombre = await prisma.sucursal.findFirst({
            where: {
                empresaId,
                nombre: data.nombre
            },
            select: {
                id: true
            }
        });
        if (existeNombre) {
            throw new AppError('Ya existe una sucursal con ese nombre.', 400);
        }
        const existeCodigo = await prisma.sucursal.findFirst({
            where: {
                empresaId,
                codigo: data.codigo
            },
            select: {
                id: true
            }
        });
        if (existeCodigo) {
            throw new AppError('Ya existe una sucursal con ese código.', 400);
        }
        return prisma.sucursal.create({
            data: {
                nombre: data.nombre,
                codigo: data.codigo,
                direccion: data.direccion,
                telefono: data.telefono,
                email: data.email,
                ciudad: data.ciudad,
                estado: data.estado ?? true,
                empresa: {
                    connect: {
                        id: empresaId
                    }
                }
            }
        });
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id: string, empresaId: string) {
        const sucursal = await prisma.sucursal.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!sucursal) {
            throw new AppError('La sucursal no existe.', 404);
        }
        return sucursal;
    }
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    async obtenerTodos(empresaId: string, query: ConsultarSucursalesDto) {
        const { page, limit, skip, take, orderBy } = buildQuery(query);
        const estado =
            query.estado === true ||
                (query.estado as unknown as string) === 'true'
                ? true
                : query.estado === false ||
                    (query.estado as unknown as string) === 'false'
                    ? false
                    : undefined;
        const where: Prisma.SucursalWhereInput = {
            empresaId,
            ...(query.nombre ? {
                nombre: {
                    contains: query.nombre,
                    mode: 'insensitive'
                }
            } : {}),
            ...(query.codigo ? {
                codigo: {
                    contains: query.codigo,
                    mode: 'insensitive'
                }
            } : {}),
            ...(query.ciudad ? {
                ciudad: {
                    contains: query.ciudad,
                    mode: 'insensitive'
                }
            } : {}),
            ...(estado !== undefined ? {
                estado
            } : {})
        };
        const [sucursales, total] = await prisma.$transaction([
            prisma.sucursal.findMany({
                where,
                skip,
                take,
                orderBy
            }),
            prisma.sucursal.count({
                where
            })
        ]);
        return paginatedResponse(
            sucursales,
            total,
            page,
            limit
        );
    }
    /*=====================================================
    ===================== ACTUALIZAR =====================
    =====================================================*/
    async actualizar(id: string, empresaId: string, data: ActualizarSucursalDto) {
        const sucursal = await prisma.sucursal.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!sucursal) {
            throw new AppError('La sucursal no existe.', 404);
        }
        if (data.nombre !== undefined) {
            const existeNombre = await prisma.sucursal.findFirst({
                where: {
                    empresaId,
                    nombre: data.nombre,
                    id: {
                        not: id
                    }
                },
                select: {
                    id: true
                }
            });
            if (existeNombre) {
                throw new AppError('Ya existe otra sucursal con ese nombre.', 400);
            }
        }
        if (data.codigo !== undefined) {
            const existeCodigo = await prisma.sucursal.findFirst({
                where: {
                    empresaId,
                    codigo: data.codigo,
                    id: {
                        not: id
                    }
                },
                select: {
                    id: true
                }
            });
            if (existeCodigo) {
                throw new AppError('Ya existe otra sucursal con ese código.', 400);
            }
        }
        return prisma.sucursal.update({
            where: {
                id
            },
            data: {
                ...(data.nombre !== undefined && {
                    nombre: data.nombre
                }),
                ...(data.codigo !== undefined && {
                    codigo: data.codigo
                }),
                ...(data.direccion !== undefined && {
                    direccion: data.direccion
                }),
                ...(data.telefono !== undefined && {
                    telefono: data.telefono
                }),
                ...(data.email !== undefined && {
                    email: data.email
                }),
                ...(data.ciudad !== undefined && {
                    ciudad: data.ciudad
                }),
                ...(data.estado !== undefined && {
                    estado: data.estado
                })
            }
        });
    }
    /*=====================================================
    ==================== CAMBIAR ESTADO ==================
    =====================================================*/
    async cambiarEstado(id: string, empresaId: string, estado: boolean) {
        const sucursal = await prisma.sucursal.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!sucursal) {
            throw new AppError('La sucursal no existe.', 404);
        }
        return prisma.sucursal.update({
            where: {
                id
            },
            data: {
                estado
            }
        });
    }
    /*=====================================================
    ======================= ELIMINAR =====================
    =====================================================*/
    async eliminar(id: string, empresaId: string) {
        const sucursal = await prisma.sucursal.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!sucursal) {
            throw new AppError('La sucursal no existe.', 404);
        }
        await prisma.sucursal.delete({
            where: {
                id
            }
        });
        return null;
    }
}