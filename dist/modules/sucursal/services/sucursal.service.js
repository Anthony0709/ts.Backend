"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SucursalService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class SucursalService {
    /*=====================================================
    ====================== CREAR =========================
    =====================================================*/
    async crear(empresaId, data) {
        const existeNombre = await prisma_1.default.sucursal.findFirst({
            where: {
                empresaId,
                nombre: data.nombre
            },
            select: {
                id: true
            }
        });
        if (existeNombre) {
            throw new AppError_1.AppError('Ya existe una sucursal con ese nombre.', 400);
        }
        const existeCodigo = await prisma_1.default.sucursal.findFirst({
            where: {
                empresaId,
                codigo: data.codigo
            },
            select: {
                id: true
            }
        });
        if (existeCodigo) {
            throw new AppError_1.AppError('Ya existe una sucursal con ese código.', 400);
        }
        return prisma_1.default.sucursal.create({
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
    async obtenerPorId(id, empresaId) {
        const sucursal = await prisma_1.default.sucursal.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!sucursal) {
            throw new AppError_1.AppError('La sucursal no existe.', 404);
        }
        return sucursal;
    }
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    async obtenerTodos(empresaId, query) {
        const { page, limit, skip, take, orderBy } = (0, query_1.buildQuery)(query);
        const estado = query.estado === true ||
            query.estado === 'true'
            ? true
            : query.estado === false ||
                query.estado === 'false'
                ? false
                : undefined;
        const where = {
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
        const [sucursales, total] = await prisma_1.default.$transaction([
            prisma_1.default.sucursal.findMany({
                where,
                skip,
                take,
                orderBy
            }),
            prisma_1.default.sucursal.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(sucursales, total, page, limit);
    }
    /*=====================================================
    ===================== ACTUALIZAR =====================
    =====================================================*/
    async actualizar(id, empresaId, data) {
        const sucursal = await prisma_1.default.sucursal.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!sucursal) {
            throw new AppError_1.AppError('La sucursal no existe.', 404);
        }
        if (data.nombre !== undefined) {
            const existeNombre = await prisma_1.default.sucursal.findFirst({
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
                throw new AppError_1.AppError('Ya existe otra sucursal con ese nombre.', 400);
            }
        }
        if (data.codigo !== undefined) {
            const existeCodigo = await prisma_1.default.sucursal.findFirst({
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
                throw new AppError_1.AppError('Ya existe otra sucursal con ese código.', 400);
            }
        }
        return prisma_1.default.sucursal.update({
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
    async cambiarEstado(id, empresaId, estado) {
        const sucursal = await prisma_1.default.sucursal.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!sucursal) {
            throw new AppError_1.AppError('La sucursal no existe.', 404);
        }
        return prisma_1.default.sucursal.update({
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
    async eliminar(id, empresaId) {
        const sucursal = await prisma_1.default.sucursal.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!sucursal) {
            throw new AppError_1.AppError('La sucursal no existe.', 404);
        }
        await prisma_1.default.sucursal.delete({
            where: {
                id
            }
        });
        return null;
    }
}
exports.SucursalService = SucursalService;
