import { z } from 'zod';

const DetallePOSSchema = z.object({
    productoId: z.string().cuid('El producto no es válido.'),
    cantidad: z.number().int('La cantidad debe ser un número entero.').positive('La cantidad debe ser mayor que cero.'),
    precio: z.number().finite('El precio debe ser un número válido.').nonnegative('El precio no puede ser negativo.')
}).strict();

const PagoPOSSchema = z.object({
    metodoPago: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE', 'CREDITO', 'OTRO'], {
        message: 'El método de pago no es válido.'
    }),
    monto: z.number().finite('El monto debe ser un número válido.').positive('El monto debe ser mayor que cero.'),
    referencia: z.string().trim().max(100, 'La referencia no puede superar los 100 caracteres.').optional()
}).strict();

export const ProcesarVentaPOSSchema = z.object({
    cajaId: z.string().cuid('La caja no es válida.'),
    clienteId: z.string().cuid('El cliente no es válido.'),
    detalles: z.array(DetallePOSSchema).min(1, 'La venta debe tener al menos un producto.').max(100, 'La venta no puede superar 100 productos.'),
    pagos: z.array(PagoPOSSchema).min(1, 'Debe registrar al menos un pago.'),
    descuento: z.number().finite('El descuento debe ser un número válido.').nonnegative('El descuento no puede ser negativo.').default(0),
    observacion: z.string().trim().max(500, 'La observación no puede superar los 500 caracteres.').optional()
}).strict().superRefine((data, ctx) => {
    const productos = new Set<string>();
    for (const detalle of data.detalles) {
        if (productos.has(detalle.productoId)) {
            ctx.addIssue({
                code: 'custom',
                path: ['detalles'],
                message: 'No puede existir el mismo producto más de una vez en la venta.'
            });
            break;
        }
        productos.add(detalle.productoId);
    }
    const totalPagos = data.pagos.reduce((total, pago) => total + pago.monto, 0);
    const subtotal = data.detalles.reduce((total, detalle) => total + detalle.cantidad * detalle.precio, 0);
    const total = subtotal - data.descuento;
    if (data.descuento > subtotal) {
        ctx.addIssue({
            code: 'custom',
            path: ['descuento'],
            message: 'El descuento no puede ser mayor al subtotal.'
        });
    }
    if (Math.abs(totalPagos - total) > 0.01) {
        ctx.addIssue({
            code: 'custom',
            path: ['pagos'],
            message: 'La suma de los pagos debe coincidir con el total de la venta.'
        });
    }
    const tieneCredito = data.pagos.some(pago => pago.metodoPago === 'CREDITO');
    if (tieneCredito && data.pagos.length > 1) {
        ctx.addIssue({
            code: 'custom',
            path: ['pagos'],
            message: 'El método de pago CREDITO no puede combinarse con otros métodos de pago.'
        });
    }
});

export const BuscarProductosPOSSchema = z.object({
    search: z.string().trim().max(100, 'La búsqueda no puede superar los 100 caracteres.').optional(),
    categoriaId: z.string().cuid('La categoría no es válida.').optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20)
}).strict();

export const BuscarClientesPOSSchema = z.object({
    search: z.string().trim().max(100, 'La búsqueda no puede superar los 100 caracteres.').optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20)
}).strict();

export const ConsultarCajaPOSSchema = z.object({
    cajaId: z.string().cuid('La caja no es válida.')
}).strict();

export const ConsultarResumenCajaPOSSchema = z.object({
    cajaId: z.string().cuid('La caja no es válida.')
}).strict();

export type DetallePOSDto = z.infer<typeof DetallePOSSchema>;
export type PagoPOSDto = z.infer<typeof PagoPOSSchema>;
export type ProcesarVentaPOSDto = z.infer<typeof ProcesarVentaPOSSchema>;
export type BuscarProductosPOSDto = z.infer<typeof BuscarProductosPOSSchema>;
export type BuscarClientesPOSDto = z.infer<typeof BuscarClientesPOSSchema>;
export type ConsultarCajaPOSDto = z.infer<typeof ConsultarCajaPOSSchema>;
export type ConsultarResumenCajaPOSDto = z.infer<typeof ConsultarResumenCajaPOSSchema>;