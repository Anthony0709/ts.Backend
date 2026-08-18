"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarBodegasSchema = exports.ActualizarBodegaSchema = exports.CrearBodegaSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
===================== CREAR BODEGA ====================
=====================================================*/
exports.CrearBodegaSchema = zod_1.z.object({
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
    responsable: zod_1.z
        .string()
        .trim()
        .max(150, 'El responsable no puede superar los 150 caracteres.')
        .optional(),
    telefono: zod_1.z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    sucursalId: zod_1.z
        .string()
        .cuid('La sucursal no es válida.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional()
}).strict();
/*=====================================================
=================== ACTUALIZAR BODEGA =================
=====================================================*/
exports.ActualizarBodegaSchema = zod_1.z.object({
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
    responsable: zod_1.z
        .string()
        .trim()
        .max(150, 'El responsable no puede superar los 150 caracteres.')
        .optional(),
    telefono: zod_1.z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    sucursalId: zod_1.z
        .string()
        .cuid('La sucursal no es válida.')
        .nullable()
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional()
}).strict();
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.ConsultarBodegasSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .optional(),
    codigo: zod_1.z
        .string()
        .trim()
        .optional(),
    sucursalId: zod_1.z
        .string()
        .cuid('La sucursal no es válida.')
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
