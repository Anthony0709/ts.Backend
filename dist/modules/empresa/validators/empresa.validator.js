"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarEmpresaSchema = exports.crearEmpresaSchema = void 0;
const zod_1 = require("zod");
exports.crearEmpresaSchema = zod_1.z.object({
    nombre: zod_1.z
        .string({
        message: 'El nombre es obligatorio.'
    })
        .trim()
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(150, 'El nombre no puede superar los 150 caracteres.'),
    nombreComercial: zod_1.z
        .string()
        .trim()
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.')
        .optional(),
    ruc: zod_1.z
        .string({
        message: 'El RUC es obligatorio.'
    })
        .trim()
        .min(10, 'El RUC debe tener al menos 10 caracteres.')
        .max(20, 'El RUC no puede superar los 20 caracteres.'),
    email: zod_1.z
        .string()
        .trim()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.')
        .optional(),
    telefono: zod_1.z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    direccion: zod_1.z
        .string()
        .trim()
        .max(255, 'La dirección no puede superar los 255 caracteres.')
        .optional(),
    ciudad: zod_1.z
        .string()
        .trim()
        .max(100, 'La ciudad no puede superar los 100 caracteres.')
        .optional(),
    pais: zod_1.z
        .string()
        .trim()
        .max(100, 'El país no puede superar los 100 caracteres.')
        .optional(),
    sitioWeb: zod_1.z
        .string()
        .trim()
        .url('Sitio web inválido.')
        .max(255, 'El sitio web no puede superar los 255 caracteres.')
        .optional()
}).strict();
exports.actualizarEmpresaSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(150, 'El nombre no puede superar los 150 caracteres.')
        .optional(),
    nombreComercial: zod_1.z
        .string()
        .trim()
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.')
        .optional(),
    ruc: zod_1.z
        .string()
        .trim()
        .min(10, 'El RUC debe tener al menos 10 caracteres.')
        .max(20, 'El RUC no puede superar los 20 caracteres.')
        .optional(),
    email: zod_1.z
        .string()
        .trim()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.')
        .optional(),
    telefono: zod_1.z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    direccion: zod_1.z
        .string()
        .trim()
        .max(255, 'La dirección no puede superar los 255 caracteres.')
        .optional(),
    ciudad: zod_1.z
        .string()
        .trim()
        .max(100, 'La ciudad no puede superar los 100 caracteres.')
        .optional(),
    pais: zod_1.z
        .string()
        .trim()
        .max(100, 'El país no puede superar los 100 caracteres.')
        .optional(),
    sitioWeb: zod_1.z
        .string()
        .trim()
        .url('Sitio web inválido.')
        .max(255, 'El sitio web no puede superar los 255 caracteres.')
        .optional(),
    activo: zod_1.z
        .boolean()
        .optional()
}).strict();
