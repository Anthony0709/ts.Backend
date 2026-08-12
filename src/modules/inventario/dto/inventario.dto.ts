import { z } from 'zod';

/*=====================================================
============== CREAR / ASIGNAR INVENTARIO =============
=====================================================*/

export const CrearInventarioSchema = z.object({

    productoId: z
        .string()
        .cuid('Producto inválido.'),

    bodegaId: z
        .string()
        .cuid('Bodega inválida.'),

    stock: z
        .number()
        .int('El stock debe ser un número entero.')
        .min(0, 'El stock no puede ser negativo.')
        .default(0),

    empresaId: z
        .string()
        .cuid('Empresa inválida.')

}).strict();


/*=====================================================
==================== AJUSTAR STOCK ====================
=====================================================*/

export const AjustarInventarioSchema = z.object({

    productoId: z
        .string()
        .cuid('Producto inválido.'),

    bodegaId: z
        .string()
        .cuid('Bodega inválida.'),

    cantidad: z
        .number()
        .int('La cantidad debe ser un número entero.')
        .positive('La cantidad debe ser mayor que cero.'),
    
    tipo: z
        .enum([
            'ENTRADA',
            'SALIDA',
            'AJUSTE'
        ], {
            message: 'Tipo de movimiento inválido.'
        }),

    observacion: z
        .string()
        .trim()
        .max(
            500,
            'La observación no puede superar los 500 caracteres.'
        )
        .optional(),

    empresaId: z
        .string()
        .cuid('Empresa inválida.')

}).strict();


/*=====================================================
================ ACTUALIZAR INVENTARIO ================
=====================================================*/

export const ActualizarInventarioSchema = z.object({

    stock: z
        .number()
        .finite('El stock debe ser un número válido.')
        .min(0, 'El stock no puede ser negativo.')

}).strict();


/*=====================================================
==================== CONSULTAR ========================
=====================================================*/

export const ConsultarInventarioSchema = z.object({

    productoId: z
        .string()
        .cuid('Producto inválido.')
        .optional(),

    bodegaId: z
        .string()
        .cuid('Bodega inválida.')
        .optional(),

    estado: z
        .boolean()
        .optional()

}).strict();


/*=====================================================
======================== TYPES =========================
=====================================================*/

export type CrearInventarioDto =
    z.infer<typeof CrearInventarioSchema>;

export type AjustarInventarioDto =
    z.infer<typeof AjustarInventarioSchema>;

export type ActualizarInventarioDto =
    z.infer<typeof ActualizarInventarioSchema>;

export type ConsultarInventarioDto =
    z.infer<typeof ConsultarInventarioSchema>;