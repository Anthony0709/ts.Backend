"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaController = void 0;
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const empresa_service_1 = require("../services/empresa.service");
const service = new empresa_service_1.EmpresaService();
class EmpresaController {
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await service.obtenerTodos(req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Empresas obtenidas correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const empresa = await service.obtenerPorId(id);
        return api_response_1.ApiResponse.success(res, empresa, 'Empresa obtenida correctamente.');
    });
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const empresa = await service.crear(req.body, req.user);
        return api_response_1.ApiResponse.success(res, empresa, 'Empresa creada correctamente.', 201);
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const empresa = await service.actualizar(id, req.body, req.user);
        return api_response_1.ApiResponse.success(res, empresa, 'Empresa actualizada correctamente.');
    });
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const empresa = await service.eliminar(id, req.user);
        return api_response_1.ApiResponse.success(res, empresa, 'Empresa desactivada correctamente.');
    });
    reactivar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const empresa = await service.reactivar(id, req.user);
        return api_response_1.ApiResponse.success(res, empresa, 'Empresa reactivada correctamente.');
    });
}
exports.EmpresaController = EmpresaController;
