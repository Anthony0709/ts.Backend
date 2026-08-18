"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarGastosSchema = exports.ActualizarGastoSchema = exports.CrearGastoSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
======================= CREAR =========================
=====================================================*/
exports.CrearGastoSchema = zod_1.z.object({
    concepto: zod_1.z
        .string()
        .trim()
        .min(1, 'El concepto es obligatorio.')
        .max(200, 'El concepto no puede superar los 200 caracteres.'),
    descripcion: zod_1.z
        .string()
        .trim()
        .max(500, 'La descripción no puede superar los 500 caracteres.')
        .optional(),
    proveedorId: zod_1.z
        .string()
        .cuid('Proveedor inválido.')
        .optional(),
    categoria: zod_1.z
        .string()
        .trim()
        .min(1, 'La categoría es obligatoria.')
        .max(100, 'La categoría no puede superar los 100 caracteres.'),
    monto: zod_1.z
        .number()
        .finite('El monto debe ser un número válido.')
        .positive('El monto debe ser mayor que cero.'),
    metodoPago: zod_1.z
        .enum([
        'EFECTIVO',
        'TARJETA',
        'TRANSFERENCIA',
        'CHEQUE',
        'CREDITO',
        'OTRO'
    ], {
        message: 'Método de pago inválido.'
    })
        .optional(),
    referencia: zod_1.z
        .string()
        .trim()
        .max(150, 'La referencia no puede superar los 150 caracteres.')
        .optional()
}).strict();
/*=====================================================
====================== ACTUALIZAR =====================
=====================================================*/
exports.ActualizarGastoSchema = zod_1.z.object({
    concepto: zod_1.z
        .string()
        .trim()
        .min(1, 'El concepto es obligatorio.')
        .max(200, 'El concepto no puede superar los 200 caracteres.')
        .optional(),
    descripcion: zod_1.z
        .string()
        .trim()
        .max(500, 'La descripción no puede superar los 500 caracteres.')
        .optional(),
    proveedorId: zod_1.z
        .string()
        .cuid('Proveedor inválido.')
        .nullable()
        .optional(),
    categoria: zod_1.z
        .string()
        .trim()
        .min(1, 'La categoría es obligatoria.')
        .max(100, 'La categoría no puede superar los 100 caracteres.')
        .optional(),
    monto: zod_1.z
        .number()
        .finite('El monto debe ser un número válido.')
        .positive('El monto debe ser mayor que cero.')
        .optional(),
    metodoPago: zod_1.z
        .enum([
        'EFECTIVO',
        'TARJETA',
        'TRANSFERENCIA',
        'CHEQUE',
        'CREDITO',
        'OTRO'
    ], {
        message: 'Método de pago inválido.'
    })
        .nullable()
        .optional(),
    referencia: zod_1.z
        .string()
        .trim()
        .max(150, 'La referencia no puede superar los 150 caracteres.')
        .nullable()
        .optional()
}).strict();
/*=====================================================
======================= CONSULTAR =====================
=====================================================*/
exports.ConsultarGastosSchema = zod_1.z.object({
    proveedorId: zod_1.z
        .string()
        .cuid('Proveedor inválido.')
        .optional(),
    estado: zod_1.z
        .enum([
        'PENDIENTE',
        'PAGADO',
        'ANULADO'
    ], {
        message: 'Estado de gasto inválido.'
    })
        .optional(),
    categoria: zod_1.z
        .string()
        .trim()
        .max(100, 'La categoría no puede superar los 100 caracteres.')
        .optional(),
    metodoPago: zod_1.z
        .enum([
        'EFECTIVO',
        'TARJETA',
        'TRANSFERENCIA',
        'CHEQUE',
        'CREDITO',
        'OTRO'
    ], {
        message: 'Método de pago inválido.'
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
    montoMinimo: zod_1.z
        .coerce
        .number()
        .finite('El monto mínimo no es válido.')
        .nonnegative('El monto mínimo no puede ser negativo.')
        .optional(),
    montoMaximo: zod_1.z
        .coerce
        .number()
        .finite('El monto máximo no es válido.')
        .nonnegative('El monto máximo no puede ser negativo.')
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
    /*---------------------------------------------
    ------------- RANGO DE FECHAS -----------------
    ---------------------------------------------*/
    if (data.fechaDesde &&
        data.fechaHasta) {
        const desde = new Date(data.fechaDesde);
        const hasta = new Date(data.fechaHasta);
        if (desde > hasta) {
            ctx.addIssue({
                code: 'custom',
                path: [
                    'fechaHasta'
                ],
                message: 'La fecha final no puede ser menor que la fecha inicial.'
            });
        }
    }
    /*---------------------------------------------
    ------------- RANGO DE MONTOS -----------------
    ---------------------------------------------*/
    if (data.montoMinimo !== undefined &&
        data.montoMaximo !== undefined) {
        if (data.montoMinimo >
            data.montoMaximo) {
            ctx.addIssue({
                code: 'custom',
                path: [
                    'montoMaximo'
                ],
                message: 'El monto máximo no puede ser menor que el monto mínimo.'
            });
        }
    }
});
