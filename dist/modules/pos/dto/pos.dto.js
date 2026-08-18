"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarResumenCajaPOSSchema = exports.ConsultarCajaPOSSchema = exports.BuscarClientesPOSSchema = exports.BuscarProductosPOSSchema = exports.ProcesarVentaPOSSchema = void 0;
const zod_1 = require("zod");
const DetallePOSSchema = zod_1.z.object({
    productoId: zod_1.z.string().cuid('El producto no es válido.'),
    cantidad: zod_1.z.number().int('La cantidad debe ser un número entero.').positive('La cantidad debe ser mayor que cero.'),
    precio: zod_1.z.number().finite('El precio debe ser un número válido.').nonnegative('El precio no puede ser negativo.')
}).strict();
const PagoPOSSchema = zod_1.z.object({
    metodoPago: zod_1.z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE', 'CREDITO', 'OTRO'], {
        message: 'El método de pago no es válido.'
    }),
    monto: zod_1.z.number().finite('El monto debe ser un número válido.').positive('El monto debe ser mayor que cero.'),
    referencia: zod_1.z.string().trim().max(100, 'La referencia no puede superar los 100 caracteres.').optional()
}).strict();
exports.ProcesarVentaPOSSchema = zod_1.z.object({
    cajaId: zod_1.z.string().cuid('La caja no es válida.'),
    clienteId: zod_1.z.string().cuid('El cliente no es válido.'),
    detalles: zod_1.z.array(DetallePOSSchema).min(1, 'La venta debe tener al menos un producto.').max(100, 'La venta no puede superar 100 productos.'),
    pagos: zod_1.z.array(PagoPOSSchema).min(1, 'Debe registrar al menos un pago.'),
    descuento: zod_1.z.number().finite('El descuento debe ser un número válido.').nonnegative('El descuento no puede ser negativo.').default(0),
    observacion: zod_1.z.string().trim().max(500, 'La observación no puede superar los 500 caracteres.').optional()
}).strict().superRefine((data, ctx) => {
    const productos = new Set();
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
exports.BuscarProductosPOSSchema = zod_1.z.object({
    search: zod_1.z.string().trim().max(100, 'La búsqueda no puede superar los 100 caracteres.').optional(),
    categoriaId: zod_1.z.string().cuid('La categoría no es válida.').optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20)
}).strict();
exports.BuscarClientesPOSSchema = zod_1.z.object({
    search: zod_1.z.string().trim().max(100, 'La búsqueda no puede superar los 100 caracteres.').optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20)
}).strict();
exports.ConsultarCajaPOSSchema = zod_1.z.object({
    cajaId: zod_1.z.string().cuid('La caja no es válida.')
}).strict();
exports.ConsultarResumenCajaPOSSchema = zod_1.z.object({
    cajaId: zod_1.z.string().cuid('La caja no es válida.')
}).strict();
