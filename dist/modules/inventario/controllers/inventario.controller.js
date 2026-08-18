"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventarioController = exports.InventarioController = void 0;
const client_1 = require("@prisma/client");
const inventario_service_1 = require("../services/inventario.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const inventarioService = new inventario_service_1.InventarioService();
class InventarioController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await inventarioService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Inventario obtenido correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const inventario = await inventarioService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, inventario, 'Inventario obtenido correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const inventario = await inventarioService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Inventario',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó inventario para el producto ${inventario.producto.nombre} en la bodega ${inventario.bodega.nombre}`,
            registroId: inventario.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, inventario, 'Inventario creado correctamente.', 201);
    });
    /*=====================================================
    ===================== AJUSTAR ========================
    =====================================================*/
    ajustar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await inventarioService.ajustar(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Inventario',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se realizó un movimiento ${resultado.movimiento.tipo} de ${resultado.movimiento.cantidad} unidades del producto ${resultado.inventario.producto.nombre} en la bodega ${resultado.inventario.bodega.nombre}`,
            registroId: resultado.inventario.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, resultado, 'Movimiento de inventario realizado correctamente.');
    });
    /*=====================================================
    ================= ACTUALIZAR STOCK ===================
    =====================================================*/
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const inventario = await inventarioService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Inventario',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se ajustó manualmente el stock del producto ${inventario.producto.nombre} en la bodega ${inventario.bodega.nombre}`,
            registroId: inventario.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, inventario, 'Stock actualizado correctamente.');
    });
    /*=====================================================
    ==================== MOVIMIENTOS =====================
    =====================================================*/
    obtenerMovimientos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await inventarioService.obtenerMovimientos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Movimientos de inventario obtenidos correctamente.');
    });
}
exports.InventarioController = InventarioController;
exports.inventarioController = new InventarioController();
