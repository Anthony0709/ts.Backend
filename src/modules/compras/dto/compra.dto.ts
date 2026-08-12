import { z } from 'zod';

/*=====================================================
=================== DETALLE COMPRA ====================
=====================================================*/

export const CompraDetalleSchema = z.object({

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
===================== CREAR COMPRA ====================
=====================================================*/

export const CrearCompraSchema = z.object({

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
        .array(CompraDetalleSchema)
        .min(
            1,
            'La compra debe contener al menos un producto.'
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
                'No se puede repetir el mismo producto en una compra.'

        });
    }
});


/*=====================================================
================== ACTUALIZAR COMPRA ==================
=====================================================*/

export const ActualizarCompraSchema =
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
            .array(CompraDetalleSchema)
            .min(
                1,
                'La compra debe contener al menos un producto.'
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
                    'No se puede repetir el mismo producto en una compra.'

            });
        }
    });


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const ConsultarComprasSchema =
    z.object({

        proveedorId: z
            .string()
            .cuid('Proveedor inválido.')
            .optional(),

        estado: z
            .enum([
                'BORRADOR',
                'APROBADA',
                'ANULADA'
            ], {
                message:
                    'Estado de compra inválido.'
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

export type CompraDetalleDto =
    z.infer<typeof CompraDetalleSchema>;

export type CrearCompraDto =
    z.infer<typeof CrearCompraSchema>;

export type ActualizarCompraDto =
    z.infer<typeof ActualizarCompraSchema>;

export type ConsultarComprasDto =
    z.infer<typeof ConsultarComprasSchema>;