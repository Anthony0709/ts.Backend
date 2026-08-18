"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarProveedorSchema = exports.CrearProveedorSchema = void 0;
const zod_1 = require("zod");
exports.CrearProveedorSchema = zod_1.z.object({
    nombreComercial: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre comercial debe tener al menos 2 caracteres.')
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.'),
    razonSocial: zod_1.z
        .string()
        .trim()
        .min(2, 'La razón social debe tener al menos 2 caracteres.')
        .max(150, 'La razón social no puede superar los 150 caracteres.'),
    ruc: zod_1.z
        .string()
        .trim()
        .min(10, 'El RUC debe tener al menos 10 caracteres.')
        .max(20, 'El RUC no puede superar los 20 caracteres.'),
    contacto: zod_1.z
        .string()
        .trim()
        .max(150, 'El contacto no puede superar los 150 caracteres.')
        .optional(),
    cargoContacto: zod_1.z
        .string()
        .trim()
        .max(100, 'El cargo del contacto no puede superar los 100 caracteres.')
        .optional(),
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.')
        .optional()
        .or(zod_1.z.literal('')),
    telefono: zod_1.z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    celular: zod_1.z
        .string()
        .trim()
        .max(20, 'El celular no puede superar los 20 caracteres.')
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
    provincia: zod_1.z
        .string()
        .trim()
        .max(100, 'La provincia no puede superar los 100 caracteres.')
        .optional(),
    pais: zod_1.z
        .string()
        .trim()
        .max(100, 'El país no puede superar los 100 caracteres.')
        .optional()
        .default('Ecuador'),
    observaciones: zod_1.z
        .string()
        .trim()
        .max(500, 'Las observaciones no pueden superar los 500 caracteres.')
        .optional(),
    diasCredito: zod_1.z
        .number()
        .int('Los días de crédito deben ser un número entero.')
        .min(0, 'Los días de crédito no pueden ser negativos.')
        .optional()
        .default(0),
    limiteCredito: zod_1.z
        .number()
        .finite('El límite de crédito debe ser un número válido.')
        .min(0, 'El límite de crédito no puede ser negativo.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional()
        .default(true),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
}).strict();
exports.ActualizarProveedorSchema = zod_1.z.object({
    nombreComercial: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre comercial debe tener al menos 2 caracteres.')
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.')
        .optional(),
    razonSocial: zod_1.z
        .string()
        .trim()
        .min(2, 'La razón social debe tener al menos 2 caracteres.')
        .max(150, 'La razón social no puede superar los 150 caracteres.')
        .optional(),
    ruc: zod_1.z
        .string()
        .trim()
        .min(10, 'El RUC debe tener al menos 10 caracteres.')
        .max(20, 'El RUC no puede superar los 20 caracteres.')
        .optional(),
    contacto: zod_1.z
        .string()
        .trim()
        .max(150, 'El contacto no puede superar los 150 caracteres.')
        .optional(),
    cargoContacto: zod_1.z
        .string()
        .trim()
        .max(100, 'El cargo del contacto no puede superar los 100 caracteres.')
        .optional(),
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.')
        .optional()
        .or(zod_1.z.literal('')),
    telefono: zod_1.z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    celular: zod_1.z
        .string()
        .trim()
        .max(20, 'El celular no puede superar los 20 caracteres.')
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
    provincia: zod_1.z
        .string()
        .trim()
        .max(100, 'La provincia no puede superar los 100 caracteres.')
        .optional(),
    pais: zod_1.z
        .string()
        .trim()
        .max(100, 'El país no puede superar los 100 caracteres.')
        .optional(),
    observaciones: zod_1.z
        .string()
        .trim()
        .max(500, 'Las observaciones no pueden superar los 500 caracteres.')
        .optional(),
    diasCredito: zod_1.z
        .number()
        .int('Los días de crédito deben ser un número entero.')
        .min(0, 'Los días de crédito no pueden ser negativos.')
        .optional(),
    limiteCredito: zod_1.z
        .number()
        .finite('El límite de crédito debe ser un número válido.')
        .min(0, 'El límite de crédito no puede ser negativo.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional(),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
        .optional()
}).strict();
