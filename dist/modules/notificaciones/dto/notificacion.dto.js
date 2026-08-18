"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarcarNotificacionSchema = exports.ObtenerNotificacionSchema = exports.ConsultarNotificacionesSchema = exports.ActualizarNotificacionSchema = exports.CrearNotificacionSchema = void 0;
const zod_1 = require("zod");
exports.CrearNotificacionSchema = zod_1.z.object({
    titulo: zod_1.z.string().trim().min(1, 'El título es obligatorio.').max(150, 'El título no puede superar los 150 caracteres.'),
    mensaje: zod_1.z.string().trim().min(1, 'El mensaje es obligatorio.').max(1000, 'El mensaje no puede superar los 1000 caracteres.'),
    tipo: zod_1.z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS'], {
        message: 'El tipo de notificación no es válido.'
    }).default('INFO'),
    usuarioId: zod_1.z.string().cuid('El usuario no es válido.').optional()
}).strict();
exports.ActualizarNotificacionSchema = zod_1.z.object({
    titulo: zod_1.z.string().trim().min(1, 'El título es obligatorio.').max(150).optional(),
    mensaje: zod_1.z.string().trim().min(1, 'El mensaje es obligatorio.').max(1000).optional(),
    tipo: zod_1.z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS'], {
        message: 'El tipo de notificación no es válido.'
    }).optional(),
    leida: zod_1.z.boolean().optional()
}).strict();
exports.ConsultarNotificacionesSchema = zod_1.z.object({
    usuarioId: zod_1.z.string().cuid('El usuario no es válido.').optional(),
    tipo: zod_1.z.enum(['INFO', 'WARNING', 'ERROR', 'SUCCESS'], {
        message: 'El tipo de notificación no es válido.'
    }).optional(),
    leida: zod_1.z.coerce.boolean().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10)
}).strict();
exports.ObtenerNotificacionSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('El ID de la notificación no es válido.')
}).strict();
exports.MarcarNotificacionSchema = zod_1.z.object({
    leida: zod_1.z.boolean().default(true)
}).strict();
