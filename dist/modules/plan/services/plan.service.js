"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planService = exports.PlanService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class PlanService {
    async crear(data) {
        const codigo = data.codigo?.trim() || data.nombre.trim().toUpperCase().replace(/\s+/g, '-');
        const existente = await prisma_1.default.plan.findFirst({
            where: {
                OR: [
                    { codigo },
                    { nombre: data.nombre.trim() }
                ]
            }
        });
        if (existente) {
            throw new AppError_1.AppError('Ya existe un plan con ese nombre o código.', 400);
        }
        return prisma_1.default.plan.create({
            data: {
                nombre: data.nombre.trim(),
                codigo,
                descripcion: data.descripcion?.trim(),
                precioMensual: new client_1.Prisma.Decimal(data.precioMensual),
                precioAnual: data.precioAnual !== undefined ? new client_1.Prisma.Decimal(data.precioAnual) : null,
                maxUsuarios: data.maxUsuarios,
                maxSucursales: data.maxSucursales,
                maxBodegas: data.maxBodegas,
                activo: data.activo
            }
        });
    }
    async obtenerTodos(query) {
        const page = query.page;
        const limit = query.limit;
        const skip = (page - 1) * limit;
        const where = {
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
            ? query.sortBy
            : 'createdAt';
        const [planes, total] = await prisma_1.default.$transaction([
            prisma_1.default.plan.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: query.sortOrder
                }
            }),
            prisma_1.default.plan.count({ where })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(planes, total, page, limit);
    }
    async obtenerPorId(id) {
        const plan = await prisma_1.default.plan.findUnique({
            where: {
                id
            },
            include: {
                _count: true
            }
        });
        if (!plan) {
            throw new AppError_1.AppError('El plan no existe.', 404);
        }
        return plan;
    }
    async actualizar(id, data) {
        const plan = await prisma_1.default.plan.findUnique({
            where: {
                id
            }
        });
        if (!plan) {
            throw new AppError_1.AppError('El plan no existe.', 404);
        }
        if (data.nombre !== undefined || data.codigo !== undefined) {
            const condiciones = [];
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
                const existente = await prisma_1.default.plan.findFirst({
                    where: {
                        id: {
                            not: id
                        },
                        OR: condiciones
                    }
                });
                if (existente) {
                    throw new AppError_1.AppError('Ya existe otro plan con ese nombre o código.', 400);
                }
            }
        }
        return prisma_1.default.plan.update({
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
                    precioMensual: new client_1.Prisma.Decimal(data.precioMensual)
                }),
                ...(data.precioAnual !== undefined && {
                    precioAnual: data.precioAnual === null
                        ? null
                        : new client_1.Prisma.Decimal(data.precioAnual)
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
    async cambiarEstado(id, activo) {
        const plan = await prisma_1.default.plan.findUnique({
            where: {
                id
            }
        });
        if (!plan) {
            throw new AppError_1.AppError('El plan no existe.', 404);
        }
        return prisma_1.default.plan.update({
            where: {
                id
            },
            data: {
                activo
            }
        });
    }
    async eliminar(id) {
        const plan = await prisma_1.default.plan.findUnique({
            where: {
                id
            }
        });
        if (!plan) {
            throw new AppError_1.AppError('El plan no existe.', 404);
        }
        return prisma_1.default.plan.delete({
            where: {
                id
            }
        });
    }
}
exports.PlanService = PlanService;
exports.planService = new PlanService();
