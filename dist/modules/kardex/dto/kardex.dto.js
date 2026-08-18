"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarKardexSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
==================== CONSULTAR KARDEX =================
=====================================================*/
exports.ConsultarKardexSchema = zod_1.z.object({
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
    fechaDesde: zod_1.z
        .string()
        .datetime({
        message: 'La fecha inicial no es válida.'
    })
        .optional(),
    fechaHasta: zod_1.z
        .string()
        .datetime({
        message: 'La fecha final no es válida.'
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
