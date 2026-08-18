"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarRolSchema = exports.CrearRolSchema = void 0;
const zod_1 = require("zod");
/*=====================================================*
*==================== CREAR ROL =======================*
*=====================================================*/
exports.CrearRolSchema = zod_1.z.object({
    codigo: zod_1.z
        .string()
        .trim()
        .max(20, 'El código no puede superar los 20 caracteres.')
        .optional(),
    nombre: zod_1.z
        .string()
        .trim()
        .min(1, 'El nombre es obligatorio.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.'),
    descripcion: zod_1.z
        .string()
        .trim()
        .max(255, 'La descripción no puede superar los 255 caracteres.')
        .optional(),
    empresaId: zod_1.z
        .string()
        .min(1, 'La empresa es obligatoria.')
        .cuid('ID de empresa inválido.'),
    activo: zod_1.z
        .boolean()
        .optional()
        .default(true)
}).strict();
/*=====================================================*
*================== ACTUALIZAR ROL ====================*
*=====================================================*/
exports.ActualizarRolSchema = exports.CrearRolSchema.partial().extend({
    activo: zod_1.z
        .boolean()
        .optional()
}).strict();
