"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarMarcaSchema = exports.CrearMarcaSchema = void 0;
const zod_1 = require("zod");
exports.CrearMarcaSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.'),
    descripcion: zod_1.z
        .string()
        .trim()
        .max(255, 'La descripción no puede superar los 255 caracteres.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional()
        .default(true),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
}).strict();
exports.ActualizarMarcaSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.')
        .optional(),
    descripcion: zod_1.z
        .string()
        .trim()
        .max(255, 'La descripción no puede superar los 255 caracteres.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional(),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
        .optional()
}).strict();
