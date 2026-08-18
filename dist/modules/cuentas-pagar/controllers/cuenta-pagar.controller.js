"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuentaPagarController = exports.CuentaPagarController = void 0;
const client_1 = require("@prisma/client");
const cuenta_pagar_service_1 = require("../services/cuenta-pagar.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const cuentaPagarService = new cuenta_pagar_service_1.CuentaPagarService();
class CuentaPagarController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await cuentaPagarService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Cuentas por pagar obtenidas correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cuenta = await cuentaPagarService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, cuenta, 'Cuenta por pagar obtenida correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const cuenta = await cuentaPagarService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'CuentasPagar',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó la cuenta por pagar ${cuenta.numero}`,
            registroId: cuenta.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cuenta, 'Cuenta por pagar creada correctamente.', 201);
    });
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cuenta = await cuentaPagarService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'CuentasPagar',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó la cuenta por pagar ${cuenta.numero}`,
            registroId: cuenta.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cuenta, 'Cuenta por pagar actualizada correctamente.');
    });
    /*=====================================================
    ==================== REGISTRAR PAGO ==================
    =====================================================*/
    registrarPago = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const resultado = await cuentaPagarService.registrarPago(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'CuentasPagar',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se registró un pago de ${resultado.pago.monto} en la cuenta por pagar ${resultado.cuenta.numero}`,
            registroId: resultado.cuenta.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, resultado, 'Pago registrado correctamente.');
    });
    /*=====================================================
    =================== CONSULTAR PAGOS ==================
    =====================================================*/
    obtenerPagos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const resultado = await cuentaPagarService.obtenerPagos(id, req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Pagos obtenidos correctamente.');
    });
}
exports.CuentaPagarController = CuentaPagarController;
exports.cuentaPagarController = new CuentaPagarController();
