import { z } from 'zod';

export const crearEmpresaSchema = z.object({
    nombre: z
        .string({
            message: 'El nombre es obligatorio.'
        })
        .trim()
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(150, 'El nombre no puede superar los 150 caracteres.'),
    nombreComercial: z
        .string()
        .trim()
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.')
        .optional(),
    ruc: z
        .string({
            message: 'El RUC es obligatorio.'
        })
        .trim()
        .min(10, 'El RUC debe tener al menos 10 caracteres.')
        .max(20, 'El RUC no puede superar los 20 caracteres.'),
    email: z
        .string()
        .trim()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.')
        .optional(),
    telefono: z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    direccion: z
        .string()
        .trim()
        .max(255, 'La dirección no puede superar los 255 caracteres.')
        .optional(),
    ciudad: z
        .string()
        .trim()
        .max(100, 'La ciudad no puede superar los 100 caracteres.')
        .optional(),
    pais: z
        .string()
        .trim()
        .max(100, 'El país no puede superar los 100 caracteres.')
        .optional(),
    sitioWeb: z
        .string()
        .trim()
        .url('Sitio web inválido.')
        .max(255, 'El sitio web no puede superar los 255 caracteres.')
        .optional()
}).strict();

export const actualizarEmpresaSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(150, 'El nombre no puede superar los 150 caracteres.')
        .optional(),
    nombreComercial: z
        .string()
        .trim()
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.')
        .optional(),
    ruc: z
        .string()
        .trim()
        .min(10, 'El RUC debe tener al menos 10 caracteres.')
        .max(20, 'El RUC no puede superar los 20 caracteres.')
        .optional(),
    email: z
        .string()
        .trim()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.')
        .optional(),
    telefono: z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    direccion: z
        .string()
        .trim()
        .max(255, 'La dirección no puede superar los 255 caracteres.')
        .optional(),
    ciudad: z
        .string()
        .trim()
        .max(100, 'La ciudad no puede superar los 100 caracteres.')
        .optional(),
    pais: z
        .string()
        .trim()
        .max(100, 'El país no puede superar los 100 caracteres.')
        .optional(),
    sitioWeb: z
        .string()
        .trim()
        .url('Sitio web inválido.')
        .max(255, 'El sitio web no puede superar los 255 caracteres.')
        .optional(),
    activo: z
        .boolean()
        .optional()
}).strict();