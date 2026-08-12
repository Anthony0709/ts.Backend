import { z } from 'zod';

export const CrearSuscripcionSchema = z.object({
    empresaId: z.string().cuid('La empresa no es válida.'),
    planId: z.string().cuid('El plan no es válido.'),
    fechaInicio: z.coerce.date(),
    fechaFin: z.coerce.date().optional(),
    precio: z.number().finite('El precio debe ser un número válido.').min(0, 'El precio no puede ser negativo.'),
    renovacionAutomatica: z.boolean().default(true)
}).strict().superRefine((data, ctx) => {
    if (data.fechaFin && data.fechaFin < data.fechaInicio) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaFin'],
            message: 'La fecha de fin no puede ser anterior a la fecha de inicio.'
        });
    }
});

export const ActualizarSuscripcionSchema = z.object({
    planId: z.string().cuid('El plan no es válido.').optional(),
    fechaInicio: z.coerce.date().optional(),
    fechaFin: z.coerce.date().nullable().optional(),
    precio: z.number().finite('El precio debe ser un número válido.').min(0, 'El precio no puede ser negativo.').optional(),
    renovacionAutomatica: z.boolean().optional()
}).strict().superRefine((data, ctx) => {
    if (data.fechaInicio && data.fechaFin && data.fechaFin < data.fechaInicio) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaFin'],
            message: 'La fecha de fin no puede ser anterior a la fecha de inicio.'
        });
    }
});

export const ConsultarSuscripcionesSchema = z.object({
    empresaId: z.string().cuid('La empresa no es válida.').optional(),
    planId: z.string().cuid('El plan no es válido.').optional(),
    estado: z.enum(['ACTIVA', 'VENCIDA', 'CANCELADA', 'SUSPENDIDA'], {
        message: 'El estado de la suscripción no es válido.'
    }).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
}).strict();

export const ObtenerSuscripcionSchema = z.object({
    id: z.string().cuid('El ID de la suscripción no es válido.')
}).strict();

export const CambiarEstadoSuscripcionSchema = z.object({
    estado: z.enum(['ACTIVA', 'VENCIDA', 'CANCELADA', 'SUSPENDIDA'], {
        message: 'El estado de la suscripción no es válido.'
    })
}).strict();

export type CrearSuscripcionDto = z.infer<typeof CrearSuscripcionSchema>;
export type ActualizarSuscripcionDto = z.infer<typeof ActualizarSuscripcionSchema>;
export type ConsultarSuscripcionesDto = z.infer<typeof ConsultarSuscripcionesSchema>;
export type ObtenerSuscripcionDto = z.infer<typeof ObtenerSuscripcionSchema>;
export type CambiarEstadoSuscripcionDto = z.infer<typeof CambiarEstadoSuscripcionSchema>;