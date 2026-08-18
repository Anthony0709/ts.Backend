"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const search_1 = require("../../../utils/search");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class EmpresaService {
    async obtenerEmpresa(id) {
        const empresa = await prisma_1.default.empresa.findUnique({
            where: { id }
        });
        if (!empresa) {
            throw new AppError_1.AppError('Empresa no encontrada.', 404);
        }
        return empresa;
    }
    normalizarEmail(email) {
        return email?.trim().toLowerCase();
    }
    async validarNombre(nombre, id) {
        const existe = await prisma_1.default.empresa.findFirst({
            where: {
                nombre: {
                    equals: nombre.trim(),
                    mode: 'insensitive'
                },
                ...(id ? { NOT: { id } } : {})
            }
        });
        if (existe) {
            throw new AppError_1.AppError('Ya existe una empresa con ese nombre.', 409);
        }
    }
    async validarRuc(ruc, id) {
        const existe = await prisma_1.default.empresa.findFirst({
            where: {
                ruc: ruc.trim(),
                ...(id ? { NOT: { id } } : {})
            }
        });
        if (existe) {
            throw new AppError_1.AppError('El RUC ya está registrado.', 409);
        }
    }
    async validarEmail(email, id) {
        if (!email)
            return;
        const emailNormalizado = this.normalizarEmail(email);
        const existe = await prisma_1.default.empresa.findFirst({
            where: {
                email: {
                    equals: emailNormalizado,
                    mode: 'insensitive'
                },
                ...(id ? { NOT: { id } } : {})
            }
        });
        if (existe) {
            throw new AppError_1.AppError('El correo electrónico ya está registrado.', 409);
        }
    }
    obtenerOrderBy(orderBy, order) {
        const camposPermitidos = [
            'nombre',
            'nombreComercial',
            'ruc',
            'email',
            'ciudad',
            'pais',
            'activo',
            'createdAt',
            'updatedAt'
        ];
        const campo = orderBy && camposPermitidos.includes(orderBy)
            ? orderBy
            : 'createdAt';
        return {
            [campo]: order === 'asc'
                ? 'asc'
                : 'desc'
        };
    }
    async obtenerTodos(query) {
        const { page, limit, search, skip, take } = (0, query_1.buildQuery)(query);
        const where = {
            ...(query.activo !== undefined && {
                activo: query.activo === true ||
                    query.activo === 'true'
            }),
            ...(query.pais && {
                pais: query.pais
            }),
            ...(query.ciudad && {
                ciudad: query.ciudad
            }),
            ...(0, search_1.buildSearch)(search, [
                'nombre',
                'nombreComercial',
                'ruc',
                'email'
            ])
        };
        const orderBy = this.obtenerOrderBy(query.orderBy, query.order);
        const [empresas, total] = await prisma_1.default.$transaction([
            prisma_1.default.empresa.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    configuracion: true
                }
            }),
            prisma_1.default.empresa.count({
                where
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(empresas, total, page, limit);
    }
    async obtenerPorId(id) {
        const empresa = await prisma_1.default.empresa.findUnique({
            where: { id },
            include: {
                configuracion: true
            }
        });
        if (!empresa) {
            throw new AppError_1.AppError('Empresa no encontrada.', 404);
        }
        return empresa;
    }
    async crear(data, usuario) {
        const nombre = data.nombre.trim();
        const ruc = data.ruc.trim();
        const email = this.normalizarEmail(data.email);
        await this.validarNombre(nombre);
        await this.validarRuc(ruc);
        await this.validarEmail(email);
        return await prisma_1.default.$transaction(async (tx) => {
            const empresa = await tx.empresa.create({
                data: {
                    nombre,
                    nombreComercial: data.nombreComercial?.trim(),
                    ruc,
                    email,
                    telefono: data.telefono?.trim(),
                    direccion: data.direccion?.trim(),
                    ciudad: data.ciudad?.trim(),
                    pais: data.pais?.trim(),
                    sitioWeb: data.sitioWeb?.trim()
                }
            });
            await tx.configuracion.create({
                data: {
                    empresaId: empresa.id
                }
            });
            await tx.auditoria.create({
                data: {
                    empresaId: empresa.id,
                    usuarioId: usuario.id,
                    modulo: 'EMPRESA',
                    accion: client_1.TipoAuditoria.CREATE,
                    descripcion: `Empresa "${empresa.nombre}" creada.`,
                    registroId: empresa.id
                }
            });
            return tx.empresa.findUnique({
                where: {
                    id: empresa.id
                },
                include: {
                    configuracion: true
                }
            });
        });
    }
    async actualizar(id, data, usuario) {
        const empresa = await this.obtenerEmpresa(id);
        if (data.nombre) {
            await this.validarNombre(data.nombre, id);
        }
        if (data.ruc) {
            await this.validarRuc(data.ruc, id);
        }
        if (data.email) {
            await this.validarEmail(data.email, id);
        }
        const actualizada = await prisma_1.default.$transaction(async (tx) => {
            const resultado = await tx.empresa.update({
                where: { id },
                data: {
                    ...(data.nombre !== undefined && {
                        nombre: data.nombre.trim()
                    }),
                    ...(data.nombreComercial !== undefined && {
                        nombreComercial: data.nombreComercial.trim()
                    }),
                    ...(data.ruc !== undefined && {
                        ruc: data.ruc.trim()
                    }),
                    ...(data.email !== undefined && {
                        email: this.normalizarEmail(data.email)
                    }),
                    ...(data.telefono !== undefined && {
                        telefono: data.telefono.trim()
                    }),
                    ...(data.direccion !== undefined && {
                        direccion: data.direccion.trim()
                    }),
                    ...(data.ciudad !== undefined && {
                        ciudad: data.ciudad.trim()
                    }),
                    ...(data.pais !== undefined && {
                        pais: data.pais.trim()
                    }),
                    ...(data.sitioWeb !== undefined && {
                        sitioWeb: data.sitioWeb.trim()
                    }),
                    ...(data.activo !== undefined && {
                        activo: data.activo
                    })
                },
                include: {
                    configuracion: true
                }
            });
            await tx.auditoria.create({
                data: {
                    empresaId: empresa.id,
                    usuarioId: usuario.id,
                    modulo: 'EMPRESA',
                    accion: client_1.TipoAuditoria.UPDATE,
                    descripcion: `Empresa "${resultado.nombre}" actualizada.`,
                    registroId: empresa.id
                }
            });
            return resultado;
        });
        return actualizada;
    }
    async eliminar(id, usuario) {
        const empresa = await this.obtenerEmpresa(id);
        if (!empresa.activo) {
            throw new AppError_1.AppError('La empresa ya está desactivada.', 400);
        }
        const resultado = await prisma_1.default.$transaction(async (tx) => {
            const actualizada = await tx.empresa.update({
                where: { id },
                data: {
                    activo: false
                },
                include: {
                    configuracion: true
                }
            });
            await tx.auditoria.create({
                data: {
                    empresaId: empresa.id,
                    usuarioId: usuario.id,
                    modulo: 'EMPRESA',
                    accion: client_1.TipoAuditoria.DELETE,
                    descripcion: `Empresa "${empresa.nombre}" desactivada.`,
                    registroId: empresa.id
                }
            });
            return actualizada;
        });
        return resultado;
    }
    async reactivar(id, usuario) {
        const empresa = await this.obtenerEmpresa(id);
        if (empresa.activo) {
            throw new AppError_1.AppError('La empresa ya se encuentra activa.', 400);
        }
        const resultado = await prisma_1.default.$transaction(async (tx) => {
            const actualizada = await tx.empresa.update({
                where: { id },
                data: {
                    activo: true
                },
                include: {
                    configuracion: true
                }
            });
            await tx.auditoria.create({
                data: {
                    empresaId: empresa.id,
                    usuarioId: usuario.id,
                    modulo: 'EMPRESA',
                    accion: client_1.TipoAuditoria.UPDATE,
                    descripcion: `Empresa "${empresa.nombre}" reactivada.`,
                    registroId: empresa.id
                }
            });
            return actualizada;
        });
        return resultado;
    }
}
exports.EmpresaService = EmpresaService;
