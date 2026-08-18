"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriaController = exports.CategoriaController = void 0;
const client_1 = require("@prisma/client");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const categoria_service_1 = require("../services/categoria.service");
const categoriaService = new categoria_service_1.CategoriaService();
class CategoriaController {
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await categoriaService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Categorías obtenidas correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const categoria = await categoriaService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, categoria, 'Categoría obtenida correctamente.');
    });
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const categoria = await categoriaService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Categorias',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó la categoría ${categoria.nombre}`,
            registroId: categoria.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, categoria, 'Categoría creada correctamente.', 201);
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const categoria = await categoriaService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Categorias',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó la categoría ${categoria.nombre}`,
            registroId: categoria.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, categoria, 'Categoría actualizada correctamente.');
    });
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const categoria = await categoriaService.eliminar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Categorias',
            accion: client_1.TipoAuditoria.DELETE,
            descripcion: `Se desactivó la categoría ${categoria.nombre}`,
            registroId: categoria.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, categoria, 'Categoría desactivada correctamente.');
    });
    reactivar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const categoria = await categoriaService.reactivar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Categorias',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se reactivó la categoría ${categoria.nombre}`,
            registroId: categoria.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, categoria, 'Categoría reactivada correctamente.');
    });
}
exports.CategoriaController = CategoriaController;
exports.categoriaController = new CategoriaController();
