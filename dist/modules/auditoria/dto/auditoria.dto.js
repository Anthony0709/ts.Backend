"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditoriaQuerySchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.AuditoriaQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce
        .number()
        .int()
        .min(1)
        .optional()
        .default(1),
    limit: zod_1.z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(10),
    search: zod_1.z
        .string()
        .trim()
        .max(150, 'La búsqueda no puede superar los 150 caracteres.')
        .optional(),
    modulo: zod_1.z
        .string()
        .trim()
        .max(100, 'El módulo no puede superar los 100 caracteres.')
        .optional(),
    accion: zod_1.z
        .nativeEnum(client_1.TipoAuditoria)
        .optional(),
    usuarioId: zod_1.z
        .string()
        .cuid('Usuario inválido.')
        .optional(),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
        .optional(),
    registroId: zod_1.z
        .string()
        .cuid('Registro inválido.')
        .optional(),
    fechaDesde: zod_1.z
        .coerce
        .date()
        .optional(),
    fechaHasta: zod_1.z
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
