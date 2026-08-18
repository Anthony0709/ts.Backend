"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarPagosCuentaPagarSchema = exports.RegistrarPagoCuentaPagarSchema = exports.ConsultarCuentasPagarSchema = exports.ActualizarCuentaPagarSchema = exports.CrearCuentaPagarSchema = void 0;
const zod_1 = require("zod");
/*=====================================================
==================== CREAR CUENTA =====================
=====================================================*/
exports.CrearCuentaPagarSchema = zod_1.z.object({
    compraId: zod_1.z
        .string()
        .cuid('Compra inválida.'),
    fechaVencimiento: zod_1.z
        .string()
        .datetime({
        message: 'La fecha de vencimiento no es válida.'
    })
        .optional(),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional()
}).strict();
/*=====================================================
=================== ACTUALIZAR CUENTA =================
=====================================================*/
exports.ActualizarCuentaPagarSchema = zod_1.z.object({
    fechaVencimiento: zod_1.z
        .string()
        .datetime({
        message: 'La fecha de vencimiento no es válida.'
    })
        .optional(),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional()
}).strict();
/*=====================================================
==================== CONSULTAR ========================
=====================================================*/
exports.ConsultarCuentasPagarSchema = zod_1.z.object({
    proveedorId: zod_1.z
        .string()
        .cuid('Proveedor inválido.')
        .optional(),
    estado: zod_1.z
        .enum([
        'PENDIENTE',
        'PARCIAL',
        'PAGADA',
        'VENCIDA'
    ], {
        message: 'Estado de cuenta por pagar inválido.'
    })
        .optional(),
    compraId: zod_1.z
        .string()
        .cuid('Compra inválida.')
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
    vencimientoDesde: zod_1.z
        .string()
        .datetime({
        message: 'La fecha de vencimiento inicial no es válida.'
    })
        .optional(),
    vencimientoHasta: zod_1.z
        .string()
        .datetime({
        message: 'La fecha de vencimiento final no es válida.'
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
    /*---------------------------------------------
    ----------- VALIDAR RANGO DE FECHAS -----------
    ---------------------------------------------*/
    if (data.fechaDesde &&
        data.fechaHasta) {
        const desde = new Date(data.fechaDesde);
        const hasta = new Date(data.fechaHasta);
        if (desde > hasta) {
            ctx.addIssue({
                code: 'custom',
                path: ['fechaHasta'],
                message: 'La fecha final no puede ser menor que la fecha inicial.'
            });
        }
    }
    /*---------------------------------------------
    ------ VALIDAR RANGO DE VENCIMIENTO -----------
    ---------------------------------------------*/
    if (data.vencimientoDesde &&
        data.vencimientoHasta) {
        const desde = new Date(data.vencimientoDesde);
        const hasta = new Date(data.vencimientoHasta);
        if (desde > hasta) {
            ctx.addIssue({
                code: 'custom',
                path: ['vencimientoHasta'],
                message: 'La fecha de vencimiento final no puede ser menor que la inicial.'
            });
        }
    }
});
/*=====================================================
====================== REGISTRAR PAGO =================
=====================================================*/
exports.RegistrarPagoCuentaPagarSchema = zod_1.z.object({
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
        .optional(),
    observacion: zod_1.z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional()
}).strict();
/*=====================================================
===================== CONSULTAR PAGOS =================
=====================================================*/
exports.ConsultarPagosCuentaPagarSchema = zod_1.z.object({
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
