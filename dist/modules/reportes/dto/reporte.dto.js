"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporteGastosSchema = exports.ReporteCuentasPagarSchema = exports.ReporteCuentasCobrarSchema = exports.ReporteClientesSchema = exports.ReporteInventarioSchema = exports.ReporteComprasSchema = exports.ReporteVentasSchema = exports.FiltroReporteSchema = void 0;
const zod_1 = require("zod");
exports.FiltroReporteSchema = zod_1.z.object({
    fechaDesde: zod_1.z.coerce.date().optional(),
    fechaHasta: zod_1.z.coerce.date().optional(),
    sucursalId: zod_1.z.string().cuid('La sucursal no es válida.').optional(),
    bodegaId: zod_1.z.string().cuid('La bodega no es válida.').optional(),
    clienteId: zod_1.z.string().cuid('El cliente no es válido.').optional(),
    proveedorId: zod_1.z.string().cuid('El proveedor no es válido.').optional(),
    categoriaId: zod_1.z.string().cuid('La categoría no es válida.').optional(),
    productoId: zod_1.z.string().cuid('El producto no es válido.').optional(),
    estado: zod_1.z.string().trim().min(1).max(30).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20)
}).strict().superRefine((data, ctx) => {
    if (data.fechaDesde && data.fechaHasta && data.fechaHasta < data.fechaDesde) {
        ctx.addIssue({
            code: 'custom',
            path: ['fechaHasta'],
            message: 'La fechaHasta no puede ser anterior a la fechaDesde.'
        });
    }
});
exports.ReporteVentasSchema = exports.FiltroReporteSchema;
exports.ReporteComprasSchema = exports.FiltroReporteSchema;
exports.ReporteInventarioSchema = exports.FiltroReporteSchema;
exports.ReporteClientesSchema = exports.FiltroReporteSchema;
exports.ReporteCuentasCobrarSchema = exports.FiltroReporteSchema;
exports.ReporteCuentasPagarSchema = exports.FiltroReporteSchema;
exports.ReporteGastosSchema = exports.FiltroReporteSchema;
