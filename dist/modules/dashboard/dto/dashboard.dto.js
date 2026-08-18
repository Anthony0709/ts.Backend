"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardFiltroSchema = void 0;
const zod_1 = require("zod");
exports.DashboardFiltroSchema = zod_1.z.object({
    fechaDesde: zod_1.z.coerce.date().optional(),
    fechaHasta: zod_1.z.coerce.date().optional(),
    sucursalId: zod_1.z.string().cuid('La sucursal no es válida.').optional(),
    bodegaId: zod_1.z.string().cuid('La bodega no es válida.').optional()
}).strict().superRefine((data, ctx) => {
    if (data.fechaDesde && data.fechaHasta && data.fechaHasta < data.fechaDesde) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaHasta'],
            message: 'La fechaHasta no puede ser anterior a la fechaDesde.'
        });
    }
});
