"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveedorController = exports.ProveedorController = void 0;
const client_1 = require("@prisma/client");
const proveedor_service_1 = require("../services/proveedor.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const proveedorService = new proveedor_service_1.ProveedorService();
class ProveedorController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await proveedorService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Proveedores obtenidos correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const proveedor = await proveedorService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, proveedor, 'Proveedor obtenido correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const proveedor = await proveedorService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Proveedores',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó el proveedor ${proveedor.nombreComercial}`,
            registroId: proveedor.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, proveedor, 'Proveedor creado correctamente.', 201);
    });
    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const proveedor = await proveedorService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Proveedores',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó el proveedor ${proveedor.nombreComercial}`,
            registroId: proveedor.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, proveedor, 'Proveedor actualizado correctamente.');
    });
    /*=====================================================
    ====================== ELIMINAR ======================
    =====================================================*/
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const proveedor = await proveedorService.eliminar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Proveedores',
            accion: client_1.TipoAuditoria.DELETE,
            descripcion: `Se desactivó el proveedor ${proveedor.nombreComercial}`,
            registroId: proveedor.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, proveedor, 'Proveedor desactivado correctamente.');
    });
    /*=====================================================
    ====================== REACTIVAR =====================
    =====================================================*/
    reactivar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const proveedor = await proveedorService.reactivar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Proveedores',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se reactivó el proveedor ${proveedor.nombreComercial}`,
            registroId: proveedor.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, proveedor, 'Proveedor reactivado correctamente.');
    });
}
exports.ProveedorController = ProveedorController;
exports.proveedorController = new ProveedorController();
