"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarSucursalesSchema = exports.ActualizarSucursalSchema = exports.CrearSucursalSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
==================== CREAR SUCURSAL ===================
=====================================================*/
exports.CrearSucursalSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.'),
    codigo: zod_1.z
        .string()
        .trim()
        .min(1, 'El código es obligatorio.')
        .max(30, 'El código no puede superar los 30 caracteres.'),
    direccion: zod_1.z
        .string()
        .trim()
        .max(250, 'La dirección no puede superar los 250 caracteres.')
        .optional(),
    telefono: zod_1.z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    email: zod_1.z
        .string()
        .trim()
        .email('El correo electrónico no es válido.')
        .max(150, 'El correo no puede superar los 150 caracteres.')
        .optional(),
    ciudad: zod_1.z
        .string()
        .trim()
        .max(100, 'La ciudad no puede superar los 100 caracteres.')
        .optional(),
    bodegaPrincipalId: zod_1.z
        .string()
        .cuid('La bodega principal no es válida.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional()
}).strict();
/*=====================================================
================== ACTUALIZAR SUCURSAL ================
=====================================================*/
exports.ActualizarSucursalSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.')
        .optional(),
    codigo: zod_1.z
        .string()
        .trim()
        .min(1, 'El código es obligatorio.')
        .max(30, 'El código no puede superar los 30 caracteres.')
        .optional(),
    direccion: zod_1.z
        .string()
        .trim()
        .max(250, 'La dirección no puede superar los 250 caracteres.')
        .optional(),
    telefono: zod_1.z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    email: zod_1.z
        .string()
        .trim()
        .email('El correo electrónico no es válido.')
        .max(150, 'El correo no puede superar los 150 caracteres.')
        .optional(),
    ciudad: zod_1.z
        .string()
        .trim()
        .max(100, 'La ciudad no puede superar los 100 caracteres.')
        .optional(),
    bodegaPrincipalId: zod_1.z
        .string()
        .cuid('La bodega principal no es válida.')
        .nullable()
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional()
}).strict();
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.ConsultarSucursalesSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .optional(),
    codigo: zod_1.z
        .string()
        .trim()
        .optional(),
    ciudad: zod_1.z
        .string()
        .trim()
        .optional(),
    estado: zod_1.z
        .coerce
        .boolean()
        .optional(),
    page: zod_1.z
        .coerce
        .number()
        .int()
        .min(1, 'La página debe ser mayor que cero.')
        .optional(),
    limit: zod_1.z
        .coerce
        .number()
        .int()
        .min(1, 'El límite debe ser mayor que cero.')
        .max(100, 'El límite máximo es 100.')
        .optional()
}).strict();
