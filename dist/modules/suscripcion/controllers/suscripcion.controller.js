"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suscripcionController = exports.SuscripcionController = void 0;
const client_1 = require("@prisma/client");
const suscripcion_service_1 = require("../services/suscripcion.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
class SuscripcionController {
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const suscripcion = await suscripcion_service_1.suscripcionService.crear(req.body);
        return api_response_1.ApiResponse.success(res, suscripcion, 'Suscripción creada correctamente.', 201);
    });
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const suscripciones = await suscripcion_service_1.suscripcionService.obtenerTodos(req.query);
        return api_response_1.ApiResponse.success(res, suscripciones, 'Suscripciones obtenidas correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const suscripcion = await suscripcion_service_1.suscripcionService.obtenerPorId(req.params.id);
        return api_response_1.ApiResponse.success(res, suscripcion, 'Suscripción obtenida correctamente.');
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const suscripcion = await suscripcion_service_1.suscripcionService.actualizar(req.params.id, req.body);
        return api_response_1.ApiResponse.success(res, suscripcion, 'Suscripción actualizada correctamente.');
    });
    activar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const suscripcion = await suscripcion_service_1.suscripcionService.cambiarEstado(req.params.id, client_1.EstadoSuscripcion.ACTIVA);
        return api_response_1.ApiResponse.success(res, suscripcion, 'Suscripción activada correctamente.');
    });
    suspender = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const suscripcion = await suscripcion_service_1.suscripcionService.cambiarEstado(req.params.id, client_1.EstadoSuscripcion.SUSPENDIDA);
        return api_response_1.ApiResponse.success(res, suscripcion, 'Suscripción suspendida correctamente.');
    });
    cancelar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const suscripcion = await suscripcion_service_1.suscripcionService.cancelar(req.params.id, req.body?.motivo);
        return api_response_1.ApiResponse.success(res, suscripcion, 'Suscripción cancelada correctamente.');
    });
    renovar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const suscripcion = await suscripcion_service_1.suscripcionService.renovar(req.params.id);
        return api_response_1.ApiResponse.success(res, suscripcion, 'Suscripción renovada correctamente.');
    });
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        await suscripcion_service_1.suscripcionService.eliminar(req.params.id);
        return api_response_1.ApiResponse.success(res, null, 'Suscripción eliminada correctamente.');
    });
}
exports.SuscripcionController = SuscripcionController;
exports.suscripcionController = new SuscripcionController();
