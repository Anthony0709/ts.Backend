"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gastoController = exports.GastoController = void 0;
const client_1 = require("@prisma/client");
const gasto_service_1 = require("../services/gasto.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const gastoService = new gasto_service_1.GastoService();
class GastoController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await gastoService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Gastos obtenidos correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const gasto = await gastoService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, gasto, 'Gasto obtenido correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const gasto = await gastoService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Gastos',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó el gasto ${gasto.numero}`,
            registroId: gasto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, gasto, 'Gasto creado correctamente.', 201);
    });
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const gasto = await gastoService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Gastos',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó el gasto ${gasto.numero}`,
            registroId: gasto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, gasto, 'Gasto actualizado correctamente.');
    });
    /*=====================================================
    ======================= PAGAR ========================
    =====================================================*/
    pagar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const gasto = await gastoService.pagar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Gastos',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se marcó como pagado el gasto ${gasto.numero}`,
            registroId: gasto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, gasto, 'Gasto pagado correctamente.');
    });
    /*=====================================================
    ======================= ANULAR =======================
    =====================================================*/
    anular = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const gasto = await gastoService.anular(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Gastos',
            accion: client_1.TipoAuditoria.ANULAR,
            descripcion: `Se anuló el gasto ${gasto.numero}`,
            registroId: gasto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, gasto, 'Gasto anulado correctamente.');
    });
}
exports.GastoController = GastoController;
exports.gastoController = new GastoController();
