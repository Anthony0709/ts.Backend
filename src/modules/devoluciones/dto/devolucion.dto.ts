import { z } from 'zod';

/*=====================================================
==================== DETALLE ==========================
=====================================================*/

export const DevolucionDetalleSchema = z.object({

    productoId: z
        .string()
        .cuid('Producto inválido.'),

    cantidad: z
        .number()
        .int('La cantidad debe ser un número entero.')
        .positive(
            'La cantidad debe ser mayor que cero.'
        )

}).strict();


/*=====================================================
==================== CREAR DEVOLUCIÓN =================
=====================================================*/

export const CrearDevolucionSchema = z.object({

    tipo: z
        .enum([
            'COMPRA',
            'VENTA'
        ], {
            message:
                'El tipo de devolución debe ser COMPRA o VENTA.'
        }),

    ventaId: z
        .string()
        .cuid('Venta inválida.')
        .optional(),

    compraId: z
        .string()
        .cuid('Compra inválida.')
        .optional(),

    bodegaId: z
        .string()
        .cuid('Bodega inválida.'),

    observacion: z
        .string()
        .trim()
        .max(
            500,
            'La observación no puede superar los 500 caracteres.'
        )
        .optional(),

    detalles: z
        .array(DevolucionDetalleSchema)
        .min(
            1,
            'La devolución debe contener al menos un producto.'
        )

}).strict().superRefine((data, ctx) => {

    /*
     * DEVOLUCIÓN DE VENTA
     * debe tener ventaId.
     */

    if (
        data.tipo === 'VENTA' &&
        !data.ventaId
    ) {

        ctx.addIssue({
            code: 'custom',
            path: ['ventaId'],
            message:
                'La venta es obligatoria para una devolución de venta.'
        });
    }

    /*
     * DEVOLUCIÓN DE COMPRA
     * debe tener compraId.
     */

    if (
        data.tipo === 'COMPRA' &&
        !data.compraId
    ) {

        ctx.addIssue({
            code: 'custom',
            path: ['compraId'],
            message:
                'La compra es obligatoria para una devolución de compra.'
        });
    }

    /*
     * No permitimos enviar ambos documentos.
     */

    if (
        data.ventaId &&
        data.compraId
    ) {

        ctx.addIssue({
            code: 'custom',
            path: ['compraId'],
            message:
                'Una devolución no puede estar asociada simultáneamente a una venta y una compra.'
        });
    }

});


/*=====================================================
================== ACTUALIZAR DEVOLUCIÓN ==============
=====================================================*/

export const ActualizarDevolucionSchema = z.object({

    observacion: z
        .string()
        .trim()
        .max(
            500,
            'La observación no puede superar los 500 caracteres.'
        )
        .optional()

}).strict();


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const ConsultarDevolucionesSchema = z.object({

    tipo: z
        .enum([
            'COMPRA',
            'VENTA'
        ], {
            message:
                'Tipo de devolución inválido.'
        })
        .optional(),

    estado: z
        .enum([
            'BORRADOR',
            'APROBADA',
            'ANULADA'
        ], {
            message:
                'Estado de devolución inválido.'
        })
        .optional(),

    ventaId: z
        .string()
        .cuid('Venta inválida.')
        .optional(),

    compraId: z
        .string()
        .cuid('Compra inválida.')
        .optional(),

    bodegaId: z
        .string()
        .cuid('Bodega inválida.')
        .optional(),

    page: z
        .coerce
        .number()
        .int()
        .min(1)
        .optional(),

    limit: z
        .coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()

}).strict();


/*=====================================================
======================== TYPES =========================
=====================================================*/

export type DevolucionDetalleDto =
    z.infer<typeof DevolucionDetalleSchema>;

export type CrearDevolucionDto =
    z.infer<typeof CrearDevolucionSchema>;

export type ActualizarDevolucionDto =
    z.infer<typeof ActualizarDevolucionSchema>;

export type ConsultarDevolucionesDto =
    z.infer<typeof ConsultarDevolucionesSchema>;