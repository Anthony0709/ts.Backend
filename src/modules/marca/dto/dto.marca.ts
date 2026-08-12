import { z } from 'zod';

export const CrearMarcaSchema = z.object({
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
    estado: z
        .boolean()
        .optional()
        .default(true),
    empresaId: z
        .string()
        .cuid('Empresa inválida.')
}).strict();

export const ActualizarMarcaSchema = z.object({
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
    estado: z
        .boolean()
        .optional(),
    empresaId: z
        .string()
        .cuid('Empresa inválida.')
        .optional()
}).strict();

export type CrearMarcaDto =
    z.infer<typeof CrearMarcaSchema>;

export type ActualizarMarcaDto =
    z.infer<typeof ActualizarMarcaSchema>;