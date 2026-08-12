import { z } from 'zod';

/*=====================================================
================ DETALLE ORDEN COMPRA =================
=====================================================*/

export const OrdenCompraDetalleSchema = z.object({

    productoId: z
        .string()
        .cuid('Producto inválido.'),

    cantidad: z
        .number()
        .int('La cantidad debe ser un número entero.')
        .positive(
            'La cantidad debe ser mayor que cero.'
        ),

    costo: z
        .number()
        .finite('El costo debe ser un número válido.')
        .positive(
            'El costo debe ser mayor que cero.'
        )

}).strict();


/*=====================================================
================ CREAR ORDEN DE COMPRA ================
=====================================================*/

export const CrearOrdenCompraSchema = z.object({

    proveedorId: z
        .string()
        .cuid('Proveedor inválido.'),

    observacion: z
        .string()
        .trim()
        .max(
            500,
            'La observación no puede superar los 500 caracteres.'
        )
        .optional(),

    detalles: z
        .array(OrdenCompraDetalleSchema)
        .min(
            1,
            'La orden de compra debe contener al menos un producto.'
        )

}).strict().superRefine((data, ctx) => {

    const productos =
        data.detalles.map(
            detalle => detalle.productoId
        );

    const productosUnicos =
        new Set(productos);

    if (
        productos.length !==
        productosUnicos.size
    ) {

        ctx.addIssue({

            code: 'custom',

            path: ['detalles'],

            message:
                'No se puede repetir el mismo producto en una orden de compra.'

        });
    }
});


/*=====================================================
============== ACTUALIZAR ORDEN DE COMPRA =============
=====================================================*/

export const ActualizarOrdenCompraSchema =
    z.object({

        proveedorId: z
            .string()
            .cuid('Proveedor inválido.')
            .optional(),

        observacion: z
            .string()
            .trim()
            .max(
                500,
                'La observación no puede superar los 500 caracteres.'
            )
            .optional(),

        detalles: z
            .array(OrdenCompraDetalleSchema)
            .min(
                1,
                'La orden de compra debe contener al menos un producto.'
            )
            .optional()

    }).strict().superRefine((data, ctx) => {

        if (!data.detalles) {
            return;
        }

        const productos =
            data.detalles.map(
                detalle => detalle.productoId
            );

        const productosUnicos =
            new Set(productos);

        if (
            productos.length !==
            productosUnicos.size
        ) {

            ctx.addIssue({

                code: 'custom',

                path: ['detalles'],

                message:
                    'No se puede repetir el mismo producto en una orden de compra.'

            });
        }
    });


/*=====================================================
===================== CONSULTAR =======================
=====================================================*/

export const ConsultarOrdenesCompraSchema =
    z.object({

        proveedorId: z
            .string()
            .cuid('Proveedor inválido.')
            .optional(),

        estado: z
            .enum([
                'BORRADOR',
                'APROBADA',
                'CANCELADA',
                'CONVERTIDA'
            ], {
                message:
                    'Estado de orden de compra inválido.'
            })
            .optional(),

        fechaDesde: z
            .string()
            .datetime({
                message:
                    'La fecha inicial no es válida.'
            })
            .optional(),

        fechaHasta: z
            .string()
            .datetime({
                message:
                    'La fecha final no es válida.'
            })
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

    }).strict().superRefine((data, ctx) => {

        if (
            !data.fechaDesde ||
            !data.fechaHasta
        ) {
            return;
        }

        const desde =
            new Date(data.fechaDesde);

        const hasta =
            new Date(data.fechaHasta);

        if (desde > hasta) {

            ctx.addIssue({

                code: 'custom',

                path: ['fechaHasta'],

                message:
                    'La fecha final no puede ser menor que la fecha inicial.'

            });
        }
    });


/*=====================================================
======================== TYPES =========================
=====================================================*/

export type OrdenCompraDetalleDto =
    z.infer<typeof OrdenCompraDetalleSchema>;

export type CrearOrdenCompraDto =
    z.infer<typeof CrearOrdenCompraSchema>;

export type ActualizarOrdenCompraDto =
    z.infer<typeof ActualizarOrdenCompraSchema>;

export type ConsultarOrdenesCompraDto =
    z.infer<typeof ConsultarOrdenesCompraSchema>;