import { z } from 'zod';

export const CrearProductoSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(150, 'El nombre no puede superar los 150 caracteres.'),
    descripcion: z
        .string()
        .trim()
        .max(500, 'La descripción no puede superar los 500 caracteres.')
        .optional(),
    imagen: z
        .string()
        .trim()
        .url('La URL de la imagen no es válida.')
        .optional(),
    precioCompra: z
        .number()
        .finite('El precio de compra no es válido.')
        .min(0, 'El precio de compra no puede ser negativo.')
        .multipleOf(0.01, 'El precio de compra puede tener máximo 2 decimales.'),
    precioVenta: z
        .number()
        .finite('El precio de venta no es válido.')
        .min(0, 'El precio de venta no puede ser negativo.')
        .multipleOf(0.01, 'El precio de venta puede tener máximo 2 decimales.'),
    stockMinimo: z
        .number()
        .int('El stock mínimo debe ser un número entero.')
        .min(0, 'El stock mínimo no puede ser negativo.')
        .optional()
        .default(0),
    stockMaximo: z
        .number()
        .int('El stock máximo debe ser un número entero.')
        .min(0, 'El stock máximo no puede ser negativo.')
        .optional(),
    estado: z
        .boolean()
        .optional()
        .default(true),
    categoriaId: z
        .string()
        .cuid('Categoría inválida.'),
    marcaId: z
        .string()
        .cuid('Marca inválida.'),
    empresaId: z
        .string()
        .cuid('Empresa inválida.')
}).strict().superRefine((data, ctx) => {
    if (
        data.stockMaximo !== undefined &&
        data.stockMaximo < data.stockMinimo
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['stockMaximo'],
            message: 'El stock máximo no puede ser menor que el stock mínimo.'
        });
    }
});

export const ActualizarProductoSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(150, 'El nombre no puede superar los 150 caracteres.')
        .optional(),
    descripcion: z
        .string()
        .trim()
        .max(500, 'La descripción no puede superar los 500 caracteres.')
        .optional(),
    imagen: z
        .string()
        .trim()
        .url('La URL de la imagen no es válida.')
        .optional(),
    precioCompra: z
        .number()
        .finite('El precio de compra no es válido.')
        .min(0, 'El precio de compra no puede ser negativo.')
        .multipleOf(0.01, 'El precio de compra puede tener máximo 2 decimales.')
        .optional(),
    precioVenta: z
        .number()
        .finite('El precio de venta no es válido.')
        .min(0, 'El precio de venta no puede ser negativo.')
        .multipleOf(0.01, 'El precio de venta puede tener máximo 2 decimales.')
        .optional(),
    stockMinimo: z
        .number()
        .int('El stock mínimo debe ser un número entero.')
        .min(0, 'El stock mínimo no puede ser negativo.')
        .optional(),
    stockMaximo: z
        .number()
        .int('El stock máximo debe ser un número entero.')
        .min(0, 'El stock máximo no puede ser negativo.')
        .optional(),
    estado: z
        .boolean()
        .optional(),
    categoriaId: z
        .string()
        .cuid('Categoría inválida.')
        .optional(),
    marcaId: z
        .string()
        .cuid('Marca inválida.')
        .optional(),
    empresaId: z
        .string()
        .cuid('Empresa inválida.')
        .optional()
}).strict();

export type CrearProductoDto =
    z.infer<typeof CrearProductoSchema>;

export type ActualizarProductoDto =
    z.infer<typeof ActualizarProductoSchema>;