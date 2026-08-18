"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodegaController = exports.BodegaController = void 0;
const bodega_service_1 = require("../services/bodega.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const bodegaService = new bodega_service_1.BodegaService();
class BodegaController {
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await bodegaService.obtenerTodos(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Bodegas obtenidas correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const bodega = await bodegaService.obtenerPorId(id, req.user.empresaId);
        return api_response_1.ApiResponse.success(res, bodega, 'Bodega obtenida correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const bodega = await bodegaService.crear(req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, bodega, 'Bodega creada correctamente.', 201);
    });
    /*=====================================================
    ===================== ACTUALIZAR =====================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const bodega = await bodegaService.actualizar(id, req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, bodega, 'Bodega actualizada correctamente.');
    });
    /*=====================================================
    ===================== ACTIVAR/DESACTIVAR =============
    =====================================================*/
    cambiarEstado = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const bodega = await bodegaService.cambiarEstado(id, req.user.empresaId, req.body.estado);
        return api_response_1.ApiResponse.success(res, bodega, req.body.estado
            ? 'Bodega activada correctamente.'
            : 'Bodega desactivada correctamente.');
    });
}
exports.BodegaController = BodegaController;
exports.bodegaController = new BodegaController();
