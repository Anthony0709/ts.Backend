"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarMovimientosCajaSchema = exports.ConsultarCajasSchema = exports.CerrarCajaSchema = exports.AbrirCajaSchema = exports.ActualizarCajaSchema = exports.CrearCajaSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
====================== CREAR CAJA =====================
=====================================================*/
exports.CrearCajaSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.'),
    sucursalId: zod_1.z
        .string()
        .cuid('La sucursal no es válida.'),
    saldoInicial: zod_1.z
        .number()
        .finite('El saldo inicial debe ser un número válido.')
        .min(0, 'El saldo inicial no puede ser negativo.'),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional()
}).strict();
/*=====================================================
==================== ACTUALIZAR CAJA ==================
=====================================================*/
exports.ActualizarCajaSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.')
        .optional(),
    sucursalId: zod_1.z
        .string()
        .cuid('La sucursal no es válida.')
        .optional(),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional()
}).strict();
/*=====================================================
===================== ABRIR CAJA ======================
=====================================================*/
exports.AbrirCajaSchema = zod_1.z.object({
    saldoInicial: zod_1.z
        .number()
        .finite('El saldo inicial debe ser un número válido.')
        .min(0, 'El saldo inicial no puede ser negativo.'),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional()
}).strict();
/*=====================================================
===================== CERRAR CAJA =====================
=====================================================*/
exports.CerrarCajaSchema = zod_1.z.object({
    saldoContado: zod_1.z
        .number()
        .finite('El saldo contado debe ser un número válido.')
        .min(0, 'El saldo contado no puede ser negativo.'),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional()
}).strict();
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.ConsultarCajasSchema = zod_1.z.object({
    sucursalId: zod_1.z
        .string()
        .cuid('La sucursal no es válida.')
        .optional(),
    estado: zod_1.z
        .enum([
        'ABIERTA',
        'CERRADA'
    ], {
        message: 'El estado de la caja no es válido.'
    })
        .optional(),
    nombre: zod_1.z
        .string()
        .trim()
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
/*=====================================================
================ CONSULTAR MOVIMIENTOS ================
=====================================================*/
exports.ConsultarMovimientosCajaSchema = zod_1.z.object({
    cajaId: zod_1.z
        .string()
        .cuid('La caja no es válida.'),
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
        .min(1, 'La página debe ser mayor que cero.')
        .optional(),
    limit: zod_1.z
        .coerce
        .number()
        .int()
        .min(1, 'El límite debe ser mayor que cero.')
        .max(100, 'El límite máximo es 100.')
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
            path: [
                'fechaHasta'
            ],
            message: 'La fecha final no puede ser menor que la fecha inicial.'
        });
    }
});
