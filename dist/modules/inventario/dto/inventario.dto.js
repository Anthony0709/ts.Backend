"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarInventarioSchema = exports.ActualizarInventarioSchema = exports.AjustarInventarioSchema = exports.CrearInventarioSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
============== CREAR / ASIGNAR INVENTARIO =============
=====================================================*/
exports.CrearInventarioSchema = zod_1.z.object({
    productoId: zod_1.z
        .string()
        .cuid('Producto inválido.'),
    bodegaId: zod_1.z
        .string()
        .cuid('Bodega inválida.'),
    stock: zod_1.z
        .number()
        .int('El stock debe ser un número entero.')
        .min(0, 'El stock no puede ser negativo.')
        .default(0),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
}).strict();
/*=====================================================
==================== AJUSTAR STOCK ====================
=====================================================*/
exports.AjustarInventarioSchema = zod_1.z.object({
    productoId: zod_1.z
        .string()
        .cuid('Producto inválido.'),
    bodegaId: zod_1.z
        .string()
        .cuid('Bodega inválida.'),
    cantidad: zod_1.z
        .number()
        .int('La cantidad debe ser un número entero.')
        .positive('La cantidad debe ser mayor que cero.'),
    tipo: zod_1.z
        .enum([
        'ENTRADA',
        'SALIDA',
        'AJUSTE'
    ], {
        message: 'Tipo de movimiento inválido.'
    }),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional(),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
}).strict();
/*=====================================================
================ ACTUALIZAR INVENTARIO ================
=====================================================*/
exports.ActualizarInventarioSchema = zod_1.z.object({
    stock: zod_1.z
        .number()
        .finite('El stock debe ser un número válido.')
        .min(0, 'El stock no puede ser negativo.')
}).strict();
/*=====================================================
==================== CONSULTAR ========================
=====================================================*/
exports.ConsultarInventarioSchema = zod_1.z.object({
    productoId: zod_1.z
        .string()
        .cuid('Producto inválido.')
        .optional(),
    bodegaId: zod_1.z
        .string()
        .cuid('Bodega inválida.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional()
}).strict();
