"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolController = void 0;
const rol_service_1 = require("../services/rol.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const service = new rol_service_1.RolService();
class RolController {
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await service.obtenerTodos(req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Roles obtenidos correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const rol = await service.obtenerPorId(id);
        return api_response_1.ApiResponse.success(res, rol, 'Rol obtenido correctamente.');
    });
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const rol = await service.crear(req.body);
        return api_response_1.ApiResponse.success(res, rol, 'Rol creado correctamente.', 201);
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const rol = await service.actualizar(id, req.body);
        return api_response_1.ApiResponse.success(res, rol, 'Rol actualizado correctamente.');
    });
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const rol = await service.eliminar(id);
        return api_response_1.ApiResponse.success(res, rol, 'Rol desactivado correctamente.');
    });
    reactivar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const rol = await service.reactivar(id);
        return api_response_1.ApiResponse.success(res, rol, 'Rol reactivado correctamente.');
    });
    obtenerPermisos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const permisos = await service.obtenerPermisos(id);
        return api_response_1.ApiResponse.success(res, permisos, 'Permisos obtenidos correctamente.');
    });
    guardarPermisos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const resultado = await service.guardarPermisos(id, req.body.permisos);
        return api_response_1.ApiResponse.success(res, resultado, 'Permisos actualizados correctamente.');
    });
}
exports.RolController = RolController;
