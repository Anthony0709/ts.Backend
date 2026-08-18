"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suscripcionService = exports.SuscripcionService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const query_1 = require("../../../utils/query");
const search_1 = require("../../../utils/search");
const paginatedResponse_1 = require("../../../utils/paginatedResponse");
class SuscripcionService {
    async validarEmpresa(empresaId) {
        const empresa = await prisma_1.default.empresa.findUnique({
            where: { id: empresaId }
        });
        if (!empresa) {
            throw new AppError_1.AppError('La empresa no existe.', 404);
        }
        return empresa;
    }
    async validarPlan(planId) {
        const plan = await prisma_1.default.plan.findUnique({
            where: { id: planId }
        });
        if (!plan) {
            throw new AppError_1.AppError('El plan no existe.', 404);
        }
        if (!plan.activo) {
            throw new AppError_1.AppError('El plan seleccionado está inactivo.', 400);
        }
        return plan;
    }
    async obtenerSuscripcion(id) {
        const suscripcion = await prisma_1.default.suscripcion.findUnique({
            where: { id },
            include: {
                empresa: true,
                plan: true
            }
        });
        if (!suscripcion) {
            throw new AppError_1.AppError('La suscripción no existe.', 404);
        }
        return suscripcion;
    }
    calcularFechaRenovacion(fechaInicio, tipoFacturacion) {
        const fecha = new Date(fechaInicio);
        if (tipoFacturacion === client_1.TipoFacturacion.ANUAL) {
            fecha.setFullYear(fecha.getFullYear() + 1);
        }
        else {
            fecha.setMonth(fecha.getMonth() + 1);
        }
        return fecha;
    }
    async crear(data) {
        await this.validarEmpresa(data.empresaId);
        const plan = await this.validarPlan(data.planId);
        const activa = await prisma_1.default.suscripcion.findFirst({
            where: {
                empresaId: data.empresaId,
                estado: client_1.EstadoSuscripcion.ACTIVA
            }
        });
        if (activa) {
            throw new AppError_1.AppError('La empresa ya tiene una suscripción activa.', 400);
        }
        const tipoFacturacion = client_1.TipoFacturacion.MENSUAL;
        const fechaInicio = new Date(data.fechaInicio);
        const fechaRenovacion = this.calcularFechaRenovacion(fechaInicio, tipoFacturacion);
        const precioMensual = new client_1.Prisma.Decimal(data.precio);
        const suscripcion = await prisma_1.default.suscripcion.create({
            data: {
                empresaId: data.empresaId,
                planId: data.planId,
                fechaInicio,
                fechaFin: data.fechaFin ? new Date(data.fechaFin) : null,
                fechaRenovacion,
                estado: client_1.EstadoSuscripcion.ACTIVA,
                tipoFacturacion,
                precioMensual,
                precioAnual: plan.precioAnual,
                observaciones: data.renovacionAutomatica ? 'Renovación automática activa.' : 'Renovación automática desactivada.'
            },
            include: {
                empresa: true,
                plan: true
            }
        });
        return suscripcion;
    }
    async obtenerTodos(query) {
        const { page, limit, skip, take, orderBy, search } = (0, query_1.buildQuery)(query);
        const where = {
            ...(query.empresaId ? {
                empresaId: query.empresaId
            } : {}),
            ...(query.planId ? {
                planId: query.planId
            } : {}),
            ...(query.estado ? {
                estado: query.estado
            } : {}),
            ...(0, search_1.buildSearch)(search, [])
        };
        const searchConditions = search ? {
            OR: [
                {
                    empresa: (0, search_1.buildSearch)(search, ['nombre'])
                },
                {
                    plan: (0, search_1.buildSearch)(search, ['nombre'])
                }
            ]
        } : {};
        const finalWhere = {
            ...where,
            ...searchConditions
        };
        const [suscripciones, total] = await prisma_1.default.$transaction([
            prisma_1.default.suscripcion.findMany({
                where: finalWhere,
                skip,
                take,
                orderBy,
                include: {
                    empresa: true,
                    plan: true
                }
            }),
            prisma_1.default.suscripcion.count({
                where: finalWhere
            })
        ]);
        return (0, paginatedResponse_1.paginatedResponse)(suscripciones, total, page, limit);
    }
    async obtenerPorId(id) {
        return this.obtenerSuscripcion(id);
    }
    async actualizar(id, data) {
        const actual = await this.obtenerSuscripcion(id);
        if (data.planId) {
            await this.validarPlan(data.planId);
        }
        const fechaInicio = data.fechaInicio ? new Date(data.fechaInicio) : actual.fechaInicio;
        const planId = data.planId ?? actual.planId;
        const plan = data.planId ? await this.validarPlan(planId) : actual.plan;
        const tipoFacturacion = actual.tipoFacturacion;
        const fechaRenovacion = this.calcularFechaRenovacion(fechaInicio, tipoFacturacion);
        return prisma_1.default.suscripcion.update({
            where: { id },
            data: {
                ...(data.planId !== undefined && {
                    planId: data.planId
                }),
                ...(data.fechaInicio !== undefined && {
                    fechaInicio
                }),
                ...(data.fechaFin !== undefined && {
                    fechaFin: data.fechaFin ? new Date(data.fechaFin) : null
                }),
                ...(data.precio !== undefined && {
                    precioMensual: new client_1.Prisma.Decimal(data.precio)
                }),
                fechaRenovacion,
                ...(data.renovacionAutomatica !== undefined && {
                    observaciones: data.renovacionAutomatica
                        ? 'Renovación automática activa.'
                        : 'Renovación automática desactivada.'
                }),
                ...(data.planId !== undefined && {
                    precioAnual: plan.precioAnual
                })
            },
            include: {
                empresa: true,
                plan: true
            }
        });
    }
    async cambiarEstado(id, estado) {
        const suscripcion = await this.obtenerSuscripcion(id);
        if (suscripcion.estado === estado) {
            throw new AppError_1.AppError(`La suscripción ya se encuentra en estado ${estado}.`, 400);
        }
        const data = {
            estado
        };
        if (estado === client_1.EstadoSuscripcion.CANCELADA) {
            data.fechaCancelacion = new Date();
            data.motivoCancelacion = 'Suscripción cancelada manualmente.';
        }
        else {
            data.fechaCancelacion = null;
            data.motivoCancelacion = null;
        }
        return prisma_1.default.suscripcion.update({
            where: { id },
            data,
            include: {
                empresa: true,
                plan: true
            }
        });
    }
    async cancelar(id, motivo) {
        const suscripcion = await this.obtenerSuscripcion(id);
        if (suscripcion.estado === client_1.EstadoSuscripcion.CANCELADA) {
            throw new AppError_1.AppError('La suscripción ya está cancelada.', 400);
        }
        return prisma_1.default.suscripcion.update({
            where: { id },
            data: {
                estado: client_1.EstadoSuscripcion.CANCELADA,
                fechaCancelacion: new Date(),
                motivoCancelacion: motivo?.trim() || 'Suscripción cancelada.'
            },
            include: {
                empresa: true,
                plan: true
            }
        });
    }
    async renovar(id) {
        const suscripcion = await this.obtenerSuscripcion(id);
        const nuevaFechaInicio = suscripcion.fechaRenovacion ?? new Date();
        const nuevaFechaRenovacion = this.calcularFechaRenovacion(nuevaFechaInicio, suscripcion.tipoFacturacion);
        return prisma_1.default.suscripcion.update({
            where: { id },
            data: {
                estado: client_1.EstadoSuscripcion.ACTIVA,
                fechaInicio: nuevaFechaInicio,
                fechaFin: null,
                fechaRenovacion: nuevaFechaRenovacion,
                fechaCancelacion: null,
                motivoCancelacion: null
            },
            include: {
                empresa: true,
                plan: true
            }
        });
    }
    async eliminar(id) {
        await this.obtenerSuscripcion(id);
        await prisma_1.default.suscripcion.delete({
            where: { id }
        });
        return null;
    }
}
exports.SuscripcionService = SuscripcionService;
exports.suscripcionService = new SuscripcionService();
