"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProveedorService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class ProveedorService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    async obtenerProveedor(id, empresaId) {
        const proveedor = await prisma_1.default.proveedor.findFirst({
            where: {
                id,
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
        if (!proveedor) {
            throw new AppError_1.AppError('El proveedor no existe.', 404);
        }
        return proveedor;
    }
    normalizarEmail(email) {
        if (!email) {
            return undefined;
        }
        const valor = email.trim().toLowerCase();
        return valor || undefined;
    }
    async validarRuc(ruc, empresaId, excluirId) {
        const existe = await prisma_1.default.proveedor.findFirst({
            where: {
                empresaId,
                ruc: ruc.trim(),
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
            throw new AppError_1.AppError('El RUC ya está registrado para esta empresa.', 400);
        }
    }
    validarCredito(limiteCredito, diasCredito) {
        if (limiteCredito !== undefined &&
            limiteCredito < 0) {
            throw new AppError_1.AppError('El límite de crédito no puede ser negativo.', 400);
        }
        if (diasCredito !== undefined &&
            diasCredito < 0) {
            throw new AppError_1.AppError('Los días de crédito no pueden ser negativos.', 400);
        }
    }
    construirBusqueda(search) {
        if (!search) {
            return {};
        }
        return {
            OR: [
                {
                    nombreComercial: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    razonSocial: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    ruc: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    contacto: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    telefono: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    celular: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        };
    }
    /*=====================================================
    ====================== LISTAR ========================
    =====================================================*/
    async obtenerTodos(usuario, query) {
        const { page, limit, skip, take, search, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
            empresaId: usuario.empresaId,
            ...(query.estado !== undefined && {
                estado: query.estado === 'true'
            }),
            ...this.construirBusqueda(search)
        };
        const [proveedores, total] = await prisma_1.default.$transaction([
            prisma_1.default.proveedor.findMany({
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
            prisma_1.default.proveedor.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(proveedores, total, page, limit);
    }
    /*=====================================================
    ==================== OBTENER POR ID ==================
    =====================================================*/
    async obtenerPorId(id, usuario) {
        return this.obtenerProveedor(id, usuario.empresaId);
    }
    /*=====================================================
    ======================== CREAR =======================
    =====================================================*/
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        await this.validarRuc(data.ruc, empresaId);
        this.validarCredito(data.limiteCredito, data.diasCredito);
        return prisma_1.default.proveedor.create({
            data: {
                nombreComercial: data.nombreComercial.trim(),
                razonSocial: data.razonSocial.trim(),
                ruc: data.ruc.trim(),
                contacto: data.contacto?.trim(),
                cargoContacto: data.cargoContacto?.trim(),
                email: this.normalizarEmail(data.email),
                telefono: data.telefono?.trim(),
                celular: data.celular?.trim(),
                direccion: data.direccion?.trim(),
                ciudad: data.ciudad?.trim(),
                provincia: data.provincia?.trim(),
                pais: data.pais?.trim() || 'Ecuador',
                observaciones: data.observaciones?.trim(),
                diasCredito: data.diasCredito ?? 0,
                limiteCredito: data.limiteCredito,
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
    /*=====================================================
    ====================== ACTUALIZAR ====================
    =====================================================*/
    async actualizar(id, data, usuario) {
        const proveedor = await this.obtenerProveedor(id, usuario.empresaId);
        if (data.ruc !== undefined) {
            await this.validarRuc(data.ruc, usuario.empresaId, proveedor.id);
        }
        this.validarCredito(data.limiteCredito, data.diasCredito);
        return prisma_1.default.proveedor.update({
            where: {
                id: proveedor.id
            },
            data: {
                ...(data.nombreComercial !== undefined && {
                    nombreComercial: data.nombreComercial.trim()
                }),
                ...(data.razonSocial !== undefined && {
                    razonSocial: data.razonSocial.trim()
                }),
                ...(data.ruc !== undefined && {
                    ruc: data.ruc.trim()
                }),
                ...(data.contacto !== undefined && {
                    contacto: data.contacto?.trim()
                }),
                ...(data.cargoContacto !== undefined && {
                    cargoContacto: data.cargoContacto?.trim()
                }),
                ...(data.email !== undefined && {
                    email: this.normalizarEmail(data.email)
                }),
                ...(data.telefono !== undefined && {
                    telefono: data.telefono?.trim()
                }),
                ...(data.celular !== undefined && {
                    celular: data.celular?.trim()
                }),
                ...(data.direccion !== undefined && {
                    direccion: data.direccion?.trim()
                }),
                ...(data.ciudad !== undefined && {
                    ciudad: data.ciudad?.trim()
                }),
                ...(data.provincia !== undefined && {
                    provincia: data.provincia?.trim()
                }),
                ...(data.pais !== undefined && {
                    pais: data.pais?.trim()
                }),
                ...(data.observaciones !== undefined && {
                    observaciones: data.observaciones?.trim()
                }),
                ...(data.diasCredito !== undefined && {
                    diasCredito: data.diasCredito
                }),
                ...(data.limiteCredito !== undefined && {
                    limiteCredito: data.limiteCredito
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
    /*=====================================================
    ======================= ELIMINAR =====================
    =====================================================*/
    async eliminar(id, usuario) {
        const proveedor = await this.obtenerProveedor(id, usuario.empresaId);
        if (!proveedor.estado) {
            throw new AppError_1.AppError('El proveedor ya está desactivado.', 400);
        }
        return prisma_1.default.proveedor.update({
            where: {
                id: proveedor.id
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
    /*=====================================================
    ====================== REACTIVAR =====================
    =====================================================*/
    async reactivar(id, usuario) {
        const proveedor = await this.obtenerProveedor(id, usuario.empresaId);
        if (proveedor.estado) {
            throw new AppError_1.AppError('El proveedor ya se encuentra activo.', 400);
        }
        return prisma_1.default.proveedor.update({
            where: {
                id: proveedor.id
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
exports.ProveedorService = ProveedorService;
