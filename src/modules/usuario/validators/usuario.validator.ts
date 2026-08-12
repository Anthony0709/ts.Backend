import { z } from 'zod';

export const crearUsuarioSchema = z.object({
    nombres: z
        .string()
        .trim()
        .min(2, 'Los nombres son obligatorios.')
        .max(100, 'Los nombres no pueden superar los 100 caracteres.'),
    apellidos: z
        .string()
        .trim()
        .min(2, 'Los apellidos son obligatorios.')
        .max(100, 'Los apellidos no pueden superar los 100 caracteres.'),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .max(100, 'La contraseña no puede superar los 100 caracteres.'),
    empresaId: z
        .string()
        .cuid('Empresa inválida.'),
    rolId: z
        .string()
        .cuid('Rol inválido.'),
    activo: z
        .boolean()
        .optional()
        .default(true)
}).strict();

export const actualizarUsuarioSchema = z.object({
    nombres: z
        .string()
        .trim()
        .min(2, 'Los nombres deben tener al menos 2 caracteres.')
        .max(100, 'Los nombres no pueden superar los 100 caracteres.')
        .optional(),
    apellidos: z
        .string()
        .trim()
        .min(2, 'Los apellidos deben tener al menos 2 caracteres.')
        .max(100, 'Los apellidos no pueden superar los 100 caracteres.')
        .optional(),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.')
        .optional(),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .max(100, 'La contraseña no puede superar los 100 caracteres.')
        .optional(),
    empresaId: z
        .string()
        .cuid('Empresa inválida.')
        .optional(),
    rolId: z
        .string()
        .cuid('Rol inválido.')
        .optional(),
    activo: z
        .boolean()
        .optional()
}).strict();