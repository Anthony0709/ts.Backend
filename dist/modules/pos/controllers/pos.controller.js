"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posController = exports.PosController = void 0;
const pos_service_1 = require("../services/pos.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
class PosController {
    procesarVenta = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await pos_service_1.posService.procesarVenta(req.user.empresaId, req.user.id, req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Venta POS procesada correctamente.', 201);
    });
    buscarProductos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await pos_service_1.posService.buscarProductos(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Productos obtenidos correctamente.');
    });
    buscarClientes = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await pos_service_1.posService.buscarClientes(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Clientes obtenidos correctamente.');
    });
    consultarCaja = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await pos_service_1.posService.consultarCaja(req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Caja obtenida correctamente.');
    });
    resumenCaja = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await pos_service_1.posService.resumenCaja(req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Resumen de caja obtenido correctamente.');
    });
}
exports.PosController = PosController;
exports.posController = new PosController();
