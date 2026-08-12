import { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearProductoDto, ActualizarProductoDto } from '../dto/producto.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { buildSearch } from '../../../utils/search';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class ProductoService {
    private async obtenerProducto(
        id: string,
        usuario: Express.UserPayload
    ) {
        const producto = await prisma.producto.findFirst({
            where: {
                id,
                empresaId: usuario.empresaId
            },
            include: {
                empresa: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                categoria: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
                    }
                },
                marca: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });
        if (!producto) {
            throw new AppError(
                'El producto no existe.',
                404
            );
        }
        return producto;
    }

    private async validarEmpresa(
        empresaId: string
    ) {
        const empresa = await prisma.empresa.findUnique({
            where: {
                id: empresaId
            },
            select: {
                id: true
            }
        });
        if (!empresa) {
            throw new AppError(
                'La empresa no existe.',
                404
            );
        }
    }

    private async validarCategoria(
        categoriaId: string,
        empresaId: string
    ) {
        const categoria = await prisma.categoria.findFirst({
            where: {
                id: categoriaId,
                empresaId,
                estado: true
            },
            select: {
                id: true
            }
        });
        if (!categoria) {
            throw new AppError(
                'La categoría no existe, está inactiva o no pertenece a la empresa.',
                400
            );
        }
    }

    private async validarMarca(
        marcaId: string,
        empresaId: string
    ) {
        const marca = await prisma.marca.findFirst({
            where: {
                id: marcaId,
                empresaId,
                estado: true
            },
            select: {
                id: true
            }
        });
        if (!marca) {
            throw new AppError(
                'La marca no existe, está inactiva o no pertenece a la empresa.',
                400
            );
        }
    }

    private async generarCodigo(
        empresaId: string
    ): Promise<string> {
        for (let intento = 0; intento < 20; intento++) {
            const codigo = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            const existe = await prisma.producto.findFirst({
                where: {
                    empresaId,
                    codigo
                },
                select: {
                    id: true
                }
            });

            if (!existe) {
                return codigo;
            }
        }

        throw new AppError(
            'No fue posible generar un código único para el producto.',
            500
        );
    }

    private async generarSku(
        empresaId: string
    ): Promise<string> {
        for (let intento = 0; intento < 20; intento++) {
            const numero = Math.floor(
                100000 + Math.random() * 900000
            );

            const sku = `SKU-${numero}`;

            const existe = await prisma.producto.findFirst({
                where: {
                    empresaId,
                    sku
                },
                select: {
                    id: true
                }
            });

            if (!existe) {
                return sku;
            }
        }

        throw new AppError(
            'No fue posible generar un SKU único para el producto.',
            500
        );
    }

    private async generarCodigoBarras(
        empresaId: string
    ): Promise<string> {
        for (let intento = 0; intento < 20; intento++) {
            const codigo = Array.from(
                { length: 12 },
                () => Math.floor(Math.random() * 10)
            ).join('');

            const existe = await prisma.producto.findFirst({
                where: {
                    empresaId,
                    codigoBarras: codigo
                },
                select: {
                    id: true
                }
            });

            if (!existe) {
                return codigo;
            }
        }

        throw new AppError(
            'No fue posible generar un código de barras único para el producto.',
            500
        );
    }

    private validarPrecios(
        precioCompra?: number,
        precioVenta?: number
    ) {
        if (
            precioCompra !== undefined &&
            precioVenta !== undefined &&
            precioVenta < precioCompra
        ) {
            throw new AppError(
                'El precio de venta no puede ser menor al precio de compra.',
                400
            );
        }
    }

    private validarStock(
        stockMinimo?: number,
        stockMaximo?: number
    ) {
        if (
            stockMinimo !== undefined &&
            stockMaximo !== undefined &&
            stockMaximo < stockMinimo
        ) {
            throw new AppError(
                'El stock máximo no puede ser menor que el stock mínimo.',
                400
            );
        }
    }

    async obtenerTodos(
        usuario: Express.UserPayload,
        query: any
    ) {
        const {
            page,
            limit,
            skip,
            take,
            search,
            orderBy
        } = buildQuery(query);

        const where: Prisma.ProductoWhereInput = {
            empresaId: usuario.empresaId,
            ...(query.estado !== undefined && {
                estado: query.estado === 'true'
            }),
            ...(query.categoriaId && {
                categoriaId: query.categoriaId
            }),
            ...(query.marcaId && {
                marcaId: query.marcaId
            }),
            ...buildSearch(search, [
                'nombre',
                'descripcion',
                'codigo',
                'sku',
                'codigoBarras'
            ])
        };

        const [productos, total] =
            await prisma.$transaction([
                prisma.producto.findMany({
                    where,
                    skip,
                    take,
                    orderBy,
                    include: {
                        categoria: {
                            select: {
                                id: true,
                                nombre: true,
                                codigo: true
                            }
                        },
                        marca: {
                            select: {
                                id: true,
                                nombre: true
                            }
                        },
                        empresa: {
                            select: {
                                id: true,
                                nombre: true
                            }
                        }
                    }
                }),
                prisma.producto.count({
                    where
                })
            ]);

        return paginatedResponse(
            productos,
            total,
            page,
            limit
        );
    }

    async obtenerPorId(
        id: string,
        usuario: Express.UserPayload
    ) {
        return this.obtenerProducto(
            id,
            usuario
        );
    }

    async crear(
        data: CrearProductoDto,
        usuario: Express.UserPayload
    ) {
        const empresaId = usuario.empresaId;

        await this.validarEmpresa(
            empresaId
        );

        await this.validarCategoria(
            data.categoriaId,
            empresaId
        );

        await this.validarMarca(
            data.marcaId,
            empresaId
        );

        this.validarPrecios(
            data.precioCompra,
            data.precioVenta
        );

        this.validarStock(
            data.stockMinimo,
            data.stockMaximo
        );

        const codigo = await this.generarCodigo(
            empresaId
        );

        const sku = await this.generarSku(
            empresaId
        );

        const codigoBarras =
            await this.generarCodigoBarras(
                empresaId
            );

        return await prisma.producto.create({
            data: {
                nombre: data.nombre.trim(),
                descripcion: data.descripcion?.trim(),
                imagen: data.imagen?.trim(),
                codigo,
                sku,
                codigoBarras,
                precioCompra: data.precioCompra,
                precioVenta: data.precioVenta,
                stockMinimo: data.stockMinimo ?? 0,
                stockMaximo: data.stockMaximo,
                estado: data.estado ?? true,
                categoriaId: data.categoriaId,
                marcaId: data.marcaId,
                empresaId
            },
            include: {
                categoria: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
                    }
                },
                marca: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                empresa: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });
    }

    async actualizar(
        id: string,
        data: ActualizarProductoDto,
        usuario: Express.UserPayload
    ) {
        const producto =
            await this.obtenerProducto(
                id,
                usuario
            );

        if (data.categoriaId !== undefined) {
            await this.validarCategoria(
                data.categoriaId,
                usuario.empresaId
            );
        }

        if (data.marcaId !== undefined) {
            await this.validarMarca(
                data.marcaId,
                usuario.empresaId
            );
        }

        this.validarPrecios(
            data.precioCompra,
            data.precioVenta
        );

        this.validarStock(
            data.stockMinimo,
            data.stockMaximo
        );

        const precioCompra =
            data.precioCompra ??
            producto.precioCompra;

        const precioVenta =
            data.precioVenta ??
            producto.precioVenta;

        const stockMinimo =
            data.stockMinimo ??
            producto.stockMinimo;

        const stockMaximo =
            data.stockMaximo ??
            producto.stockMaximo;

        this.validarPrecios(
            Number(precioCompra),
            Number(precioVenta)
        );

        this.validarStock(
            stockMinimo,
            stockMaximo ?? undefined
        );

        return await prisma.producto.update({
            where: {
                id: producto.id
            },
            data: {
                ...(data.nombre !== undefined && {
                    nombre: data.nombre.trim()
                }),
                ...(data.descripcion !== undefined && {
                    descripcion: data.descripcion?.trim()
                }),
                ...(data.imagen !== undefined && {
                    imagen: data.imagen?.trim()
                }),
                ...(data.precioCompra !== undefined && {
                    precioCompra: data.precioCompra
                }),
                ...(data.precioVenta !== undefined && {
                    precioVenta: data.precioVenta
                }),
                ...(data.stockMinimo !== undefined && {
                    stockMinimo: data.stockMinimo
                }),
                ...(data.stockMaximo !== undefined && {
                    stockMaximo: data.stockMaximo
                }),
                ...(data.estado !== undefined && {
                    estado: data.estado
                }),
                ...(data.categoriaId !== undefined && {
                    categoriaId: data.categoriaId
                }),
                ...(data.marcaId !== undefined && {
                    marcaId: data.marcaId
                })
            },
            include: {
                categoria: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true
                    }
                },
                marca: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                empresa: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });
    }

    async eliminar(
        id: string,
        usuario: Express.UserPayload
    ) {
        const producto =
            await this.obtenerProducto(
                id,
                usuario
            );

        if (!producto.estado) {
            throw new AppError(
                'El producto ya está desactivado.',
                400
            );
        }

        return await prisma.producto.update({
            where: {
                id: producto.id
            },
            data: {
                estado: false
            },
            include: {
                categoria: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                marca: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });
    }

    async reactivar(
        id: string,
        usuario: Express.UserPayload
    ) {
        const producto =
            await this.obtenerProducto(
                id,
                usuario
            );

        if (producto.estado) {
            throw new AppError(
                'El producto ya se encuentra activo.',
                400
            );
        }

        return await prisma.producto.update({
            where: {
                id: producto.id
            },
            data: {
                estado: true
            },
            include: {
                categoria: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                marca: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });
    }
}