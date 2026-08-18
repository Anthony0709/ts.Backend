"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devolucionController = exports.DevolucionController = void 0;
const client_1 = require("@prisma/client");
const devolucion_service_1 = require("../services/devolucion.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const devolucionService = new devolucion_service_1.DevolucionService();
class DevolucionController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await devolucionService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Devoluciones obtenidas correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const devolucion = await devolucionService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, devolucion, 'Devolución obtenida correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const devolucion = await devolucionService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Devoluciones',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó la devolución ${devolucion.numero}`,
            registroId: devolucion.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, devolucion, 'Devolución creada correctamente.', 201);
    });
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const devolucion = await devolucionService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Devoluciones',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó la devolución ${devolucion.numero}`,
            registroId: devolucion.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, devolucion, 'Devolución actualizada correctamente.');
    });
    /*=====================================================
    ====================== APROBAR =======================
    =====================================================*/
    aprobar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const devolucion = await devolucionService.aprobar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Devoluciones',
            accion: client_1.TipoAuditoria.APROBAR,
            descripcion: `Se aprobó la devolución ${devolucion.numero}`,
            registroId: devolucion.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, devolucion, 'Devolución aprobada correctamente.');
    });
    /*=====================================================
    ======================= ANULAR =======================
    =====================================================*/
    anular = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const devolucion = await devolucionService.anular(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Devoluciones',
            accion: client_1.TipoAuditoria.ANULAR,
            descripcion: `Se anuló la devolución ${devolucion.numero}`,
            registroId: devolucion.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, devolucion, 'Devolución anulada correctamente.');
    });
}
exports.DevolucionController = DevolucionController;
exports.devolucionController = new DevolucionController();
