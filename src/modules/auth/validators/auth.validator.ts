import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string({
        message: 'El correo electrónico es obligatorio.'
    })
    .trim()
    .toLowerCase()
    .email('El correo electrónico no es válido.').max(150, 'El correo electrónico no puede superar los 150 caracteres.'),
    password: 
    z.string({
        message: 'La contraseña es obligatoria.'
    })
    .min(6, 'La contraseña debe tener al menos 6 caracteres.').max(100, 'La contraseña no puede superar los 100 caracteres.')
});