"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarTransferenciasSchema = exports.CrearTransferenciaSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
================ CREAR TRANSFERENCIA ==================
=====================================================*/
exports.CrearTransferenciaSchema = zod_1.z.object({
    productoId: zod_1.z
        .string()
        .cuid('Producto inválido.'),
    bodegaOrigenId: zod_1.z
        .string()
        .cuid('Bodega de origen inválida.'),
    bodegaDestinoId: zod_1.z
        .string()
        .cuid('Bodega de destino inválida.'),
    cantidad: zod_1.z
        .number()
        .int('La cantidad debe ser un número entero.')
        .positive('La cantidad debe ser mayor que cero.'),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional()
}).strict().refine(data => data.bodegaOrigenId !== data.bodegaDestinoId, {
    message: 'La bodega de origen y destino deben ser diferentes.',
    path: ['bodegaDestinoId']
});
/*=====================================================
================== CONSULTAR TRANSFERENCIAS ===========
=====================================================*/
exports.ConsultarTransferenciasSchema = zod_1.z.object({
    productoId: zod_1.z
        .string()
        .cuid('Producto inválido.')
        .optional(),
    bodegaOrigenId: zod_1.z
        .string()
        .cuid('Bodega de origen inválida.')
        .optional(),
    bodegaDestinoId: zod_1.z
        .string()
        .cuid('Bodega de destino inválida.')
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
