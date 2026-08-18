"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const usuario_service_1 = require("../services/usuario.service");
const usuarioService = new usuario_service_1.UsuarioService();
class UsuarioController {
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const data = await usuarioService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, data, 'Usuarios obtenidos correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const usuario = await usuarioService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, usuario, 'Usuario obtenido correctamente.');
    });
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const usuario = await usuarioService.crear(req.body, req.user, {
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        return api_response_1.ApiResponse.success(res, usuario, 'Usuario creado correctamente.', 201);
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const usuario = await usuarioService.actualizar(id, req.body, req.user, {
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        return api_response_1.ApiResponse.success(res, usuario, 'Usuario actualizado correctamente.');
    });
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const usuario = await usuarioService.eliminar(id, req.user, {
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        return api_response_1.ApiResponse.success(res, usuario, 'Usuario desactivado correctamente.');
    });
    reactivar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const usuario = await usuarioService.reactivar(id, req.user, {
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        return api_response_1.ApiResponse.success(res, usuario, 'Usuario reactivado correctamente.');
    });
}
exports.UsuarioController = UsuarioController;
