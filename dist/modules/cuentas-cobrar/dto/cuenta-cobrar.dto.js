"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerCuentaCobrarSchema = exports.ConsultarCuentasCobrarSchema = exports.RegistrarAbonoCuentaCobrarSchema = exports.CrearCuentaCobrarSchema = void 0;
const zod_1 = require("zod");
exports.CrearCuentaCobrarSchema = zod_1.z.object({
    clienteId: zod_1.z.string().cuid('El cliente no es válido.'),
    ventaId: zod_1.z.string().cuid('La venta no es válida.').optional(),
    numeroDocumento: zod_1.z.string().trim().min(1, 'El número de documento es obligatorio.').max(50, 'El número de documento no puede superar los 50 caracteres.'),
    fechaEmision: zod_1.z.coerce.date(),
    fechaVencimiento: zod_1.z.coerce.date(),
    monto: zod_1.z.number().finite('El monto debe ser un número válido.').positive('El monto debe ser mayor que cero.'),
    observacion: zod_1.z.string().trim().max(500, 'La observación no puede superar los 500 caracteres.').optional()
}).strict().superRefine((data, ctx) => {
    if (data.fechaVencimiento < data.fechaEmision) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaVencimiento'],
            message: 'La fecha de vencimiento no puede ser anterior a la fecha de emisión.'
        });
    }
});
exports.RegistrarAbonoCuentaCobrarSchema = zod_1.z.object({
    monto: zod_1.z.number().finite('El monto debe ser un número válido.').positive('El monto debe ser mayor que cero.'),
    metodoPago: zod_1.z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE', 'CREDITO', 'OTRO'], {
        message: 'El método de pago no es válido.'
    }),
    referencia: zod_1.z.string().trim().max(100, 'La referencia no puede superar los 100 caracteres.').optional(),
    observacion: zod_1.z.string().trim().max(500, 'La observación no puede superar los 500 caracteres.').optional()
}).strict();
exports.ConsultarCuentasCobrarSchema = zod_1.z.object({
    clienteId: zod_1.z.string().cuid('El cliente no es válido.').optional(),
    ventaId: zod_1.z.string().cuid('La venta no es válida.').optional(),
    estado: zod_1.z.enum(['PENDIENTE', 'PARCIAL', 'PAGADA', 'VENCIDA', 'ANULADA'], {
        message: 'El estado de la cuenta no es válido.'
    }).optional(),
    numeroDocumento: zod_1.z.string().trim().max(50).optional(),
    fechaDesde: zod_1.z.coerce.date().optional(),
    fechaHasta: zod_1.z.coerce.date().optional(),
    vencidas: zod_1.z.coerce.boolean().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10)
}).strict().superRefine((data, ctx) => {
    if (data.fechaDesde && data.fechaHasta && data.fechaHasta < data.fechaDesde) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaHasta'],
            message: 'La fechaHasta no puede ser anterior a fechaDesde.'
        });
    }
});
exports.ObtenerCuentaCobrarSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('El ID de la cuenta por cobrar no es válido.')
}).strict();
