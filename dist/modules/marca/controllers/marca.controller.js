"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marcaController = exports.MarcaController = void 0;
const client_1 = require("@prisma/client");
const catchAsync_1 = require("../../../utils/catchAsync");
const api_response_1 = require("../../../utils/api-response");
const get_param_1 = require("../../../utils/get-param");
const auditoria_1 = require("../../../utils/auditoria");
const marca_service_1 = require("../services/marca.service");
const marcaService = new marca_service_1.MarcaService();
class MarcaController {
    obtenerTodos = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const resultado = await marcaService.obtenerTodos(req.user, req.query);
        return api_response_1.ApiResponse.success(res, resultado, 'Marcas obtenidas correctamente.');
    });
    obtenerPorId = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const marca = await marcaService.obtenerPorId(id, req.user);
        return api_response_1.ApiResponse.success(res, marca, 'Marca obtenida correctamente.');
    });
    crear = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const marca = await marcaService.crear(req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Marcas',
            accion: client_1.TipoAuditoria.CREATE,
            descripcion: `Se creó la marca ${marca.nombre}`,
            registroId: marca.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, marca, 'Marca creada correctamente.', 201);
    });
    actualizar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const marca = await marcaService.actualizar(id, req.body, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Marcas',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se actualizó la marca ${marca.nombre}`,
            registroId: marca.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, marca, 'Marca actualizada correctamente.');
    });
    eliminar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const marca = await marcaService.eliminar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Marcas',
            accion: client_1.TipoAuditoria.DELETE,
            descripcion: `Se desactivó la marca ${marca.nombre}`,
            registroId: marca.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, marca, 'Marca desactivada correctamente.');
    });
    reactivar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const id = (0, get_param_1.getParam)(req, 'id');
        const marca = await marcaService.reactivar(id, req.user);
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: req.user.empresaId,
            usuarioId: req.user.id,
            modulo: 'Marcas',
            accion: client_1.TipoAuditoria.UPDATE,
            descripcion: `Se reactivó la marca ${marca.nombre}`,
            registroId: marca.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return api_response_1.ApiResponse.success(res, marca, 'Marca reactivada correctamente.');
    });
}
exports.MarcaController = MarcaController;
exports.marcaController = new MarcaController();
