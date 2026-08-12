import { z } from 'zod';


/*=====================================================
===================== CREAR BODEGA ====================
=====================================================*/

export const CrearBodegaSchema = z.object({

    nombre: z
        .string()
        .trim()
        .min(
            2,
            'El nombre debe tener al menos 2 caracteres.'
        )
        .max(
            100,
            'El nombre no puede superar los 100 caracteres.'
        ),

    codigo: z
        .string()
        .trim()
        .min(
            1,
            'El código es obligatorio.'
        )
        .max(
            30,
            'El código no puede superar los 30 caracteres.'
        ),

    direccion: z
        .string()
        .trim()
        .max(
            250,
            'La dirección no puede superar los 250 caracteres.'
        )
        .optional(),

    responsable: z
        .string()
        .trim()
        .max(
            150,
            'El responsable no puede superar los 150 caracteres.'
        )
        .optional(),

    telefono: z
        .string()
        .trim()
        .max(
            20,
            'El teléfono no puede superar los 20 caracteres.'
        )
        .optional(),

    sucursalId: z
        .string()
        .cuid(
            'La sucursal no es válida.'
        )
        .optional(),

    estado: z
        .boolean()
        .optional()

}).strict();


/*=====================================================
=================== ACTUALIZAR BODEGA =================
=====================================================*/

export const ActualizarBodegaSchema = z.object({

    nombre: z
        .string()
        .trim()
        .min(
            2,
            'El nombre debe tener al menos 2 caracteres.'
        )
        .max(
            100,
            'El nombre no puede superar los 100 caracteres.'
        )
        .optional(),

    codigo: z
        .string()
        .trim()
        .min(
            1,
            'El código es obligatorio.'
        )
        .max(
            30,
            'El código no puede superar los 30 caracteres.'
        )
        .optional(),

    direccion: z
        .string()
        .trim()
        .max(
            250,
            'La dirección no puede superar los 250 caracteres.'
        )
        .optional(),

    responsable: z
        .string()
        .trim()
        .max(
            150,
            'El responsable no puede superar los 150 caracteres.'
        )
        .optional(),

    telefono: z
        .string()
        .trim()
        .max(
            20,
            'El teléfono no puede superar los 20 caracteres.'
        )
        .optional(),

    sucursalId: z
        .string()
        .cuid(
            'La sucursal no es válida.'
        )
        .nullable()
        .optional(),

    estado: z
        .boolean()
        .optional()

}).strict();


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const ConsultarBodegasSchema = z.object({

    nombre: z
        .string()
        .trim()
        .optional(),

    codigo: z
        .string()
        .trim()
        .optional(),

    sucursalId: z
        .string()
        .cuid(
            'La sucursal no es válida.'
        )
        .optional(),

    estado: z
        .coerce
        .boolean()
        .optional(),

    page: z
        .coerce
        .number()
        .int()
        .min(
            1,
            'La página debe ser mayor que cero.'
        )
        .optional(),

    limit: z
        .coerce
        .number()
        .int()
        .min(
            1,
            'El límite debe ser mayor que cero.'
        )
        .max(
            100,
            'El límite máximo es 100.'
        )
        .optional()

}).strict();


/*=====================================================
======================== TYPES ========================
=====================================================*/

export type CrearBodegaDto =
    z.infer<
        typeof CrearBodegaSchema
    >;

export type ActualizarBodegaDto =
    z.infer<
        typeof ActualizarBodegaSchema
    >;

export type ConsultarBodegasDto =
    z.infer<
        typeof ConsultarBodegasSchema
    >;