import { z } from 'zod';
export const CrearPlanSchema = z.object({
    nombre: z.string().trim().min(1, 'El nombre es obligatorio.').max(100, 'El nombre no puede superar los 100 caracteres.'),
    codigo: z.string().trim().min(1, 'El código no puede estar vacío.').max(30, 'El código no puede superar los 30 caracteres.').optional(),
    descripcion: z.string().trim().max(500, 'La descripción no puede superar los 500 caracteres.').optional(),
    precioMensual: z.number().finite('El precio mensual debe ser un número válido.').min(0, 'El precio mensual no puede ser negativo.'),
    precioAnual: z.number().finite('El precio anual debe ser un número válido.').min(0, 'El precio anual no puede ser negativo.').optional(),
    maxUsuarios: z.number().int('El máximo de usuarios debe ser un entero.').min(1, 'El máximo de usuarios debe ser mayor que cero.').optional(),
    maxSucursales: z.number().int('El máximo de sucursales debe ser un entero.').min(1, 'El máximo de sucursales debe ser mayor que cero.').optional(),
    maxBodegas: z.number().int('El máximo de bodegas debe ser un entero.').min(1, 'El máximo de bodegas debe ser mayor que cero.').optional(),
    activo: z.boolean().default(true)
}).strict();
export const ActualizarPlanSchema = z.object({
    nombre: z.string().trim().min(1, 'El nombre es obligatorio.').max(100).optional(),
    codigo: z.string().trim().min(1, 'El código no puede estar vacío.').max(30).nullable().optional(),
    descripcion: z.string().trim().max(500).nullable().optional(),
    precioMensual: z.number().finite('El precio mensual debe ser un número válido.').min(0).optional(),
    precioAnual: z.number().finite('El precio anual debe ser un número válido.').min(0).nullable().optional(),
    maxUsuarios: z.number().int('El máximo de usuarios debe ser un entero.').min(1).nullable().optional(),
    maxSucursales: z.number().int('El máximo de sucursales debe ser un entero.').min(1).nullable().optional(),
    maxBodegas: z.number().int('El máximo de bodegas debe ser un entero.').min(1).nullable().optional(),
    activo: z.boolean().optional()
}).strict();
export const ConsultarPlanesSchema = z.object({
    search: z.string().trim().max(100).optional(),
    activo: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.string().trim().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc')
}).strict();
export const ObtenerPlanSchema = z.object({
    id: z.string().cuid('El ID del plan no es válido.')
}).strict();
export type CrearPlanDto = z.infer<typeof CrearPlanSchema>;
export type ActualizarPlanDto = z.infer<typeof ActualizarPlanSchema>;
export type ConsultarPlanesDto = z.infer<typeof ConsultarPlanesSchema>;
export type ObtenerPlanDto = z.infer<typeof ObtenerPlanSchema>;