"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ventaController = exports.VentaController = void 0;
const client_1 = require("@prisma/client");
const venta_service_1 = require("../services/venta.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const ventaService = new venta_service_1.VentaService();
class VentaController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await ventaService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Ventas obtenidas correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const venta = await ventaService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, venta, 'Venta obtenida correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const venta = await ventaService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Ventas',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó la venta ${venta.numero}`,
            registroId: venta.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, venta, 'Venta creada correctamente.', 201);
    });
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const venta = await ventaService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Ventas',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó la venta ${venta.numero}`,
            registroId: venta.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, venta, 'Venta actualizada correctamente.');
    });
    /*=====================================================
    ======================= APROBAR ======================
    =====================================================*/
    aprobar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const venta = await ventaService.aprobar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Ventas',
            accion: client_1.TipoAuditoria.APROBAR,
            descripcion: `Se aprobó la venta ${venta.numero}`,
            registroId: venta.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, venta, 'Venta aprobada correctamente.');
    });
    /*=====================================================
    ======================= ANULAR =======================
    =====================================================*/
    anular = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const venta = await ventaService.anular(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Ventas',
            accion: client_1.TipoAuditoria.ANULAR,
            descripcion: `Se anuló la venta ${venta.numero}`,
            registroId: venta.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, venta, 'Venta anulada correctamente.');
    });
}
exports.VentaController = VentaController;
exports.ventaController = new VentaController();
