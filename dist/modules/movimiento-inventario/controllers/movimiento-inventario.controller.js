"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movimientoInventarioController = exports.MovimientoInventarioController = void 0;
const client_1 = require("@prisma/client");
const movimiento_inventario_service_1 = require("../services/movimiento-inventario.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const movimientoInventarioService = new movimiento_inventario_service_1.MovimientoInventarioService();
class MovimientoInventarioController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await movimientoInventarioService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Movimientos de inventario obtenidos correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const movimiento = await movimientoInventarioService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, movimiento, 'Movimiento de inventario obtenido correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const movimiento = await movimientoInventarioService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'MovimientoInventario',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se registró movimiento ${movimiento.tipo} de ${movimiento.cantidad} unidades del producto ${movimiento.producto.nombre} en la bodega ${movimiento.bodega.nombre}`,
            registroId: movimiento.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, movimiento, 'Movimiento de inventario registrado correctamente.', 201);
    });
}
exports.MovimientoInventarioController = MovimientoInventarioController;
exports.movimientoInventarioController = new MovimientoInventarioController();
