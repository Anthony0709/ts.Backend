import { z } from 'zod';

/*=====================================================
=================== CREAR CLIENTE =====================
=====================================================*/

export const CrearClienteSchema = z.object({

    nombre: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.'),

    apellido: z
        .string()
        .trim()
        .min(2, 'El apellido debe tener al menos 2 caracteres.')
        .max(100, 'El apellido no puede superar los 100 caracteres.'),

    tipoIdentificacion: z
        .enum([
            'CEDULA',
            'RUC',
            'PASAPORTE',
            'OTRO'
        ], {
            message: 'Tipo de identificación inválido.'
        }),

    identificacion: z
        .string()
        .trim()
        .min(3, 'La identificación es obligatoria.')
        .max(20, 'La identificación no puede superar los 20 caracteres.'),

    tipoCliente: z
        .enum([
            'PERSONA',
            'EMPRESA'
        ], {
            message: 'Tipo de cliente inválido.'
        })
        .optional()
        .default('PERSONA'),

    razonSocial: z
        .string()
        .trim()
        .max(150, 'La razón social no puede superar los 150 caracteres.')
        .optional(),

    nombreComercial: z
        .string()
        .trim()
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.')
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

    direccion: z
        .string()
        .trim()
        .max(255, 'La dirección no puede superar los 255 caracteres.')
        .optional(),

    limiteCredito: z
        .number()
        .finite('El límite de crédito debe ser un número válido.')
        .min(0, 'El límite de crédito no puede ser negativo.')
        .optional(),

    diasCredito: z
        .number()
        .int('Los días de crédito deben ser un número entero.')
        .min(0, 'Los días de crédito no pueden ser negativos.')
        .optional(),

    observacion: z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional(),

    estado: z
        .boolean()
        .optional()
        .default(true),

    empresaId: z
        .string()
        .cuid('Empresa inválida.')

}).strict();


/*=====================================================
================ ACTUALIZAR CLIENTE ===================
=====================================================*/

export const ActualizarClienteSchema = z.object({

    nombre: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.')
        .optional(),

    apellido: z
        .string()
        .trim()
        .min(2, 'El apellido debe tener al menos 2 caracteres.')
        .max(100, 'El apellido no puede superar los 100 caracteres.')
        .optional(),

    tipoIdentificacion: z
        .enum([
            'CEDULA',
            'RUC',
            'PASAPORTE',
            'OTRO'
        ], {
            message: 'Tipo de identificación inválido.'
        })
        .optional(),

    identificacion: z
        .string()
        .trim()
        .min(3, 'La identificación es obligatoria.')
        .max(20, 'La identificación no puede superar los 20 caracteres.')
        .optional(),

    tipoCliente: z
        .enum([
            'PERSONA',
            'EMPRESA'
        ], {
            message: 'Tipo de cliente inválido.'
        })
        .optional(),

    razonSocial: z
        .string()
        .trim()
        .max(150, 'La razón social no puede superar los 150 caracteres.')
        .optional(),

    nombreComercial: z
        .string()
        .trim()
        .max(150, 'El nombre comercial no puede superar los 150 caracteres.')
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

    direccion: z
        .string()
        .trim()
        .max(255, 'La dirección no puede superar los 255 caracteres.')
        .optional(),

    limiteCredito: z
        .number()
        .finite('El límite de crédito debe ser un número válido.')
        .min(0, 'El límite de crédito no puede ser negativo.')
        .optional(),

    diasCredito: z
        .number()
        .int('Los días de crédito deben ser un número entero.')
        .min(0, 'Los días de crédito no pueden ser negativos.')
        .optional(),

    observacion: z
        .string()
        .trim()
        .max(500, 'La observación no puede superar los 500 caracteres.')
        .optional(),

    estado: z
        .boolean()
        .optional(),

    empresaId: z
        .string()
        .cuid('Empresa inválida.')
        .optional()

}).strict();


/*=====================================================
======================== TYPES =========================
=====================================================*/

export type CrearClienteDto =
    z.infer<typeof CrearClienteSchema>;

export type ActualizarClienteDto =
    z.infer<typeof ActualizarClienteSchema>;