import { z } from 'zod';

export const CrearNotificacionSchema = z.object({
    titulo: z.string().trim().min(1, 'El título es obligatorio.').max(150, 'El título no puede superar los 150 caracteres.'),
    mensaje: z.string().trim().min(1, 'El mensaje es obligatorio.').max(1000, 'El mensaje no puede superar los 1000 caracteres.'),
    tipo: z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS'], {
        message: 'El tipo de notificación no es válido.'
    }).default('INFO'),
    usuarioId: z.string().cuid('El usuario no es válido.').optional()
}).strict();

export const ActualizarNotificacionSchema = z.object({
    titulo: z.string().trim().min(1, 'El título es obligatorio.').max(150).optional(),
    mensaje: z.string().trim().min(1, 'El mensaje es obligatorio.').max(1000).optional(),
    tipo: z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS'], {
        message: 'El tipo de notificación no es válido.'
    }).optional(),
    leida: z.boolean().optional()
}).strict();

export const ConsultarNotificacionesSchema = z.object({
    usuarioId: z.string().cuid('El usuario no es válido.').optional(),
    tipo: z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS'], {
        message: 'El tipo de notificación no es válido.'
    }).optional(),
    leida: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
}).strict();

export const ObtenerNotificacionSchema = z.object({
    id: z.string().cuid('El ID de la notificación no es válido.')
}).strict();

export const MarcarNotificacionSchema = z.object({
    leida: z.boolean().default(true)
}).strict();

export type CrearNotificacionDto = z.infer<typeof CrearNotificacionSchema>;
export type ActualizarNotificacionDto = z.infer<typeof ActualizarNotificacionSchema>;
export type ConsultarNotificacionesDto = z.infer<typeof ConsultarNotificacionesSchema>;
export type ObtenerNotificacionDto = z.infer<typeof ObtenerNotificacionSchema>;
export type MarcarNotificacionDto = z.infer<typeof MarcarNotificacionSchema>;