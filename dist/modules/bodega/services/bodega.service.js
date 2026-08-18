"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodegaService = void 0;
const crypto_1 = require("crypto");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class BodegaService {
    /*=====================================================
    ================= GENERAR CÓDIGO =====================
    =====================================================*/
    generarCodigo() {
        return `BOD-${(0, crypto_1.randomBytes)(4)
            .toString('hex')
            .toUpperCase()}`;
    }
    /*=====================================================
    ============ GENERAR CÓDIGO ÚNICO ====================
    =====================================================*/
    async generarCodigoUnico(empresaId) {
        let codigo;
        let existe;
        do {
            codigo =
                this.generarCodigo();
            existe =
                await prisma_1.default.bodega.findFirst({
                    where: {
                        empresaId,
                        codigo
                    },
                    select: {
                        id: true
                    }
                });
        } while (existe);
        return codigo;
    }
    /*=====================================================
    ====================== CREAR =========================
    =====================================================*/
    async crear(empresaId, data) {
        /*
         * El código NO lo tomamos del frontend.
         * El backend lo genera automáticamente.
         */
        const codigo = await this.generarCodigoUnico(empresaId);
        /*
         * Verificar nombre duplicado.
         */
        const existeNombre = await prisma_1.default.bodega.findFirst({
            where: {
                empresaId,
                nombre: data.nombre
            },
            select: {
                id: true
            }
        });
        if (existeNombre) {
            throw new AppError_1.AppError('Ya existe una bodega con ese nombre.', 400);
        }
        const bodega = await prisma_1.default.bodega.create({
            data: {
                nombre: data.nombre,
                codigo,
                direccion: data.direccion,
                responsable: data.responsable,
                telefono: data.telefono,
                estado: data.estado ??
                    true,
                empresa: {
                    connect: {
                        id: empresaId
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        inventarios: true,
                        movimientos: true,
                        transferenciasOrigen: true,
                        transferenciasDestino: true,
                        devoluciones: true
                    }
                }
            }
        });
        return bodega;
    }
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    async obtenerPorId(id, empresaId) {
        const bodega = await prisma_1.default.bodega.findFirst({
            where: {
                id,
                empresaId
            },
            include: {
                _count: {
                    select: {
                        inventarios: true,
                        movimientos: true,
                        transferenciasOrigen: true,
                        transferenciasDestino: true,
                        devoluciones: true
                    }
                }
            }
        });
        if (!bodega) {
            throw new AppError_1.AppError('La bodega no existe.', 404);
        }
        return bodega;
    }
    /*=====================================================
    ====================== LISTAR ========================
    =====================================================*/
    async obtenerTodos(empresaId, query) {
        const { page, limit, skip, take, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
            empresaId,
            ...(query.nombre
                ? {
                    nombre: {
                        contains: query.nombre,
                        mode: 'insensitive'
                    }
                }
                : {}),
            ...(query.codigo
                ? {
                    codigo: {
                        contains: query.codigo,
                        mode: 'insensitive'
                    }
                }
                : {}),
            ...(query.estado !== undefined
                ? {
                    estado: query.estado
                }
                : {})
        };
        const [bodegas, total] = await prisma_1.default.$transaction([
            prisma_1.default.bodega.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    _count: {
                        select: {
                            inventarios: true,
                            movimientos: true,
                            transferenciasOrigen: true,
                            transferenciasDestino: true,
                            devoluciones: true
                        }
                    }
                }
            }),
            prisma_1.default.bodega.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(bodegas, total, page, limit);
    }
    /*=====================================================
    ===================== ACTUALIZAR =====================
    =====================================================*/
    async actualizar(id, empresaId, data) {
        const bodega = await prisma_1.default.bodega.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!bodega) {
            throw new AppError_1.AppError('La bodega no existe.', 404);
        }
        /*
         * Verificar nombre duplicado.
         */
        if (data.nombre !== undefined) {
            const existeNombre = await prisma_1.default.bodega.findFirst({
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
                throw new AppError_1.AppError('Ya existe otra bodega con ese nombre.', 400);
            }
        }
        /*
         * El código NO se modifica.
         *
         * Se mantiene el código generado
         * originalmente.
         */
        const actualizada = await prisma_1.default.bodega.update({
            where: {
                id
            },
            data: {
                ...(data.nombre !== undefined && {
                    nombre: data.nombre
                }),
                ...(data.direccion !== undefined && {
                    direccion: data.direccion
                }),
                ...(data.responsable !== undefined && {
                    responsable: data.responsable
                }),
                ...(data.telefono !== undefined && {
                    telefono: data.telefono
                }),
                ...(data.estado !== undefined && {
                    estado: data.estado
                })
            },
            include: {
                _count: {
                    select: {
                        inventarios: true,
                        movimientos: true,
                        transferenciasOrigen: true,
                        transferenciasDestino: true,
                        devoluciones: true
                    }
                }
            }
        });
        return actualizada;
    }
    /*=====================================================
    ==================== CAMBIAR ESTADO ==================
    =====================================================*/
    async cambiarEstado(id, empresaId, estado) {
        const bodega = await prisma_1.default.bodega.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!bodega) {
            throw new AppError_1.AppError('La bodega no existe.', 404);
        }
        const actualizada = await prisma_1.default.bodega.update({
            where: {
                id
            },
            data: {
                estado
            },
            include: {
                _count: {
                    select: {
                        inventarios: true,
                        movimientos: true,
                        transferenciasOrigen: true,
                        transferenciasDestino: true,
                        devoluciones: true
                    }
                }
            }
        });
        return actualizada;
    }
    /*=====================================================
    ================== ELIMINAR ==========================
    =====================================================*/
    async eliminar(id, empresaId) {
        const bodega = await prisma_1.default.bodega.findFirst({
            where: {
                id,
                empresaId
            },
            include: {
                _count: {
                    select: {
                        inventarios: true,
                        movimientos: true,
                        transferenciasOrigen: true,
                        transferenciasDestino: true,
                        devoluciones: true
                    }
                }
            }
        });
        if (!bodega) {
            throw new AppError_1.AppError('La bodega no existe.', 404);
        }
        /*
         * No eliminar físicamente una bodega
         * que ya tiene movimientos o inventario.
         */
        const tieneMovimientos = bodega._count.movimientos > 0;
        const tieneTransferencias = bodega._count.transferenciasOrigen > 0 ||
            bodega._count.transferenciasDestino > 0;
        const tieneDevoluciones = bodega._count.devoluciones > 0;
        const tieneInventario = bodega._count.inventarios > 0;
        if (tieneMovimientos ||
            tieneTransferencias ||
            tieneDevoluciones ||
            tieneInventario) {
            throw new AppError_1.AppError('No se puede eliminar la bodega porque tiene información relacionada. Desactívela en su lugar.', 400);
        }
        await prisma_1.default.bodega.delete({
            where: {
                id
            }
        });
        return null;
    }
}
exports.BodegaService = BodegaService;
