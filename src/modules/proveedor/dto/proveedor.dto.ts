import { z } from 'zod';

export const CrearProveedorSchema = z.object({
    nombreComercial: z
        .string()
        .trim()
        .min(2, 'El nombre comercial debe tener al menos 2 caracteres.')
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.'),
    razonSocial: z
        .string()
        .trim()
        .min(2, 'La razón social debe tener al menos 2 caracteres.')
        .max(150, 'La razón social no puede superar los 150 caracteres.'),
    ruc: z
        .string()
        .trim()
        .min(10, 'El RUC debe tener al menos 10 caracteres.')
        .max(20, 'El RUC no puede superar los 20 caracteres.'),
    contacto: z
        .string()
        .trim()
        .max(150, 'El contacto no puede superar los 150 caracteres.')
        .optional(),
    cargoContacto: z
        .string()
        .trim()
        .max(100, 'El cargo del contacto no puede superar los 100 caracteres.')
        .optional(),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.')
        .optional()
        .or(z.literal('')),
    telefono: z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    celular: z
        .string()
        .trim()
        .max(20, 'El celular no puede superar los 20 caracteres.')
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
    provincia: z
        .string()
        .trim()
        .max(100, 'La provincia no puede superar los 100 caracteres.')
        .optional(),
    pais: z
        .string()
        .trim()
        .max(100, 'El país no puede superar los 100 caracteres.')
        .optional()
        .default('Ecuador'),
    observaciones: z
        .string()
        .trim()
        .max(500, 'Las observaciones no pueden superar los 500 caracteres.')
        .optional(),
    diasCredito: z
        .number()
        .int('Los días de crédito deben ser un número entero.')
        .min(0, 'Los días de crédito no pueden ser negativos.')
        .optional()
        .default(0),
    limiteCredito: z
        .number()
        .finite('El límite de crédito debe ser un número válido.')
        .min(0, 'El límite de crédito no puede ser negativo.')
        .optional(),
    estado: z
        .boolean()
        .optional()
        .default(true),
    empresaId: z
        .string()
        .cuid('Empresa inválida.')
}).strict();

export const ActualizarProveedorSchema = z.object({
    nombreComercial: z
        .string()
        .trim()
        .min(2, 'El nombre comercial debe tener al menos 2 caracteres.')
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.')
        .optional(),
    razonSocial: z
        .string()
        .trim()
        .min(2, 'La razón social debe tener al menos 2 caracteres.')
        .max(150, 'La razón social no puede superar los 150 caracteres.')
        .optional(),
    ruc: z
        .string()
        .trim()
        .min(10, 'El RUC debe tener al menos 10 caracteres.')
        .max(20, 'El RUC no puede superar los 20 caracteres.')
        .optional(),
    contacto: z
        .string()
        .trim()
        .max(150, 'El contacto no puede superar los 150 caracteres.')
        .optional(),
    cargoContacto: z
        .string()
        .trim()
        .max(100, 'El cargo del contacto no puede superar los 100 caracteres.')
        .optional(),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.')
        .optional()
        .or(z.literal('')),
    telefono: z
        .string()
        .trim()
        .max(20, 'El teléfono no puede superar los 20 caracteres.')
        .optional(),
    celular: z
        .string()
        .trim()
        .max(20, 'El celular no puede superar los 20 caracteres.')
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
    provincia: z
        .string()
        .trim()
        .max(100, 'La provincia no puede superar los 100 caracteres.')
        .optional(),
    pais: z
        .string()
        .trim()
        .max(100, 'El país no puede superar los 100 caracteres.')
        .optional(),
    observaciones: z
        .string()
        .trim()
        .max(500, 'Las observaciones no pueden superar los 500 caracteres.')
        .optional(),
    diasCredito: z
        .number()
        .int('Los días de crédito deben ser un número entero.')
        .min(0, 'Los días de crédito no pueden ser negativos.')
        .optional(),
    limiteCredito: z
        .number()
        .finite('El límite de crédito debe ser un número válido.')
        .min(0, 'El límite de crédito no puede ser negativo.')
        .optional(),
    estado: z
        .boolean()
        .optional(),
    empresaId: z
        .string()
        .cuid('Empresa inválida.')
        .optional()
}).strict();

export type CrearProveedorDto =
    z.infer<typeof CrearProveedorSchema>;

export type ActualizarProveedorDto =
    z.infer<typeof ActualizarProveedorSchema>;