"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificacionController = exports.NotificacionController = void 0;
const notificacion_service_1 = require("../services/notificacion.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
class NotificacionController {
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await notificacion_service_1.notificacionService.crear(req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Notificación creada correctamente.', 201);
    });
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await notificacion_service_1.notificacionService.obtenerTodos(req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Notificaciones obtenidas correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await notificacion_service_1.notificacionService.obtenerPorId(req.params.id);
        return api_response_1.ApiResponse.success(res, resultado, 'Notificación obtenida correctamente.');
    });
    obtenerMisNotificaciones = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await notificacion_service_1.notificacionService.obtenerPorUsuario(req.user.id, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Notificaciones obtenidas correctamente.');
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await notificacion_service_1.notificacionService.actualizar(req.params.id, req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Notificación actualizada correctamente.');
    });
    marcarLeida = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await notificacion_service_1.notificacionService.marcarLeida(req.params.id);
        return api_response_1.ApiResponse.success(res, resultado, 'Notificación marcada como leída correctamente.');
    });
    marcarTodasLeidas = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await notificacion_service_1.notificacionService.marcarTodasLeidas(req.user.id);
        return api_response_1.ApiResponse.success(res, resultado, 'Todas las notificaciones fueron marcadas como leídas.');
    });
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        await notificacion_service_1.notificacionService.eliminar(req.params.id);
        return api_response_1.ApiResponse.success(res, null, 'Notificación eliminada correctamente.');
    });
}
exports.NotificacionController = NotificacionController;
exports.notificacionController = new NotificacionController();
