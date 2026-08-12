import { z } from 'zod';
import { TipoAuditoria } from '@prisma/client';

export const AuditoriaQuerySchema = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1)
        .optional()
        .default(1),
    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(10),
    search: z
        .string()
        .trim()
        .max(150, 'La búsqueda no puede superar los 150 caracteres.')
        .optional(),
    modulo: z
        .string()
        .trim()
        .max(100, 'El módulo no puede superar los 100 caracteres.')
        .optional(),
    accion: z
        .nativeEnum(TipoAuditoria)
        .optional(),
    usuarioId: z
        .string()
        .cuid('Usuario inválido.')
        .optional(),
    empresaId: z
        .string()
        .cuid('Empresa inválida.')
        .optional(),
    registroId: z
        .string()
        .cuid('Registro inválido.')
        .optional(),
    fechaDesde: z
        .coerce
        .date()
        .optional(),
    fechaHasta: z
        .coerce
        .date()
        .optional()
}).strict().superRefine((data, ctx) => {
    if (data.fechaDesde && data.fechaHasta) {
        if (data.fechaDesde > data.fechaHasta) {
            ctx.addIssue({
                code: 'custom',
                path: ['fechaHasta'],
                message: 'La fecha hasta no puede ser menor que la fecha desde.'
            });
        }
    }
});

export type AuditoriaQueryDto =
    z.infer<typeof AuditoriaQuerySchema>;