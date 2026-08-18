"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kardexController = exports.KardexController = void 0;
const kardex_service_1 = require("../services/kardex.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const kardexService = new kardex_service_1.KardexService();
class KardexController {
    /*=====================================================
    ======================= KARDEX =======================
    =====================================================*/
    obtener = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await kardexService.obtener(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Kardex obtenido correctamente.');
    });
    /*=====================================================
    ================= KARDEX POR PRODUCTO ===============
    =====================================================*/
    obtenerPorProducto = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const productoId = (0, get_param_1.getParam)(req, 'productoId');
        const resultado = await kardexService.obtenerPorProducto(productoId, req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Kardex del producto obtenido correctamente.');
    });
    /*=====================================================
    =================== KARDEX POR BODEGA ===============
    =====================================================*/
    obtenerPorBodega = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const bodegaId = (0, get_param_1.getParam)(req, 'bodegaId');
        const resultado = await kardexService.obtenerPorBodega(bodegaId, req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Kardex de la bodega obtenido correctamente.');
    });
}
exports.KardexController = KardexController;
exports.kardexController = new KardexController();
