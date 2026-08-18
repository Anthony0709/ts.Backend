"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerPlanSchema = exports.ConsultarPlanesSchema = exports.ActualizarPlanSchema = exports.CrearPlanSchema = void 0;
const zod_1 = require("zod");
exports.CrearPlanSchema = zod_1.z.object({
    nombre: zod_1.z.string().trim().min(1, 'El nombre es obligatorio.').max(100, 'El nombre no puede superar los 100 caracteres.'),
    codigo: zod_1.z.string().trim().min(1, 'El código no puede estar vacío.').max(30, 'El código no puede superar los 30 caracteres.').optional(),
    descripcion: zod_1.z.string().trim().max(500, 'La descripción no puede superar los 500 caracteres.').optional(),
    precioMensual: zod_1.z.number().finite('El precio mensual debe ser un número válido.').min(0, 'El precio mensual no puede ser negativo.'),
    precioAnual: zod_1.z.number().finite('El precio anual debe ser un número válido.').min(0, 'El precio anual no puede ser negativo.').optional(),
    maxUsuarios: zod_1.z.number().int('El máximo de usuarios debe ser un entero.').min(1, 'El máximo de usuarios debe ser mayor que cero.').optional(),
    maxSucursales: zod_1.z.number().int('El máximo de sucursales debe ser un entero.').min(1, 'El máximo de sucursales debe ser mayor que cero.').optional(),
    maxBodegas: zod_1.z.number().int('El máximo de bodegas debe ser un entero.').min(1, 'El máximo de bodegas debe ser mayor que cero.').optional(),
    activo: zod_1.z.boolean().default(true)
}).strict();
exports.ActualizarPlanSchema = zod_1.z.object({
    nombre: zod_1.z.string().trim().min(1, 'El nombre es obligatorio.').max(100).optional(),
    codigo: zod_1.z.string().trim().min(1, 'El código no puede estar vacío.').max(30).nullable().optional(),
    descripcion: zod_1.z.string().trim().max(500).nullable().optional(),
    precioMensual: zod_1.z.number().finite('El precio mensual debe ser un número válido.').min(0).optional(),
    precioAnual: zod_1.z.number().finite('El precio anual debe ser un número válido.').min(0).nullable().optional(),
    maxUsuarios: zod_1.z.number().int('El máximo de usuarios debe ser un entero.').min(1).nullable().optional(),
    maxSucursales: zod_1.z.number().int('El máximo de sucursales debe ser un entero.').min(1).nullable().optional(),
    maxBodegas: zod_1.z.number().int('El máximo de bodegas debe ser un entero.').min(1).nullable().optional(),
    activo: zod_1.z.boolean().optional()
}).strict();
exports.ConsultarPlanesSchema = zod_1.z.object({
    search: zod_1.z.string().trim().max(100).optional(),
    activo: zod_1.z.coerce.boolean().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    sortBy: zod_1.z.string().trim().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('asc')
}).strict();
exports.ObtenerPlanSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('El ID del plan no es válido.')
}).strict();
