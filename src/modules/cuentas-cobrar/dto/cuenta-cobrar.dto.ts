import { z } from 'zod';

export const CrearCuentaCobrarSchema = z.object({
    clienteId: z.string().cuid('El cliente no es válido.'),
    ventaId: z.string().cuid('La venta no es válida.').optional(),
    numeroDocumento: z.string().trim().min(1, 'El número de documento es obligatorio.').max(50, 'El número de documento no puede superar los 50 caracteres.'),
    fechaEmision: z.coerce.date(),
    fechaVencimiento: z.coerce.date(),
    monto: z.number().finite('El monto debe ser un número válido.').positive('El monto debe ser mayor que cero.'),
    observacion: z.string().trim().max(500, 'La observación no puede superar los 500 caracteres.').optional()
}).strict().superRefine((data, ctx) => {
    if (data.fechaVencimiento < data.fechaEmision) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaVencimiento'],
            message: 'La fecha de vencimiento no puede ser anterior a la fecha de emisión.'
        });
    }
});
export const RegistrarAbonoCuentaCobrarSchema = z.object({
    monto: z.number().finite('El monto debe ser un número válido.').positive('El monto debe ser mayor que cero.'),
    metodoPago: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE', 'CREDITO', 'OTRO'], {
        message: 'El método de pago no es válido.'
    }),
    referencia: z.string().trim().max(100, 'La referencia no puede superar los 100 caracteres.').optional(),
    observacion: z.string().trim().max(500, 'La observación no puede superar los 500 caracteres.').optional()
}).strict();
export const ConsultarCuentasCobrarSchema = z.object({
    clienteId: z.string().cuid('El cliente no es válido.').optional(),
    ventaId: z.string().cuid('La venta no es válida.').optional(),
    estado: z.enum(['PENDIENTE', 'PARCIAL', 'PAGADA', 'VENCIDA', 'ANULADA'], {
        message: 'El estado de la cuenta no es válido.'
    }).optional(),
    numeroDocumento: z.string().trim().max(50).optional(),
    fechaDesde: z.coerce.date().optional(),
    fechaHasta: z.coerce.date().optional(),
    vencidas: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
}).strict().superRefine((data, ctx) => {
    if (data.fechaDesde && data.fechaHasta && data.fechaHasta < data.fechaDesde) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaHasta'],
            message: 'La fechaHasta no puede ser anterior a fechaDesde.'
        });
    }
});
export const ObtenerCuentaCobrarSchema = z.object({
    id: z.string().cuid('El ID de la cuenta por cobrar no es válido.')
}).strict();
export type CrearCuentaCobrarDto = z.infer<typeof CrearCuentaCobrarSchema>;
export type RegistrarAbonoCuentaCobrarDto = z.infer<typeof RegistrarAbonoCuentaCobrarSchema>;
export type ConsultarCuentasCobrarDto = z.infer<typeof ConsultarCuentasCobrarSchema>;
export type ObtenerCuentaCobrarDto = z.infer<typeof ObtenerCuentaCobrarSchema>;