import { Prisma, EstadoSuscripcion, TipoFacturacion } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearSuscripcionDto, ActualizarSuscripcionDto, ConsultarSuscripcionesDto } from '../dto/suscripcion.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { buildSearch } from '../../../utils/search';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class SuscripcionService {
    private async validarEmpresa(empresaId: string) {
        const empresa = await prisma.empresa.findUnique({
            where: { id: empresaId }
        });
        if (!empresa) {
            throw new AppError('La empresa no existe.', 404);
        }
        return empresa;
    }
    private async validarPlan(planId: string) {
        const plan = await prisma.plan.findUnique({
            where: { id: planId }
        });
        if (!plan) {
            throw new AppError('El plan no existe.', 404);
        }
        if (!plan.activo) {
            throw new AppError('El plan seleccionado está inactivo.', 400);
        }
        return plan;
    }
    private async obtenerSuscripcion(id: string) {
        const suscripcion = await prisma.suscripcion.findUnique({
            where: { id },
            include: {
                empresa: true,
                plan: true
            }
        });
        if (!suscripcion) {
            throw new AppError('La suscripción no existe.', 404);
        }
        return suscripcion;
    }
    private calcularFechaRenovacion(fechaInicio: Date, tipoFacturacion: TipoFacturacion) {
        const fecha = new Date(fechaInicio);
        if (tipoFacturacion === TipoFacturacion.ANUAL) {
            fecha.setFullYear(fecha.getFullYear() + 1);
        } else {
            fecha.setMonth(fecha.getMonth() + 1);
        }
        return fecha;
    }
    async crear(data: CrearSuscripcionDto) {
        await this.validarEmpresa(data.empresaId);
        const plan = await this.validarPlan(data.planId);
        const activa = await prisma.suscripcion.findFirst({
            where: {
                empresaId: data.empresaId,
                estado: EstadoSuscripcion.ACTIVA
            }
        });
        if (activa) {
            throw new AppError('La empresa ya tiene una suscripción activa.', 400);
        }
        const tipoFacturacion = TipoFacturacion.MENSUAL;
        const fechaInicio = new Date(data.fechaInicio);
        const fechaRenovacion = this.calcularFechaRenovacion(fechaInicio, tipoFacturacion);
        const precioMensual = new Prisma.Decimal(data.precio);
        const suscripcion = await prisma.suscripcion.create({
            data: {
                empresaId: data.empresaId,
                planId: data.planId,
                fechaInicio,
                fechaFin: data.fechaFin ? new Date(data.fechaFin) : null,
                fechaRenovacion,
                estado: EstadoSuscripcion.ACTIVA,
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
    async obtenerTodos(query: ConsultarSuscripcionesDto) {
        const { page, limit, skip, take, orderBy, search } = buildQuery(query);
        const where: Prisma.SuscripcionWhereInput = {
            ...(query.empresaId ? {
                empresaId: query.empresaId
            } : {}),
            ...(query.planId ? {
                planId: query.planId
            } : {}),
            ...(query.estado ? {
                estado: query.estado as EstadoSuscripcion
            } : {}),
            ...buildSearch(search, [])
        };
        const searchConditions = search ? {
            OR: [
                {
                    empresa: buildSearch(search, ['nombre'])
                },
                {
                    plan: buildSearch(search, ['nombre'])
                }
            ]
        } : {};
        const finalWhere: Prisma.SuscripcionWhereInput = {
            ...where,
            ...searchConditions
        };
        const [suscripciones, total] = await prisma.$transaction([
            prisma.suscripcion.findMany({
                where: finalWhere,
                skip,
                take,
                orderBy,
                include: {
                    empresa: true,
                    plan: true
                }
            }),
            prisma.suscripcion.count({
                where: finalWhere
            })
        ]);
        return paginatedResponse(
            suscripciones,
            total,
            page,
            limit
        );
    }
    async obtenerPorId(id: string) {
        return this.obtenerSuscripcion(id);
    }
    async actualizar(id: string, data: ActualizarSuscripcionDto) {
        const actual = await this.obtenerSuscripcion(id);
        if (data.planId) {
            await this.validarPlan(data.planId);
        }
        const fechaInicio = data.fechaInicio ? new Date(data.fechaInicio) : actual.fechaInicio;
        const planId = data.planId ?? actual.planId;
        const plan = data.planId ? await this.validarPlan(planId) : actual.plan;
        const tipoFacturacion = actual.tipoFacturacion;
        const fechaRenovacion = this.calcularFechaRenovacion(fechaInicio, tipoFacturacion);
        return prisma.suscripcion.update({
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
                    precioMensual: new Prisma.Decimal(data.precio)
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
    async cambiarEstado(id: string, estado: EstadoSuscripcion) {
        const suscripcion = await this.obtenerSuscripcion(id);
        if (suscripcion.estado === estado) {
            throw new AppError(`La suscripción ya se encuentra en estado ${estado}.`, 400);
        }
        const data: Prisma.SuscripcionUpdateInput = {
            estado
        };
        if (estado === EstadoSuscripcion.CANCELADA) {
            data.fechaCancelacion = new Date();
            data.motivoCancelacion = 'Suscripción cancelada manualmente.';
        } else {
            data.fechaCancelacion = null;
            data.motivoCancelacion = null;
        }
        return prisma.suscripcion.update({
            where: { id },
            data,
            include: {
                empresa: true,
                plan: true
            }
        });
    }
    async cancelar(id: string, motivo?: string) {
        const suscripcion = await this.obtenerSuscripcion(id);
        if (suscripcion.estado === EstadoSuscripcion.CANCELADA) {
            throw new AppError('La suscripción ya está cancelada.', 400);
        }
        return prisma.suscripcion.update({
            where: { id },
            data: {
                estado: EstadoSuscripcion.CANCELADA,
                fechaCancelacion: new Date(),
                motivoCancelacion: motivo?.trim() || 'Suscripción cancelada.'
            },
            include: {
                empresa: true,
                plan: true
            }
        });
    }
    async renovar(id: string) {
        const suscripcion = await this.obtenerSuscripcion(id);
        const nuevaFechaInicio = suscripcion.fechaRenovacion ?? new Date();
        const nuevaFechaRenovacion = this.calcularFechaRenovacion(
            nuevaFechaInicio,
            suscripcion.tipoFacturacion
        );
        return prisma.suscripcion.update({
            where: { id },
            data: {
                estado: EstadoSuscripcion.ACTIVA,
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
    async eliminar(id: string) {
        await this.obtenerSuscripcion(id);
        await prisma.suscripcion.delete({
            where: { id }
        });
        return null;
    }
}
export const suscripcionService = new SuscripcionService();