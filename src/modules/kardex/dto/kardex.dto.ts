import { z } from 'zod';

/*=====================================================
==================== CONSULTAR KARDEX =================
=====================================================*/

export const ConsultarKardexSchema = z.object({

    productoId: z
        .string()
        .cuid('Producto inválido.')
        .optional(),

    bodegaId: z
        .string()
        .cuid('Bodega inválida.')
        .optional(),

    tipo: z
        .enum([
            'ENTRADA',
            'SALIDA',
            'AJUSTE',
            'TRANSFERENCIA'
        ], {
            message: 'Tipo de movimiento inválido.'
        })
        .optional(),

    fechaDesde: z
        .string()
        .datetime({
            message: 'La fecha inicial no es válida.'
        })
        .optional(),

    fechaHasta: z
        .string()
        .datetime({
            message: 'La fecha final no es válida.'
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

}).strict();


/*=====================================================
======================== TYPES =========================
=====================================================*/

export type ConsultarKardexDto =
    z.infer<typeof ConsultarKardexSchema>;