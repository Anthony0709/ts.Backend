import {
    ReporteVentasSchema,
    ReporteComprasSchema,
    ReporteInventarioSchema,
    ReporteClientesSchema,
    ReporteCuentasCobrarSchema,
    ReporteCuentasPagarSchema,
    ReporteGastosSchema
} from '../dto/reporte.dto';

export const validarReporteVentas = ReporteVentasSchema;
export const validarReporteCompras = ReporteComprasSchema;
export const validarReporteInventario = ReporteInventarioSchema;
export const validarReporteClientes = ReporteClientesSchema;
export const validarReporteCuentasCobrar = ReporteCuentasCobrarSchema;
export const validarReporteCuentasPagar = ReporteCuentasPagarSchema;
export const validarReporteGastos = ReporteGastosSchema;