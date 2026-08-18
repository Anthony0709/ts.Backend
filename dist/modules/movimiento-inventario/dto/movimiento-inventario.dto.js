"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarMovimientoInventarioSchema = exports.CrearMovimientoInventarioSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
========== CREAR MOVIMIENTO DE INVENTARIO =============
=====================================================*/
exports.CrearMovimientoInventarioSchema = zod_1.z.object({
    productoId: zod_1.z
        .string()
        .cuid('Producto inválido.'),
    bodegaId: zod_1.z
        .string()
        .cuid('Bodega inválida.'),
    tipo: zod_1.z
        .enum([
        'ENTRADA',
        'SALIDA',
        'AJUSTE',
        'TRANSFERENCIA'
    ], {
        message: 'Tipo de movimiento inválido.'
    }),
    cantidad: zod_1.z
        .number()
        .int('La cantidad debe ser un número entero.')
        .positive('La cantidad debe ser mayor que cero.'),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional()
}).strict();
/*=====================================================
============= CONSULTAR MOVIMIENTOS ===================
=====================================================*/
exports.ConsultarMovimientoInventarioSchema = zod_1.z.object({
    productoId: zod_1.z
        .string()
        .cuid('Producto inválido.')
        .optional(),
    bodegaId: zod_1.z
        .string()
        .cuid('Bodega inválida.')
        .optional(),
    tipo: zod_1.z
        .enum([
        'ENTRADA',
        'SALIDA',
        'AJUSTE',
        'TRANSFERENCIA'
    ], {
        message: 'Tipo de movimiento inválido.'
    })
        .optional(),
    page: zod_1.z
        .coerce
        .number()
        .int()
        .min(1)
        .optional(),
    limit: zod_1.z
        .coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
}).strict();
