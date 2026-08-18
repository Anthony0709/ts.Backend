"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordenCompraController = exports.OrdenCompraController = void 0;
const client_1 = require("@prisma/client");
const orden_compra_service_1 = require("../services/orden-compra.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const ordenCompraService = new orden_compra_service_1.OrdenCompraService();
class OrdenCompraController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await ordenCompraService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Órdenes de compra obtenidas correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const orden = await ordenCompraService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, orden, 'Orden de compra obtenida correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const orden = await ordenCompraService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'OrdenesCompra',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó la orden de compra ${orden.numero}`,
            registroId: orden.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, orden, 'Orden de compra creada correctamente.', 201);
    });
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const orden = await ordenCompraService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'OrdenesCompra',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó la orden de compra ${orden.numero}`,
            registroId: orden.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, orden, 'Orden de compra actualizada correctamente.');
    });
    /*=====================================================
    ======================= APROBAR ======================
    =====================================================*/
    aprobar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const orden = await ordenCompraService.aprobar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'OrdenesCompra',
            accion: client_1.TipoAuditoria.APROBAR,
            descripcion: `Se aprobó la orden de compra ${orden.numero}`,
            registroId: orden.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, orden, 'Orden de compra aprobada correctamente.');
    });
    /*=====================================================
    ======================= CANCELAR =====================
    =====================================================*/
    cancelar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const orden = await ordenCompraService.cancelar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'OrdenesCompra',
            accion: client_1.TipoAuditoria.ANULAR,
            descripcion: `Se canceló la orden de compra ${orden.numero}`,
            registroId: orden.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, orden, 'Orden de compra cancelada correctamente.');
    });
}
exports.OrdenCompraController = OrdenCompraController;
exports.ordenCompraController = new OrdenCompraController();
