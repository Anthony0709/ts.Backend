"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarDevolucionesSchema = exports.ActualizarDevolucionSchema = exports.CrearDevolucionSchema = exports.DevolucionDetalleSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
==================== DETALLE ==========================
=====================================================*/
exports.DevolucionDetalleSchema = zod_1.z.object({
    productoId: zod_1.z
        .string()
        .cuid('Producto inválido.'),
    cantidad: zod_1.z
        .number()
        .int('La cantidad debe ser un número entero.')
        .positive('La cantidad debe ser mayor que cero.')
}).strict();
/*=====================================================
==================== CREAR DEVOLUCIÓN =================
=====================================================*/
exports.CrearDevolucionSchema = zod_1.z.object({
    tipo: zod_1.z
        .enum([
        'COMPRA',
        'VENTA'
    ], {
        message: 'El tipo de devolución debe ser COMPRA o VENTA.'
    }),
    ventaId: zod_1.z
        .string()
        .cuid('Venta inválida.')
        .optional(),
    compraId: zod_1.z
        .string()
        .cuid('Compra inválida.')
        .optional(),
    bodegaId: zod_1.z
        .string()
        .cuid('Bodega inválida.'),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional(),
    detalles: zod_1.z
        .array(exports.DevolucionDetalleSchema)
        .min(1, 'La devolución debe contener al menos un producto.')
}).strict().superRefine((data, ctx) => {
    /*
     * DEVOLUCIÓN DE VENTA
     * debe tener ventaId.
     */
    if (data.tipo === 'VENTA' &&
        !data.ventaId) {
        ctx.addIssue({
            code: 'custom',
            path: ['ventaId'],
            message: 'La venta es obligatoria para una devolución de venta.'
        });
    }
    /*
     * DEVOLUCIÓN DE COMPRA
     * debe tener compraId.
     */
    if (data.tipo === 'COMPRA' &&
        !data.compraId) {
        ctx.addIssue({
            code: 'custom',
            path: ['compraId'],
            message: 'La compra es obligatoria para una devolución de compra.'
        });
    }
    /*
     * No permitimos enviar ambos documentos.
     */
    if (data.ventaId &&
        data.compraId) {
        ctx.addIssue({
            code: 'custom',
            path: ['compraId'],
            message: 'Una devolución no puede estar asociada simultáneamente a una venta y una compra.'
        });
    }
});
/*=====================================================
================== ACTUALIZAR DEVOLUCIÓN ==============
=====================================================*/
exports.ActualizarDevolucionSchema = zod_1.z.object({
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional()
}).strict();
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.ConsultarDevolucionesSchema = zod_1.z.object({
    tipo: zod_1.z
        .enum([
        'COMPRA',
        'VENTA'
    ], {
        message: 'Tipo de devolución inválido.'
    })
        .optional(),
    estado: zod_1.z
        .enum([
        'BORRADOR',
        'APROBADA',
        'ANULADA'
    ], {
        message: 'Estado de devolución inválido.'
    })
        .optional(),
    ventaId: zod_1.z
        .string()
        .cuid('Venta inválida.')
        .optional(),
    compraId: zod_1.z
        .string()
        .cuid('Compra inválida.')
        .optional(),
    bodegaId: zod_1.z
        .string()
        .cuid('Bodega inválida.')
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
