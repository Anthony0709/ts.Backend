"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporteController = exports.ReporteController = void 0;
const reporte_service_1 = require("../services/reporte.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
class ReporteController {
    ventas = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await reporte_service_1.reporteService.ventas(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Reporte de ventas obtenido correctamente.');
    });
    compras = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await reporte_service_1.reporteService.compras(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Reporte de compras obtenido correctamente.');
    });
    inventario = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await reporte_service_1.reporteService.inventario(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Reporte de inventario obtenido correctamente.');
    });
    clientes = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await reporte_service_1.reporteService.clientes(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Reporte de clientes obtenido correctamente.');
    });
    cuentasCobrar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await reporte_service_1.reporteService.cuentasCobrar(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Reporte de cuentas por cobrar obtenido correctamente.');
    });
    cuentasPagar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await reporte_service_1.reporteService.cuentasPagar(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Reporte de cuentas por pagar obtenido correctamente.');
    });
    gastos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await reporte_service_1.reporteService.gastos(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Reporte de gastos obtenido correctamente.');
    });
}
exports.ReporteController = ReporteController;
exports.reporteController = new ReporteController();
