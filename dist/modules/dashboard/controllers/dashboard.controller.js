"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
class DashboardController {
    obtenerResumen = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await dashboard_service_1.dashboardService.obtenerResumen(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Resumen del dashboard obtenido correctamente.');
    });
    obtenerVentasPorPeriodo = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await dashboard_service_1.dashboardService.obtenerVentasPorPeriodo(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Ventas por periodo obtenidas correctamente.');
    });
    obtenerProductosBajoStock = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await dashboard_service_1.dashboardService.obtenerProductosBajoStock(req.user.empresaId, req.query.bodegaId);
        return api_response_1.ApiResponse.success(res, resultado, 'Productos con bajo stock obtenidos correctamente.');
    });
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
