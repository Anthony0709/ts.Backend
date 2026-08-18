"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CambiarEstadoSuscripcionSchema = exports.ObtenerSuscripcionSchema = exports.ConsultarSuscripcionesSchema = exports.ActualizarSuscripcionSchema = exports.CrearSuscripcionSchema = void 0;
const zod_1 = require("zod");
exports.CrearSuscripcionSchema = zod_1.z.object({
    empresaId: zod_1.z.string().cuid('La empresa no es válida.'),
    planId: zod_1.z.string().cuid('El plan no es válido.'),
    fechaInicio: zod_1.z.coerce.date(),
    fechaFin: zod_1.z.coerce.date().optional(),
    precio: zod_1.z.number().finite('El precio debe ser un número válido.').min(0, 'El precio no puede ser negativo.'),
    renovacionAutomatica: zod_1.z.boolean().default(true)
}).strict().superRefine((data, ctx) => {
    if (data.fechaFin && data.fechaFin < data.fechaInicio) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaFin'],
            message: 'La fecha de fin no puede ser anterior a la fecha de inicio.'
        });
    }
});
exports.ActualizarSuscripcionSchema = zod_1.z.object({
    planId: zod_1.z.string().cuid('El plan no es válido.').optional(),
    fechaInicio: zod_1.z.coerce.date().optional(),
    fechaFin: zod_1.z.coerce.date().nullable().optional(),
    precio: zod_1.z.number().finite('El precio debe ser un número válido.').min(0, 'El precio no puede ser negativo.').optional(),
    renovacionAutomatica: zod_1.z.boolean().optional()
}).strict().superRefine((data, ctx) => {
    if (data.fechaInicio && data.fechaFin && data.fechaFin < data.fechaInicio) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaFin'],
            message: 'La fecha de fin no puede ser anterior a la fecha de inicio.'
        });
    }
});
exports.ConsultarSuscripcionesSchema = zod_1.z.object({
    empresaId: zod_1.z.string().cuid('La empresa no es válida.').optional(),
    planId: zod_1.z.string().cuid('El plan no es válido.').optional(),
    estado: zod_1.z.enum(['ACTIVA', 'VENCIDA', 'CANCELADA', 'SUSPENDIDA'], {
        message: 'El estado de la suscripción no es válido.'
    }).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10)
}).strict();
exports.ObtenerSuscripcionSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('El ID de la suscripción no es válido.')
}).strict();
exports.CambiarEstadoSuscripcionSchema = zod_1.z.object({
    estado: zod_1.z.enum(['ACTIVA', 'VENCIDA', 'CANCELADA', 'SUSPENDIDA'], {
        message: 'El estado de la suscripción no es válido.'
    })
}).strict();
