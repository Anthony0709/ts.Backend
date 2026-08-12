import { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearPlanDto, ActualizarPlanDto, ConsultarPlanesDto } from '../dto/plan.dto';
import { AppError } from '../../../utils/AppError';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class PlanService {
    async crear(data: CrearPlanDto) {
        const codigo = data.codigo?.trim() || data.nombre.trim().toUpperCase().replace(/\s+/g, '-');
        const existente = await prisma.plan.findFirst({
            where: {
                OR: [
                    { codigo },
                    { nombre: data.nombre.trim() }
                ]
            }
        });
        if (existente) {
            throw new AppError('Ya existe un plan con ese nombre o código.', 400);
        }
        return prisma.plan.create({
            data: {
                nombre: data.nombre.trim(),
                codigo,
                descripcion: data.descripcion?.trim(),
                precioMensual: new Prisma.Decimal(data.precioMensual),
                precioAnual: data.precioAnual !== undefined ? new Prisma.Decimal(data.precioAnual) : null,
                maxUsuarios: data.maxUsuarios,
                maxSucursales: data.maxSucursales,
                maxBodegas: data.maxBodegas,
                activo: data.activo
            }
        });
    }
    async obtenerTodos(query: ConsultarPlanesDto) {
        const page = query.page;
        const limit = query.limit;
        const skip = (page - 1) * limit;
        const where: Prisma.PlanWhereInput = {
            ...(query.search ? {
                OR: [
                    {
                        nombre: {
                            contains: query.search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        codigo: {
                            contains: query.search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        descripcion: {
                            contains: query.search,
                            mode: 'insensitive'
                        }
                    }
                ]
            } : {}),
            ...(query.activo !== undefined ? {
                activo: query.activo
            } : {})
        };
        const allowedSortFields = [
            'nombre',
            'codigo',
            'precioMensual',
            'precioAnual',
            'createdAt',
            'activo'
        ];
        const sortBy = allowedSortFields.includes(query.sortBy ?? '')
            ? query.sortBy!
            : 'createdAt';
        const [planes, total] = await prisma.$transaction([
            prisma.plan.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: query.sortOrder
                }
            }),
            prisma.plan.count({ where })
        ]);
        return paginatedResponse(
            planes,
            total,
            page,
            limit
        );
    }
    async obtenerPorId(id: string) {
        const plan = await prisma.plan.findUnique({
            where: {
                id
            },
            include: {
                _count: true
            }
        });
        if (!plan) {
            throw new AppError('El plan no existe.', 404);
        }
        return plan;
    }
    async actualizar(id: string, data: ActualizarPlanDto) {
        const plan = await prisma.plan.findUnique({
            where: {
                id
            }
        });
        if (!plan) {
            throw new AppError('El plan no existe.', 404);
        }
        if (data.nombre !== undefined || data.codigo !== undefined) {
            const condiciones: Prisma.PlanWhereInput[] = [];
            if (data.nombre !== undefined) {
                condiciones.push({
                    nombre: data.nombre.trim()
                });
            }
            if (data.codigo !== undefined && data.codigo !== null) {
                condiciones.push({
                    codigo: data.codigo.trim()
                });
            }
            if (condiciones.length > 0) {
                const existente = await prisma.plan.findFirst({
                    where: {
                        id: {
                            not: id
                        },
                        OR: condiciones
                    }
                });
                if (existente) {
                    throw new AppError('Ya existe otro plan con ese nombre o código.', 400);
                }
            }
        }
        return prisma.plan.update({
            where: {
                id
            },
            data: {
                ...(data.nombre !== undefined && {
                    nombre: data.nombre.trim()
                }),
                ...(data.codigo !== undefined && {
                    codigo: data.codigo?.trim() || null
                }),
                ...(data.descripcion !== undefined && {
                    descripcion: data.descripcion?.trim() || null
                }),
                ...(data.precioMensual !== undefined && {
                    precioMensual: new Prisma.Decimal(data.precioMensual)
                }),
                ...(data.precioAnual !== undefined && {
                    precioAnual: data.precioAnual === null
                        ? null
                        : new Prisma.Decimal(data.precioAnual)
                }),
                ...(data.maxUsuarios !== undefined && {
                    maxUsuarios: data.maxUsuarios
                }),
                ...(data.maxSucursales !== undefined && {
                    maxSucursales: data.maxSucursales
                }),
                ...(data.maxBodegas !== undefined && {
                    maxBodegas: data.maxBodegas
                }),
                ...(data.activo !== undefined && {
                    activo: data.activo
                })
            }
        });
    }
    async cambiarEstado(id: string, activo: boolean) {
        const plan = await prisma.plan.findUnique({
            where: {
                id
            }
        });
        if (!plan) {
            throw new AppError('El plan no existe.', 404);
        }
        return prisma.plan.update({
            where: {
                id
            },
            data: {
                activo
            }
        });
    }
    async eliminar(id: string) {
        const plan = await prisma.plan.findUnique({
            where: {
                id
            }
        });
        if (!plan) {
            throw new AppError('El plan no existe.', 404);
        }
        return prisma.plan.delete({
            where: {
                id
            }
        });
    }
}
export const planService = new PlanService();