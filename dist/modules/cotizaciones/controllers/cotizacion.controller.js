"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cotizacionController = exports.CotizacionController = void 0;
const client_1 = require("@prisma/client");
const cotizacion_service_1 = require("../services/cotizacion.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const cotizacionService = new cotizacion_service_1.CotizacionService();
class CotizacionController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await cotizacionService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Cotizaciones obtenidas correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cotizacion = await cotizacionService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, cotizacion, 'Cotización obtenida correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const cotizacion = await cotizacionService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Cotizaciones',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó la cotización ${cotizacion.numero}`,
            registroId: cotizacion.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cotizacion, 'Cotización creada correctamente.', 201);
    });
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cotizacion = await cotizacionService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Cotizaciones',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó la cotización ${cotizacion.numero}`,
            registroId: cotizacion.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cotizacion, 'Cotización actualizada correctamente.');
    });
    /*=====================================================
    ======================= APROBAR ======================
    =====================================================*/
    aprobar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cotizacion = await cotizacionService.aprobar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Cotizaciones',
            accion: client_1.TipoAuditoria.APROBAR,
            descripcion: `Se aprobó la cotización ${cotizacion.numero}`,
            registroId: cotizacion.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cotizacion, 'Cotización aprobada correctamente.');
    });
    /*=====================================================
    ====================== RECHAZAR ======================
    =====================================================*/
    rechazar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cotizacion = await cotizacionService.rechazar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Cotizaciones',
            accion: client_1.TipoAuditoria.ANULAR,
            descripcion: `Se rechazó la cotización ${cotizacion.numero}`,
            registroId: cotizacion.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cotizacion, 'Cotización rechazada correctamente.');
    });
    /*=====================================================
    ===================== CONVERTIR ======================
    =====================================================*/
    convertir = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cotizacion = await cotizacionService.convertir(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Cotizaciones',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se convirtió la cotización ${cotizacion.numero}`,
            registroId: cotizacion.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cotizacion, 'Cotización convertida correctamente.');
    });
}
exports.CotizacionController = CotizacionController;
exports.cotizacionController = new CotizacionController();
