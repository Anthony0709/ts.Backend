"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditoriaController = exports.AuditoriaController = void 0;
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_service_1 = require("../services/auditoria.service");
const auditoriaService = new auditoria_service_1.AuditoriaService();
class AuditoriaController {
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await auditoriaService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Registros de auditoría obtenidos correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const auditoria = await auditoriaService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, auditoria, 'Registro de auditoría obtenido correctamente.');
    });
}
exports.AuditoriaController = AuditoriaController;
exports.auditoriaController = new AuditoriaController();
