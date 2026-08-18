"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sucursalController = exports.SucursalController = void 0;
const sucursal_service_1 = require("../services/sucursal.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const sucursalService = new sucursal_service_1.SucursalService();
class SucursalController {
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await sucursalService.obtenerTodos(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Sucursales obtenidas correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const sucursal = await sucursalService.obtenerPorId(id, req.user.empresaId);
        return api_response_1.ApiResponse.success(res, sucursal, 'Sucursal obtenida correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const sucursal = await sucursalService.crear(req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, sucursal, 'Sucursal creada correctamente.', 201);
    });
    /*=====================================================
    ===================== ACTUALIZAR =====================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const sucursal = await sucursalService.actualizar(id, req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, sucursal, 'Sucursal actualizada correctamente.');
    });
    /*=====================================================
    ===================== ACTIVAR/DESACTIVAR =============
    =====================================================*/
    cambiarEstado = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const sucursal = await sucursalService.cambiarEstado(id, req.user.empresaId, req.body.estado);
        return api_response_1.ApiResponse.success(res, sucursal, req.body.estado
            ? 'Sucursal activada correctamente.'
            : 'Sucursal desactivada correctamente.');
    });
}
exports.SucursalController = SucursalController;
exports.sucursalController = new SucursalController();
