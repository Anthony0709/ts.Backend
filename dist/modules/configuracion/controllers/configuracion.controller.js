"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuracionController = exports.ConfiguracionController = void 0;
const configuracion_service_1 = require("../services/configuracion.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
class ConfiguracionController {
    obtener = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await configuracion_service_1.configuracionService.obtener(req.user.empresaId);
        return api_response_1.ApiResponse.success(res, resultado, 'Configuración obtenida correctamente.');
    });
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await configuracion_service_1.configuracionService.crear(req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Configuración creada correctamente.', 201);
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await configuracion_service_1.configuracionService.actualizar(req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Configuración actualizada correctamente.');
    });
    restaurar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await configuracion_service_1.configuracionService.restaurar(req.user.empresaId);
        return api_response_1.ApiResponse.success(res, resultado, 'Configuración restaurada correctamente.');
    });
}
exports.ConfiguracionController = ConfiguracionController;
exports.configuracionController = new ConfiguracionController();
