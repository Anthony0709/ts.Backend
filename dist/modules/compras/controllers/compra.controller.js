"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compraController = exports.CompraController = void 0;
const client_1 = require("@prisma/client");
const compra_service_1 = require("../services/compra.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const compraService = new compra_service_1.CompraService();
class CompraController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await compraService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Compras obtenidas correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const compra = await compraService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, compra, 'Compra obtenida correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const compra = await compraService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Compras',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó la compra ${compra.numero}`,
            registroId: compra.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, compra, 'Compra creada correctamente.', 201);
    });
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const compra = await compraService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Compras',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó la compra ${compra.numero}`,
            registroId: compra.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, compra, 'Compra actualizada correctamente.');
    });
    /*=====================================================
    ======================= APROBAR ======================
    =====================================================*/
    aprobar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const compra = await compraService.aprobar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Compras',
            accion: client_1.TipoAuditoria.APROBAR,
            descripcion: `Se aprobó la compra ${compra?.numero}`,
            registroId: compra?.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, compra, 'Compra aprobada correctamente.');
    });
    /*=====================================================
    ======================== ANULAR ======================
    =====================================================*/
    anular = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const compra = await compraService.anular(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Compras',
            accion: client_1.TipoAuditoria.ANULAR,
            descripcion: `Se anuló la compra ${compra.numero}`,
            registroId: compra.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, compra, 'Compra anulada correctamente.');
    });
}
exports.CompraController = CompraController;
exports.compraController = new CompraController();
