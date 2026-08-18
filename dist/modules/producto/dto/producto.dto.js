"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarProductoSchema = exports.CrearProductoSchema = void 0;
const zod_1 = require("zod");
exports.CrearProductoSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(150, 'El nombre no puede superar los 150 caracteres.'),
    descripcion: zod_1.z
        .string()
        .trim()
        .max(500, 'La descripción no puede superar los 500 caracteres.')
        .optional(),
    imagen: zod_1.z
        .string()
        .trim()
        .url('La URL de la imagen no es válida.')
        .optional(),
    precioCompra: zod_1.z
        .number()
        .finite('El precio de compra no es válido.')
        .min(0, 'El precio de compra no puede ser negativo.')
        .multipleOf(0.01, 'El precio de compra puede tener máximo 2 decimales.'),
    precioVenta: zod_1.z
        .number()
        .finite('El precio de venta no es válido.')
        .min(0, 'El precio de venta no puede ser negativo.')
        .multipleOf(0.01, 'El precio de venta puede tener máximo 2 decimales.'),
    stockMinimo: zod_1.z
        .number()
        .int('El stock mínimo debe ser un número entero.')
        .min(0, 'El stock mínimo no puede ser negativo.')
        .optional()
        .default(0),
    stockMaximo: zod_1.z
        .number()
        .int('El stock máximo debe ser un número entero.')
        .min(0, 'El stock máximo no puede ser negativo.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional()
        .default(true),
    categoriaId: zod_1.z
        .string()
        .cuid('Categoría inválida.'),
    marcaId: zod_1.z
        .string()
        .cuid('Marca inválida.'),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
}).strict().superRefine((data, ctx) => {
    if (data.stockMaximo !== undefined &&
        data.stockMaximo < data.stockMinimo) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['stockMaximo'],
            message: 'El stock máximo no puede ser menor que el stock mínimo.'
        });
    }
});
exports.ActualizarProductoSchema = zod_1.z.object({
    nombre: zod_1.z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(150, 'El nombre no puede superar los 150 caracteres.')
        .optional(),
    descripcion: zod_1.z
        .string()
        .trim()
        .max(500, 'La descripción no puede superar los 500 caracteres.')
        .optional(),
    imagen: zod_1.z
        .string()
        .trim()
        .url('La URL de la imagen no es válida.')
        .optional(),
    precioCompra: zod_1.z
        .number()
        .finite('El precio de compra no es válido.')
        .min(0, 'El precio de compra no puede ser negativo.')
        .multipleOf(0.01, 'El precio de compra puede tener máximo 2 decimales.')
        .optional(),
    precioVenta: zod_1.z
        .number()
        .finite('El precio de venta no es válido.')
        .min(0, 'El precio de venta no puede ser negativo.')
        .multipleOf(0.01, 'El precio de venta puede tener máximo 2 decimales.')
        .optional(),
    stockMinimo: zod_1.z
        .number()
        .int('El stock mínimo debe ser un número entero.')
        .min(0, 'El stock mínimo no puede ser negativo.')
        .optional(),
    stockMaximo: zod_1.z
        .number()
        .int('El stock máximo debe ser un número entero.')
        .min(0, 'El stock máximo no puede ser negativo.')
        .optional(),
    estado: zod_1.z
        .boolean()
        .optional(),
    categoriaId: zod_1.z
        .string()
        .cuid('Categoría inválida.')
        .optional(),
    marcaId: zod_1.z
        .string()
        .cuid('Marca inválida.')
        .optional(),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
        .optional()
}).strict();
