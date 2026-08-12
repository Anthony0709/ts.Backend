import { z } from 'zod';

/*=====================================================*
*==================== CREAR ROL =======================*
*=====================================================*/

export const CrearRolSchema = z.object({
    codigo: z
        .string()
        .trim()
        .max(20, 'El código no puede superar los 20 caracteres.')
        .optional(),
    nombre: z
        .string()
        .trim()
        .min(1, 'El nombre es obligatorio.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.'),
    descripcion: z
        .string()
        .trim()
        .max(255, 'La descripción no puede superar los 255 caracteres.')
        .optional(),
    empresaId: z
        .string()
        .min(1, 'La empresa es obligatoria.')
        .cuid('ID de empresa inválido.'),
    activo: z
    .boolean()
    .optional()
    .default(true)
}).strict();

export type CrearRolDto = z.infer<typeof CrearRolSchema>;

/*=====================================================*
*================== ACTUALIZAR ROL ====================*
*=====================================================*/

export const ActualizarRolSchema = CrearRolSchema.partial().extend({
    activo: z
        .boolean()
        .optional()
}).strict();

export type ActualizarRolDto = z.infer<typeof ActualizarRolSchema>;