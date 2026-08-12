import { z } from 'zod';

export const CrearCategoriaSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.'),
    descripcion: z
        .string()
        .trim()
        .max(255, 'La descripción no puede superar los 255 caracteres.')
        .optional(),
    color: z
        .string()
        .trim()
        .regex(
            /^#[0-9A-Fa-f]{6}$/,
            'El color debe tener formato hexadecimal. Ejemplo: #2563EB.'
        )
        .optional(),
    icono: z
        .string()
        .trim()
        .max(100, 'El icono no puede superar los 100 caracteres.')
        .optional(),
    orden: z
        .number()
        .int('El orden debe ser un número entero.')
        .min(0, 'El orden no puede ser negativo.')
        .optional()
        .default(0),
    estado: z
        .boolean()
        .optional()
        .default(true),
    empresaId: z
        .string()
        .cuid('Empresa inválida.')
}).strict();

export const ActualizarCategoriaSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.')
        .optional(),
    descripcion: z
        .string()
        .trim()
        .max(255, 'La descripción no puede superar los 255 caracteres.')
        .optional(),
    color: z
        .string()
        .trim()
        .regex(
            /^#[0-9A-Fa-f]{6}$/,
            'El color debe tener formato hexadecimal. Ejemplo: #2563EB.'
        )
        .optional(),
    icono: z
        .string()
        .trim()
        .max(100, 'El icono no puede superar los 100 caracteres.')
        .optional(),
    orden: z
        .number()
        .int('El orden debe ser un número entero.')
        .min(0, 'El orden no puede ser negativo.')
        .optional(),
    estado: z
        .boolean()
        .optional(),
    empresaId: z
        .string()
        .cuid('Empresa inválida.')
        .optional()
}).strict();

export type CrearCategoriaDto =
    z.infer<typeof CrearCategoriaSchema>;

export type ActualizarCategoriaDto =
    z.infer<typeof ActualizarCategoriaSchema>;