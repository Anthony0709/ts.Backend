"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const search_1 = require("../../../utils/search");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class ProductoService {
    async obtenerProducto(id, usuario) {
        const producto = await prisma_1.default.producto.findFirst({
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
            throw new AppError_1.AppError('El producto no existe.', 404);
        }
        return producto;
    }
    async validarEmpresa(empresaId) {
        const empresa = await prisma_1.default.empresa.findUnique({
            where: {
                id: empresaId
            },
            select: {
                id: true
            }
        });
        if (!empresa) {
            throw new AppError_1.AppError('La empresa no existe.', 404);
        }
    }
    async validarCategoria(categoriaId, empresaId) {
        const categoria = await prisma_1.default.categoria.findFirst({
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
            throw new AppError_1.AppError('La categoría no existe, está inactiva o no pertenece a la empresa.', 400);
        }
    }
    async validarMarca(marcaId, empresaId) {
        const marca = await prisma_1.default.marca.findFirst({
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
            throw new AppError_1.AppError('La marca no existe, está inactiva o no pertenece a la empresa.', 400);
        }
    }
    async generarCodigo(empresaId) {
        for (let intento = 0; intento < 20; intento++) {
            const codigo = Math.floor(100000 + Math.random() * 900000).toString();
            const existe = await prisma_1.default.producto.findFirst({
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
        throw new AppError_1.AppError('No fue posible generar un código único para el producto.', 500);
    }
    async generarSku(empresaId) {
        for (let intento = 0; intento < 20; intento++) {
            const numero = Math.floor(100000 + Math.random() * 900000);
            const sku = `SKU-${numero}`;
            const existe = await prisma_1.default.producto.findFirst({
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
        throw new AppError_1.AppError('No fue posible generar un SKU único para el producto.', 500);
    }
    async generarCodigoBarras(empresaId) {
        for (let intento = 0; intento < 20; intento++) {
            const codigo = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
            const existe = await prisma_1.default.producto.findFirst({
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
        throw new AppError_1.AppError('No fue posible generar un código de barras único para el producto.', 500);
    }
    validarPrecios(precioCompra, precioVenta) {
        if (precioCompra !== undefined &&
            precioVenta !== undefined &&
            precioVenta < precioCompra) {
            throw new AppError_1.AppError('El precio de venta no puede ser menor al precio de compra.', 400);
        }
    }
    validarStock(stockMinimo, stockMaximo) {
        if (stockMinimo !== undefined &&
            stockMaximo !== undefined &&
            stockMaximo < stockMinimo) {
            throw new AppError_1.AppError('El stock máximo no puede ser menor que el stock mínimo.', 400);
        }
    }
    async obtenerTodos(usuario, query) {
        const { page, limit, skip, take, search, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
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
            ...(0, search_1.buildSearch)(search, [
                'nombre',
                'descripcion',
                'codigo',
                'sku',
                'codigoBarras'
            ])
        };
        const [productos, total] = await prisma_1.default.$transaction([
            prisma_1.default.producto.findMany({
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
            prisma_1.default.producto.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(productos, total, page, limit);
    }
    async obtenerPorId(id, usuario) {
        return this.obtenerProducto(id, usuario);
    }
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        await this.validarEmpresa(empresaId);
        await this.validarCategoria(data.categoriaId, empresaId);
        await this.validarMarca(data.marcaId, empresaId);
        this.validarPrecios(data.precioCompra, data.precioVenta);
        this.validarStock(data.stockMinimo, data.stockMaximo);
        const codigo = await this.generarCodigo(empresaId);
        const sku = await this.generarSku(empresaId);
        const codigoBarras = await this.generarCodigoBarras(empresaId);
        return await prisma_1.default.producto.create({
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
    async actualizar(id, data, usuario) {
        const producto = await this.obtenerProducto(id, usuario);
        if (data.categoriaId !== undefined) {
            await this.validarCategoria(data.categoriaId, usuario.empresaId);
        }
        if (data.marcaId !== undefined) {
            await this.validarMarca(data.marcaId, usuario.empresaId);
        }
        this.validarPrecios(data.precioCompra, data.precioVenta);
        this.validarStock(data.stockMinimo, data.stockMaximo);
        const precioCompra = data.precioCompra ??
            producto.precioCompra;
        const precioVenta = data.precioVenta ??
            producto.precioVenta;
        const stockMinimo = data.stockMinimo ??
            producto.stockMinimo;
        const stockMaximo = data.stockMaximo ??
            producto.stockMaximo;
        this.validarPrecios(Number(precioCompra), Number(precioVenta));
        this.validarStock(stockMinimo, stockMaximo ?? undefined);
        return await prisma_1.default.producto.update({
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
    async eliminar(id, usuario) {
        const producto = await this.obtenerProducto(id, usuario);
        if (!producto.estado) {
            throw new AppError_1.AppError('El producto ya está desactivado.', 400);
        }
        return await prisma_1.default.producto.update({
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
    async reactivar(id, usuario) {
        const producto = await this.obtenerProducto(id, usuario);
        if (producto.estado) {
            throw new AppError_1.AppError('El producto ya se encuentra activo.', 400);
        }
        return await prisma_1.default.producto.update({
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
exports.ProductoService = ProductoService;
