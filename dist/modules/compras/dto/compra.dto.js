"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarComprasSchema = exports.ActualizarCompraSchema = exports.CrearCompraSchema = exports.CompraDetalleSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
=================== DETALLE COMPRA ====================
=====================================================*/
exports.CompraDetalleSchema = zod_1.z.object({
    productoId: zod_1.z
        .string()
        .cuid('Producto inválido.'),
    cantidad: zod_1.z
        .number()
        .int('La cantidad debe ser un número entero.')
        .positive('La cantidad debe ser mayor que cero.'),
    costo: zod_1.z
        .number()
        .finite('El costo debe ser un número válido.')
        .positive('El costo debe ser mayor que cero.')
}).strict();
/*=====================================================
===================== CREAR COMPRA ====================
=====================================================*/
exports.CrearCompraSchema = zod_1.z.object({
    proveedorId: zod_1.z
        .string()
        .cuid('Proveedor inválido.'),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional(),
    detalles: zod_1.z
        .array(exports.CompraDetalleSchema)
        .min(1, 'La compra debe contener al menos un producto.')
}).strict().superRefine((data, ctx) => {
    const productos = data.detalles.map(detalle => detalle.productoId);
    const productosUnicos = new Set(productos);
    if (productos.length !==
        productosUnicos.size) {
        ctx.addIssue({
            code: 'custom',
            path: ['detalles'],
            message: 'No se puede repetir el mismo producto en una compra.'
        });
    }
});
/*=====================================================
================== ACTUALIZAR COMPRA ==================
=====================================================*/
exports.ActualizarCompraSchema = zod_1.z.object({
    proveedorId: zod_1.z
        .string()
        .cuid('Proveedor inválido.')
        .optional(),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional(),
    detalles: zod_1.z
        .array(exports.CompraDetalleSchema)
        .min(1, 'La compra debe contener al menos un producto.')
        .optional()
}).strict().superRefine((data, ctx) => {
    if (!data.detalles) {
        return;
    }
    const productos = data.detalles.map(detalle => detalle.productoId);
    const productosUnicos = new Set(productos);
    if (productos.length !==
        productosUnicos.size) {
        ctx.addIssue({
            code: 'custom',
            path: ['detalles'],
            message: 'No se puede repetir el mismo producto en una compra.'
        });
    }
});
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.ConsultarComprasSchema = zod_1.z.object({
    proveedorId: zod_1.z
        .string()
        .cuid('Proveedor inválido.')
        .optional(),
    estado: zod_1.z
        .enum([
        'BORRADOR',
        'APROBADA',
        'ANULADA'
    ], {
        message: 'Estado de compra inválido.'
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
}).strict().superRefine((data, ctx) => {
    if (!data.fechaDesde ||
        !data.fechaHasta) {
        return;
    }
    const desde = new Date(data.fechaDesde);
    const hasta = new Date(data.fechaHasta);
    if (desde > hasta) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaHasta'],
            message: 'La fecha final no puede ser menor que la fecha inicial.'
        });
    }
});
