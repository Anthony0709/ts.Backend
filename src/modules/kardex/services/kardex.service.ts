import { Prisma, TipoMovimiento } from '@prisma/client';
import prisma from '../../../config/prisma';
import { ConsultarKardexDto } from '../dto/kardex.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class KardexService {
    /*=====================================================
    ================= MÉTODOS PRIVADOS ===================
    =====================================================*/
    private validarRangoFechas(
        fechaDesde?: string,
        fechaHasta?: string
    ) {
        if (!fechaDesde || !fechaHasta) {
            return;
        }
        const desde = new Date(fechaDesde);
        const hasta = new Date(fechaHasta);
        if (
            Number.isNaN(desde.getTime()) ||
            Number.isNaN(hasta.getTime())
        ) {
            throw new AppError(
                'El rango de fechas no es válido.',
                400
            );
        }
        if (desde > hasta) {
            throw new AppError(
                'La fecha inicial no puede ser mayor que la fecha final.',
                400
            );
        }
    }
    private async validarProducto(
        productoId: string,
        empresaId: string
    ) {
        const producto =
            await prisma.producto.findFirst({
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
            throw new AppError(
                'El producto no existe o no pertenece a la empresa.',
                404
            );
        }
        return producto;
    }
    private async validarBodega(
        bodegaId: string,
        empresaId: string
    ) {
        const bodega =
            await prisma.bodega.findFirst({
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
            throw new AppError(
                'La bodega no existe o no pertenece a la empresa.',
                404
            );
        }
        return bodega;
    }
    /*=====================================================
    ===================== KARDEX =========================
    =====================================================*/
    async obtener(
        usuario: Express.UserPayload,
        query: ConsultarKardexDto
    ) {
        this.validarRangoFechas(
            query.fechaDesde,
            query.fechaHasta
        );
        if (query.productoId) {
            await this.validarProducto(
                query.productoId,
                usuario.empresaId
            );
        }
        if (query.bodegaId) {
            await this.validarBodega(
                query.bodegaId,
                usuario.empresaId
            );
        }
        const {
            page,
            limit,
            skip,
            take
        } = buildQuery(query);
        const where:
            Prisma.MovimientoInventarioWhereInput = {
            producto: {
                empresaId:
                    usuario.empresaId
            },
            bodega: {
                empresaId:
                    usuario.empresaId
            },
            ...(query.productoId && {
                productoId:
                    query.productoId
            }),
            ...(query.bodegaId && {
                bodegaId:
                    query.bodegaId
            }),
            ...(query.tipo && {
                tipo:
                    query.tipo as TipoMovimiento
            }),
            ...(query.fechaDesde && {
                createdAt: {
                    gte:
                        new Date(query.fechaDesde)
                }
            }),
            ...(query.fechaHasta && {
                createdAt: {
                    ...(query.fechaDesde && {
                        gte:
                            new Date(query.fechaDesde)
                    }),
                    lte:
                        new Date(query.fechaHasta)
                }
            })
        };
        const [
            movimientos,
            total
        ] = await prisma.$transaction([
            prisma.movimientoInventario.findMany({
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
            prisma.movimientoInventario.count({
                where
            })
        ]);
        return paginatedResponse(
            movimientos,
            total,
            page,
            limit
        );
    }
    /*=====================================================
    ================= KARDEX POR PRODUCTO ================
    =====================================================*/
    async obtenerPorProducto(
        productoId: string,
        usuario: Express.UserPayload,
        query: ConsultarKardexDto
    ) {
        return this.obtener(
            usuario,
            {
                ...query,
                productoId
            }
        );
    }
    /*=====================================================
    =================== KARDEX POR BODEGA =================
    =====================================================*/
    async obtenerPorBodega(
        bodegaId: string,
        usuario: Express.UserPayload,
        query: ConsultarKardexDto
    ) {
        return this.obtener(
            usuario,
            {
                ...query,
                bodegaId
            }
        );
    }
}