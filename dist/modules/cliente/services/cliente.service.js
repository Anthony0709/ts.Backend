"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class ClienteService {
    async obtenerCliente(id, usuario) {
        const cliente = await prisma_1.default.cliente.findFirst({
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
                }
            }
        });
        if (!cliente) {
            throw new AppError_1.AppError('El cliente no existe.', 404);
        }
        return cliente;
    }
    async validarIdentificacion(empresaId, identificacion, excluirId) {
        const existe = await prisma_1.default.cliente.findFirst({
            where: {
                empresaId,
                identificacion: identificacion.trim(),
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
            throw new AppError_1.AppError('La identificación ya está registrada para esta empresa.', 400);
        }
    }
    normalizarEmail(email) {
        if (!email) {
            return undefined;
        }
        const valor = email.trim().toLowerCase();
        return valor || undefined;
    }
    validarDatosCredito(limiteCredito, diasCredito) {
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
                    nombre: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    apellido: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    identificacion: {
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
                    razonSocial: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    nombreComercial: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    telefono: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        };
    }
    async obtenerTodos(usuario, query) {
        const { page, limit, skip, take, search, orderBy } = (0, query_1.buildQuery)(query);
        const where = {
            empresaId: usuario.empresaId,
            ...(query.estado !== undefined && {
                estado: query.estado === 'true'
            }),
            ...(query.tipoCliente && {
                tipoCliente: query.tipoCliente
            }),
            ...(query.tipoIdentificacion && {
                tipoIdentificacion: query.tipoIdentificacion
            }),
            ...this.construirBusqueda(search)
        };
        const [clientes, total] = await prisma_1.default.$transaction([
            prisma_1.default.cliente.findMany({
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
            prisma_1.default.cliente.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(clientes, total, page, limit);
    }
    async obtenerPorId(id, usuario) {
        return this.obtenerCliente(id, usuario);
    }
    async crear(data, usuario) {
        const empresaId = usuario.empresaId;
        await this.validarIdentificacion(empresaId, data.identificacion);
        this.validarDatosCredito(data.limiteCredito, data.diasCredito);
        return await prisma_1.default.cliente.create({
            data: {
                nombre: data.nombre.trim(),
                apellido: data.apellido.trim(),
                tipoIdentificacion: data.tipoIdentificacion,
                identificacion: data.identificacion.trim(),
                tipoCliente: data.tipoCliente ?? 'PERSONA',
                razonSocial: data.razonSocial?.trim(),
                nombreComercial: data.nombreComercial?.trim(),
                email: this.normalizarEmail(data.email),
                telefono: data.telefono?.trim(),
                direccion: data.direccion?.trim(),
                limiteCredito: data.limiteCredito,
                diasCredito: data.diasCredito,
                observacion: data.observacion?.trim(),
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
    async actualizar(id, data, usuario) {
        const cliente = await this.obtenerCliente(id, usuario);
        if (data.identificacion !== undefined) {
            await this.validarIdentificacion(usuario.empresaId, data.identificacion, cliente.id);
        }
        this.validarDatosCredito(data.limiteCredito, data.diasCredito);
        return await prisma_1.default.cliente.update({
            where: {
                id: cliente.id
            },
            data: {
                ...(data.nombre !== undefined && {
                    nombre: data.nombre.trim()
                }),
                ...(data.apellido !== undefined && {
                    apellido: data.apellido.trim()
                }),
                ...(data.tipoIdentificacion !== undefined && {
                    tipoIdentificacion: data.tipoIdentificacion
                }),
                ...(data.identificacion !== undefined && {
                    identificacion: data.identificacion.trim()
                }),
                ...(data.tipoCliente !== undefined && {
                    tipoCliente: data.tipoCliente
                }),
                ...(data.razonSocial !== undefined && {
                    razonSocial: data.razonSocial?.trim()
                }),
                ...(data.nombreComercial !== undefined && {
                    nombreComercial: data.nombreComercial?.trim()
                }),
                ...(data.email !== undefined && {
                    email: this.normalizarEmail(data.email)
                }),
                ...(data.telefono !== undefined && {
                    telefono: data.telefono?.trim()
                }),
                ...(data.direccion !== undefined && {
                    direccion: data.direccion?.trim()
                }),
                ...(data.limiteCredito !== undefined && {
                    limiteCredito: data.limiteCredito
                }),
                ...(data.diasCredito !== undefined && {
                    diasCredito: data.diasCredito
                }),
                ...(data.observacion !== undefined && {
                    observacion: data.observacion?.trim()
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
    async eliminar(id, usuario) {
        const cliente = await this.obtenerCliente(id, usuario);
        if (!cliente.estado) {
            throw new AppError_1.AppError('El cliente ya está desactivado.', 400);
        }
        return await prisma_1.default.cliente.update({
            where: {
                id: cliente.id
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
    async reactivar(id, usuario) {
        const cliente = await this.obtenerCliente(id, usuario);
        if (cliente.estado) {
            throw new AppError_1.AppError('El cliente ya se encuentra activo.', 400);
        }
        return await prisma_1.default.cliente.update({
            where: {
                id: cliente.id
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
exports.ClienteService = ClienteService;
