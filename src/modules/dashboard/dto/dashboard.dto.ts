import { z } from 'zod';

export const DashboardFiltroSchema = z.object({
    fechaDesde: z.coerce.date().optional(),
    fechaHasta: z.coerce.date().optional(),
    sucursalId: z.string().cuid('La sucursal no es válida.').optional(),
    bodegaId: z.string().cuid('La bodega no es válida.').optional()
}).strict().superRefine((data, ctx) => {
    if (data.fechaDesde && data.fechaHasta && data.fechaHasta < data.fechaDesde) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaHasta'],
            message: 'La fechaHasta no puede ser anterior a la fechaDesde.'
        });
    }
});

export type DashboardFiltroDto = z.infer<typeof DashboardFiltroSchema>;