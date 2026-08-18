"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cajaController = exports.CajaController = void 0;
const caja_service_1 = require("../services/caja.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const cajaService = new caja_service_1.CajaService();
class CajaController {
    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await cajaService.obtenerTodos(req.user.empresaId, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Cajas obtenidas correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const caja = await cajaService.obtenerPorId(id, req.user.empresaId);
        return api_response_1.ApiResponse.success(res, caja, 'Caja obtenida correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const caja = await cajaService.crear(req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, caja, 'Caja creada correctamente.', 201);
    });
    /*=====================================================
    ===================== ACTUALIZAR =====================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const caja = await cajaService.actualizar(id, req.user.empresaId, req.body);
        return api_response_1.ApiResponse.success(res, caja, 'Caja actualizada correctamente.');
    });
    /*=====================================================
    ======================== ABRIR =======================
    =====================================================*/
    abrir = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const caja = await cajaService.abrir(id, req.user.empresaId, req.user.id, req.body);
        return api_response_1.ApiResponse.success(res, caja, 'Caja abierta correctamente.');
    });
    /*=====================================================
    ======================== CERRAR ======================
    =====================================================*/
    cerrar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const caja = await cajaService.cerrar(id, req.user.empresaId, req.user.id, req.body);
        return api_response_1.ApiResponse.success(res, caja, 'Caja cerrada correctamente.');
    });
    /*=====================================================
    =================== MOVIMIENTOS ======================
    =====================================================*/
    obtenerMovimientos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const cajaId = (0, get_param_1.getParam)(req, 'id');
        const resultado = await cajaService.obtenerMovimientos(req.user.empresaId, {
            ...req.query,
            cajaId
        });
        return api_response_1.ApiResponse.success(res, resultado, 'Movimientos de caja obtenidos correctamente.');
    });
    /*=====================================================
    ====================== RESUMEN =======================
    =====================================================*/
    obtenerResumen = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const resumen = await cajaService.obtenerResumen(id, req.user.empresaId);
        return api_response_1.ApiResponse.success(res, resumen, 'Resumen de caja obtenido correctamente.');
    });
}
exports.CajaController = CajaController;
exports.cajaController = new CajaController();
