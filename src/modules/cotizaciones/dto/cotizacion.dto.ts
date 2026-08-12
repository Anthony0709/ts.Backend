import { z } from 'zod';


/*=====================================================
================= DETALLE COTIZACIÓN ==================
=====================================================*/

export const CotizacionDetalleSchema = z.object({

    productoId: z
        .string()
        .cuid(
            'Producto inválido.'
        ),

    cantidad: z
        .number()
        .int(
            'La cantidad debe ser un número entero.'
        )
        .positive(
            'La cantidad debe ser mayor que cero.'
        ),

    precio: z
        .number()
        .finite(
            'El precio debe ser un número válido.'
        )
        .positive(
            'El precio debe ser mayor que cero.'
        )

}).strict();


/*=====================================================
==================== CREAR COTIZACIÓN ==================
=====================================================*/

export const CrearCotizacionSchema = z.object({

    clienteId: z
        .string()
        .cuid(
            'Cliente inválido.'
        ),

    observacion: z
        .string()
        .trim()
        .max(
            500,
            'La observación no puede superar los 500 caracteres.'
        )
        .optional(),

    detalles: z
        .array(
            CotizacionDetalleSchema
        )
        .min(
            1,
            'La cotización debe contener al menos un producto.'
        )

}).strict().superRefine((data, ctx) => {

    const productos =
        data.detalles.map(
            detalle =>
                detalle.productoId
        );

    const productosUnicos =
        new Set(productos);

    if (
        productos.length !==
        productosUnicos.size
    ) {

        ctx.addIssue({

            code: 'custom',

            path: [
                'detalles'
            ],

            message:
                'No se puede repetir el mismo producto en una cotización.'

        });
    }

});


/*=====================================================
================= ACTUALIZAR COTIZACIÓN ===============
=====================================================*/

export const ActualizarCotizacionSchema =
    z.object({

        clienteId: z
            .string()
            .cuid(
                'Cliente inválido.'
            )
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
            .array(
                CotizacionDetalleSchema
            )
            .min(
                1,
                'La cotización debe contener al menos un producto.'
            )
            .optional()

    }).strict().superRefine((data, ctx) => {

        if (
            !data.detalles
        ) {
            return;
        }

        const productos =
            data.detalles.map(
                detalle =>
                    detalle.productoId
            );

        const productosUnicos =
            new Set(productos);

        if (
            productos.length !==
            productosUnicos.size
        ) {

            ctx.addIssue({

                code: 'custom',

                path: [
                    'detalles'
                ],

                message:
                    'No se puede repetir el mismo producto en una cotización.'

            });
        }

    });


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const ConsultarCotizacionesSchema =
    z.object({

        clienteId: z
            .string()
            .cuid(
                'Cliente inválido.'
            )
            .optional(),

        estado: z
            .enum([
                'BORRADOR',
                'APROBADA',
                'RECHAZADA',
                'CONVERTIDA'
            ], {
                message:
                    'Estado de cotización inválido.'
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
            new Date(
                data.fechaDesde
            );

        const hasta =
            new Date(
                data.fechaHasta
            );

        if (
            desde > hasta
        ) {

            ctx.addIssue({

                code: 'custom',

                path: [
                    'fechaHasta'
                ],

                message:
                    'La fecha final no puede ser menor que la fecha inicial.'

            });
        }

    });


/*=====================================================
======================== TYPES ========================
=====================================================*/

export type CotizacionDetalleDto =
    z.infer<
        typeof CotizacionDetalleSchema
    >;

export type CrearCotizacionDto =
    z.infer<
        typeof CrearCotizacionSchema
    >;

export type ActualizarCotizacionDto =
    z.infer<
        typeof ActualizarCotizacionSchema
    >;

export type ConsultarCotizacionesDto =
    z.infer<
        typeof ConsultarCotizacionesSchema
    >;