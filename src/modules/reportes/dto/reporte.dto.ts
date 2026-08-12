import { z } from 'zod';

export const FiltroReporteSchema = z.object({
    fechaDesde: z.coerce.date().optional(),
    fechaHasta: z.coerce.date().optional(),
    sucursalId: z.string().cuid('La sucursal no es válida.').optional(),
    bodegaId: z.string().cuid('La bodega no es válida.').optional(),
    clienteId: z.string().cuid('El cliente no es válido.').optional(),
    proveedorId: z.string().cuid('El proveedor no es válido.').optional(),
    categoriaId: z.string().cuid('La categoría no es válida.').optional(),
    productoId: z.string().cuid('El producto no es válido.').optional(),
    estado: z.string().trim().min(1).max(30).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
}).strict().superRefine((data, ctx) => {
    if (data.fechaDesde && data.fechaHasta && data.fechaHasta < data.fechaDesde) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaHasta'],
            message: 'La fechaHasta no puede ser anterior a la fechaDesde.'
        });
    }
});

export const ReporteVentasSchema = FiltroReporteSchema;

export const ReporteComprasSchema = FiltroReporteSchema;

export const ReporteInventarioSchema = FiltroReporteSchema;

export const ReporteClientesSchema = FiltroReporteSchema;

export const ReporteCuentasCobrarSchema = FiltroReporteSchema;

export const ReporteCuentasPagarSchema = FiltroReporteSchema;

export const ReporteGastosSchema = FiltroReporteSchema;

export type FiltroReporteDto = z.infer<typeof FiltroReporteSchema>;
export type ReporteVentasDto = z.infer<typeof ReporteVentasSchema>;
export type ReporteComprasDto = z.infer<typeof ReporteComprasSchema>;
export type ReporteInventarioDto = z.infer<typeof ReporteInventarioSchema>;
export type ReporteClientesDto = z.infer<typeof ReporteClientesSchema>;
export type ReporteCuentasCobrarDto = z.infer<typeof ReporteCuentasCobrarSchema>;
export type ReporteCuentasPagarDto = z.infer<typeof ReporteCuentasPagarSchema>;
export type ReporteGastosDto = z.infer<typeof ReporteGastosSchema>;