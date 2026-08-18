"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarClienteSchema = exports.CrearClienteSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
=================== CREAR CLIENTE =====================
=====================================================*/
exports.CrearClienteSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.'),
    apellido: zod_1.z
        .string()
        .trim()
        .min(2, 'El apellido debe tener al menos 2 caracteres.')
        .max(100, 'El apellido no puede superar los 100 caracteres.'),
    tipoIdentificacion: zod_1.z
        .enum([
        'CEDULA',
        'RUC',
        'PASAPORTE',
        'OTRO'
    ], {
        message: 'Tipo de identificación inválido.'
    }),
    identificacion: zod_1.z
        .string()
        .trim()
        .min(3, 'La identificación es obligatoria.')
        .max(20, 'La identificación no puede superar los 20 caracteres.'),
    tipoCliente: zod_1.z
        .enum([
        'PERSONA',
        'EMPRESA'
    ], {
        message: 'Tipo de cliente inválido.'
    })
        .optional()
        .default('PERSONA'),
    razonSocial: zod_1.z
        .string()
        .trim()
        .max(150, 'La razón social no puede superar los 150 caracteres.')
        .optional(),
    nombreComercial: zod_1.z
        .string()
        .trim()
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.')
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
    direccion: zod_1.z
        .string()
        .trim()
        .max(255, 'La dirección no puede superar los 255 caracteres.')
        .optional(),
    limiteCredito: zod_1.z
        .number()
        .finite('El límite de crédito debe ser un número válido.')
        .min(0, 'El límite de crédito no puede ser negativo.')
        .optional(),
    diasCredito: zod_1.z
        .number()
        .int('Los días de crédito deben ser un número entero.')
        .min(0, 'Los días de crédito no pueden ser negativos.')
        .optional(),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional()
        .default(true),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
}).strict();
/*=====================================================
================ ACTUALIZAR CLIENTE ===================
=====================================================*/
exports.ActualizarClienteSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.')
        .optional(),
    apellido: zod_1.z
        .string()
        .trim()
        .min(2, 'El apellido debe tener al menos 2 caracteres.')
        .max(100, 'El apellido no puede superar los 100 caracteres.')
        .optional(),
    tipoIdentificacion: zod_1.z
        .enum([
        'CEDULA',
        'RUC',
        'PASAPORTE',
        'OTRO'
    ], {
        message: 'Tipo de identificación inválido.'
    })
        .optional(),
    identificacion: zod_1.z
        .string()
        .trim()
        .min(3, 'La identificación es obligatoria.')
        .max(20, 'La identificación no puede superar los 20 caracteres.')
        .optional(),
    tipoCliente: zod_1.z
        .enum([
        'PERSONA',
        'EMPRESA'
    ], {
        message: 'Tipo de cliente inválido.'
    })
        .optional(),
    razonSocial: zod_1.z
        .string()
        .trim()
        .max(150, 'La razón social no puede superar los 150 caracteres.')
        .optional(),
    nombreComercial: zod_1.z
        .string()
        .trim()
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.')
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
    direccion: zod_1.z
        .string()
        .trim()
        .max(255, 'La dirección no puede superar los 255 caracteres.')
        .optional(),
    limiteCredito: zod_1.z
        .number()
        .finite('El límite de crédito debe ser un número válido.')
        .min(0, 'El límite de crédito no puede ser negativo.')
        .optional(),
    diasCredito: zod_1.z
        .number()
        .int('Los días de crédito deben ser un número entero.')
        .min(0, 'Los días de crédito no pueden ser negativos.')
        .optional(),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional(),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
        .optional()
}).strict();
