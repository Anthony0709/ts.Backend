import { z } from 'zod';


/*=====================================================
==================== CREAR SUCURSAL ===================
=====================================================*/

export const CrearSucursalSchema = z.object({

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

    telefono: z
        .string()
        .trim()
        .max(
            20,
            'El teléfono no puede superar los 20 caracteres.'
        )
        .optional(),

    email: z
        .string()
        .trim()
        .email(
            'El correo electrónico no es válido.'
        )
        .max(
            150,
            'El correo no puede superar los 150 caracteres.'
        )
        .optional(),

    ciudad: z
        .string()
        .trim()
        .max(
            100,
            'La ciudad no puede superar los 100 caracteres.'
        )
        .optional(),

    bodegaPrincipalId: z
        .string()
        .cuid(
            'La bodega principal no es válida.'
        )
        .optional(),

    estado: z
        .boolean()
        .optional()

}).strict();


/*=====================================================
================== ACTUALIZAR SUCURSAL ================
=====================================================*/

export const ActualizarSucursalSchema = z.object({

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

    telefono: z
        .string()
        .trim()
        .max(
            20,
            'El teléfono no puede superar los 20 caracteres.'
        )
        .optional(),

    email: z
        .string()
        .trim()
        .email(
            'El correo electrónico no es válido.'
        )
        .max(
            150,
            'El correo no puede superar los 150 caracteres.'
        )
        .optional(),

    ciudad: z
        .string()
        .trim()
        .max(
            100,
            'La ciudad no puede superar los 100 caracteres.'
        )
        .optional(),

    bodegaPrincipalId: z
        .string()
        .cuid(
            'La bodega principal no es válida.'
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

export const ConsultarSucursalesSchema = z.object({

    nombre: z
        .string()
        .trim()
        .optional(),

    codigo: z
        .string()
        .trim()
        .optional(),

    ciudad: z
        .string()
        .trim()
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
========================= TYPES ========================
=====================================================*/

export type CrearSucursalDto =
    z.infer<
        typeof CrearSucursalSchema
    >;

export type ActualizarSucursalDto =
    z.infer<
        typeof ActualizarSucursalSchema
    >;

export type ConsultarSucursalesDto =
    z.infer<
        typeof ConsultarSucursalesSchema
    >;