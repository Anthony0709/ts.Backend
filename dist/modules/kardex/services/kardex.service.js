"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KardexService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class KardexService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    validarRangoFechas(fechaDesde, fechaHasta) {
        if (!fechaDesde || !fechaHasta) {
            return;
        }
        const desde = new Date(fechaDesde);
        const hasta = new Date(fechaHasta);
        if (Number.isNaN(desde.getTime()) ||
            Number.isNaN(hasta.getTime())) {
            throw new AppError_1.AppError('El rango de fechas no es válido.', 400);
        }
        if (desde > hasta) {
            throw new AppError_1.AppError('La fecha inicial no puede ser mayor que la fecha final.', 400);
        }
    }
    async validarProducto(productoId, empresaId) {
        const producto = await prisma_1.default.producto.findFirst({
            where: {
                id: productoId,
                empresaId
            },
            select: {
                id: true,
                nombre: true,
                codigo: true,
                sku: true
            }
        });
        if (!producto) {
            throw new AppError_1.AppError('El producto no existe o no pertenece a la empresa.', 404);
        }
        return producto;
    }
    async validarBodega(bodegaId, empresaId) {
        const bodega = await prisma_1.default.bodega.findFirst({
            where: {
                id: bodegaId,
                empresaId
            },
            select: {
                id: true,
                nombre: true,
                codigo: true
            }
        });
        if (!bodega) {
            throw new AppError_1.AppError('La bodega no existe o no pertenece a la empresa.', 404);
        }
        return bodega;
    }
    /*=====================================================
    ===================== KARDEX =========================
    =====================================================*/
    async obtener(usuario, query) {
        this.validarRangoFechas(query.fechaDesde, query.fechaHasta);
        if (query.productoId) {
            await this.validarProducto(query.productoId, usuario.empresaId);
        }
        if (query.bodegaId) {
            await this.validarBodega(query.bodegaId, usuario.empresaId);
        }
        const { page, limit, skip, take } = (0, query_1.buildQuery)(query);
        const where = {
            producto: {
                empresaId: usuario.empresaId
            },
            bodega: {
                empresaId: usuario.empresaId
            },
            ...(query.productoId && {
                productoId: query.productoId
            }),
            ...(query.bodegaId && {
                bodegaId: query.bodegaId
            }),
            ...(query.tipo && {
                tipo: query.tipo
            }),
            ...(query.fechaDesde && {
                createdAt: {
                    gte: new Date(query.fechaDesde)
                }
            }),
            ...(query.fechaHasta && {
                createdAt: {
                    ...(query.fechaDesde && {
                        gte: new Date(query.fechaDesde)
                    }),
                    lte: new Date(query.fechaHasta)
                }
            })
        };
        const [movimientos, total] = await prisma_1.default.$transaction([
            prisma_1.default.movimientoInventario.findMany({
                where,
                skip,
                take,
                orderBy: {
                    createdAt: 'asc'
                },
                include: {
                    producto: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true,
                            sku: true
                        }
                    },
                    bodega: {
                        select: {
                            id: true,
                            nombre: true,
                            codigo: true
                        }
                    }
                }
            }),
            prisma_1.default.movimientoInventario.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(movimientos, total, page, limit);
    }
    /*=====================================================
    ================= KARDEX POR PRODUCTO ================
    =====================================================*/
    async obtenerPorProducto(productoId, usuario, query) {
        return this.obtener(usuario, {
            ...query,
            productoId
        });
    }
    /*=====================================================
    =================== KARDEX POR BODEGA =================
    =====================================================*/
    async obtenerPorBodega(bodegaId, usuario, query) {
        return this.obtener(usuario, {
            ...query,
            bodegaId
        });
    }
}
exports.KardexService = KardexService;
