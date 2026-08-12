import { z } from 'zod';

/*=====================================================
========== CREAR MOVIMIENTO DE INVENTARIO =============
=====================================================*/

export const CrearMovimientoInventarioSchema = z.object({

    productoId: z
        .string()
        .cuid('Producto inválido.'),

    bodegaId: z
        .string()
        .cuid('Bodega inválida.'),

    tipo: z
        .enum([
            'ENTRADA',
            'SALIDA',
            'AJUSTE',
            'TRANSFERENCIA'
        ], {
            message: 'Tipo de movimiento inválido.'
        }),

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

}).strict();


/*=====================================================
============= CONSULTAR MOVIMIENTOS ===================
=====================================================*/

export const ConsultarMovimientoInventarioSchema = z.object({

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
======================== TYPES ========================
=====================================================*/

export type CrearMovimientoInventarioDto =
    z.infer<typeof CrearMovimientoInventarioSchema>;

export type ConsultarMovimientoInventarioDto =
    z.infer<typeof ConsultarMovimientoInventarioSchema>;