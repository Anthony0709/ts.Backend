"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarCategoriaSchema = exports.CrearCategoriaSchema = void 0;
const zod_1 = require("zod");
exports.CrearCategoriaSchema = zod_1.z.object({
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
    color: zod_1.z
        .string()
        .trim()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'El color debe tener formato hexadecimal. Ejemplo: #2563EB.')
        .optional(),
    icono: zod_1.z
        .string()
        .trim()
        .max(100, 'El icono no puede superar los 100 caracteres.')
        .optional(),
    orden: zod_1.z
        .number()
        .int('El orden debe ser un número entero.')
        .min(0, 'El orden no puede ser negativo.')
        .optional()
        .default(0),
    estado: zod_1.z
        .boolean()
        .optional()
        .default(true),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
}).strict();
exports.ActualizarCategoriaSchema = zod_1.z.object({
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
    color: zod_1.z
        .string()
        .trim()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'El color debe tener formato hexadecimal. Ejemplo: #2563EB.')
        .optional(),
    icono: zod_1.z
        .string()
        .trim()
        .max(100, 'El icono no puede superar los 100 caracteres.')
        .optional(),
    orden: zod_1.z
        .number()
        .int('El orden debe ser un número entero.')
        .min(0, 'El orden no puede ser negativo.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional(),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
        .optional()
}).strict();
