import { z } from 'zod';

/*=====================================================
================ CREAR TRANSFERENCIA ==================
=====================================================*/

export const CrearTransferenciaSchema = z.object({

    productoId: z
        .string()
        .cuid('Producto inválido.'),

    bodegaOrigenId: z
        .string()
        .cuid('Bodega de origen inválida.'),

    bodegaDestinoId: z
        .string()
        .cuid('Bodega de destino inválida.'),

    cantidad: z
        .number()
        .int('La cantidad debe ser un número entero.')
        .positive(
            'La cantidad debe ser mayor que cero.'
        ),

    observacion: z
        .string()
        .trim()
        .max(
            500,
            'La observación no puede superar los 500 caracteres.'
        )
        .optional()

}).strict().refine(
    data =>
        data.bodegaOrigenId !== data.bodegaDestinoId,
    {
        message:
            'La bodega de origen y destino deben ser diferentes.',
        path: ['bodegaDestinoId']
    }
);


/*=====================================================
================== CONSULTAR TRANSFERENCIAS ===========
=====================================================*/

export const ConsultarTransferenciasSchema = z.object({

    productoId: z
        .string()
        .cuid('Producto inválido.')
        .optional(),

    bodegaOrigenId: z
        .string()
        .cuid('Bodega de origen inválida.')
        .optional(),

    bodegaDestinoId: z
        .string()
        .cuid('Bodega de destino inválida.')
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

export type CrearTransferenciaDto =
    z.infer<typeof CrearTransferenciaSchema>;

export type ConsultarTransferenciasDto =
    z.infer<typeof ConsultarTransferenciasSchema>;