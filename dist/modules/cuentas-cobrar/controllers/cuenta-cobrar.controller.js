"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuentaCobrarController = exports.CuentaCobrarController = void 0;
const cuenta_cobrar_service_1 = require("../services/cuenta-cobrar.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
class CuentaCobrarController {
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await cuenta_cobrar_service_1.cuentaCobrarService.crear(req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Cuenta por cobrar creada correctamente.', 201);
    });
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await cuenta_cobrar_service_1.cuentaCobrarService.obtenerTodos(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Cuentas por cobrar obtenidas correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await cuenta_cobrar_service_1.cuentaCobrarService.obtenerPorId(req.params.id, req.user.empresaId);
        return api_response_1.ApiResponse.success(res, resultado, 'Cuenta por cobrar obtenida correctamente.');
    });
    registrarAbono = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await cuenta_cobrar_service_1.cuentaCobrarService.registrarAbono(req.params.id, req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, resultado, 'Abono registrado correctamente.', 201);
    });
    obtenerAbonos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await cuenta_cobrar_service_1.cuentaCobrarService.obtenerAbonos(req.params.id, req.user.empresaId);
        return api_response_1.ApiResponse.success(res, resultado, 'Abonos obtenidos correctamente.');
    });
    actualizarVencidas = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await cuenta_cobrar_service_1.cuentaCobrarService.actualizarVencidas(req.user.empresaId);
        return api_response_1.ApiResponse.success(res, resultado, 'Cuentas vencidas actualizadas correctamente.');
    });
}
exports.CuentaCobrarController = CuentaCobrarController;
exports.cuentaCobrarController = new CuentaCobrarController();
