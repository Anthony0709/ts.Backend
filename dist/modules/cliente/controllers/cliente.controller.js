"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clienteController = exports.ClienteController = void 0;
const client_1 = require("@prisma/client");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const cliente_service_1 = require("../services/cliente.service");
const clienteService = new cliente_service_1.ClienteService();
class ClienteController {
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await clienteService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Clientes obtenidos correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cliente = await clienteService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, cliente, 'Cliente obtenido correctamente.');
    });
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const cliente = await clienteService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Clientes',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó el cliente ${cliente.nombre} ${cliente.apellido}`,
            registroId: cliente.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cliente, 'Cliente creado correctamente.', 201);
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cliente = await clienteService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Clientes',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó el cliente ${cliente.nombre} ${cliente.apellido}`,
            registroId: cliente.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cliente, 'Cliente actualizado correctamente.');
    });
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cliente = await clienteService.eliminar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Clientes',
            accion: client_1.TipoAuditoria.DELETE,
            descripcion: `Se desactivó el cliente ${cliente.nombre} ${cliente.apellido}`,
            registroId: cliente.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cliente, 'Cliente desactivado correctamente.');
    });
    reactivar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const cliente = await clienteService.reactivar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Clientes',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se reactivó el cliente ${cliente.nombre} ${cliente.apellido}`,
            registroId: cliente.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, cliente, 'Cliente reactivado correctamente.');
    });
}
exports.ClienteController = ClienteController;
exports.clienteController = new ClienteController();
