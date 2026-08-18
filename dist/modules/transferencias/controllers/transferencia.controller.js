"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferenciaController = exports.TransferenciaController = void 0;
const client_1 = require("@prisma/client");
const transferencia_service_1 = require("../services/transferencia.service");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const transferenciaService = new transferencia_service_1.TransferenciaService();
class TransferenciaController {
    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await transferenciaService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Transferencias obtenidas correctamente.');
    });
    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const transferencia = await transferenciaService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, transferencia, 'Transferencia obtenida correctamente.');
    });
    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const transferencia = await transferenciaService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Transferencias',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se transfirieron ${transferencia.cantidad} unidades del producto ${transferencia.producto.nombre} desde ${transferencia.origen.bodega.nombre} hacia ${transferencia.destino.bodega.nombre}`,
            registroId: transferencia.origen.movimiento.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, transferencia, 'Transferencia realizada correctamente.', 201);
    });
}
exports.TransferenciaController = TransferenciaController;
exports.transferenciaController = new TransferenciaController();
