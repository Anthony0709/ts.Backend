"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planController = exports.PlanController = void 0;
const plan_service_1 = require("../services/plan.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
class PlanController {
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await plan_service_1.planService.crear(req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Plan creado correctamente.', 201);
    });
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await plan_service_1.planService.obtenerTodos(req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Planes obtenidos correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await plan_service_1.planService.obtenerPorId(req.params.id);
        return api_response_1.ApiResponse.success(res, resultado, 'Plan obtenido correctamente.');
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await plan_service_1.planService.actualizar(req.params.id, req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Plan actualizado correctamente.');
    });
    activar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await plan_service_1.planService.cambiarEstado(req.params.id, true);
        return api_response_1.ApiResponse.success(res, resultado, 'Plan activado correctamente.');
    });
    desactivar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await plan_service_1.planService.cambiarEstado(req.params.id, false);
        return api_response_1.ApiResponse.success(res, resultado, 'Plan desactivado correctamente.');
    });
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        await plan_service_1.planService.eliminar(req.params.id);
        return api_response_1.ApiResponse.success(res, null, 'Plan eliminado correctamente.');
    });
}
exports.PlanController = PlanController;
exports.planController = new PlanController();
