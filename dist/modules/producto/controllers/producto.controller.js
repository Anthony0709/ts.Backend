"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoController = exports.ProductoController = void 0;
const client_1 = require("@prisma/client");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const producto_service_1 = require("../services/producto.service");
const productoService = new producto_service_1.ProductoService();
class ProductoController {
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await productoService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Productos obtenidos correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const producto = await productoService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, producto, 'Producto obtenido correctamente.');
    });
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const producto = await productoService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Productos',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó el producto ${producto.nombre}`,
            registroId: producto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, producto, 'Producto creado correctamente.', 201);
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const producto = await productoService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Productos',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó el producto ${producto.nombre}`,
            registroId: producto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, producto, 'Producto actualizado correctamente.');
    });
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const producto = await productoService.eliminar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Productos',
            accion: client_1.TipoAuditoria.DELETE,
            descripcion: `Se desactivó el producto ${producto.nombre}`,
            registroId: producto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, producto, 'Producto desactivado correctamente.');
    });
    reactivar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const producto = await productoService.reactivar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Productos',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se reactivó el producto ${producto.nombre}`,
            registroId: producto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, producto, 'Producto reactivado correctamente.');
    });
}
exports.ProductoController = ProductoController;
exports.productoController = new ProductoController();
