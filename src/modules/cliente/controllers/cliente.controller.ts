import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';
import { ClienteService } from '../services/cliente.service';

const clienteService = new ClienteService();

export class ClienteController {
    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const resultado = await clienteService.obtenerTodos(
            req.user!,
            req.query
        );
        return ApiResponse.success(
            res,
            resultado,
            'Clientes obtenidos correctamente.'
        );
    });

    obtenerPorId = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const cliente = await clienteService.obtenerPorId(
            id,
            req.user!
        );
        return ApiResponse.success(
            res,
            cliente,
            'Cliente obtenido correctamente.'
        );
    });

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const cliente = await clienteService.crear(
            req.body,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Clientes',
            accion: TipoAuditoria.CREATE,
            descripcion: `Se creó el cliente ${cliente.nombre} ${cliente.apellido}`,
            registroId: cliente.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            cliente,
            'Cliente creado correctamente.',
            201
        );
    });

    actualizar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const cliente = await clienteService.actualizar(
            id,
            req.body,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Clientes',
            accion: TipoAuditoria.UPDATE,
            descripcion: `Se actualizó el cliente ${cliente.nombre} ${cliente.apellido}`,
            registroId: cliente.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            cliente,
            'Cliente actualizado correctamente.'
        );
    });

    eliminar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const cliente = await clienteService.eliminar(
            id,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Clientes',
            accion: TipoAuditoria.DELETE,
            descripcion: `Se desactivó el cliente ${cliente.nombre} ${cliente.apellido}`,
            registroId: cliente.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            cliente,
            'Cliente desactivado correctamente.'
        );
    });

    reactivar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const cliente = await clienteService.reactivar(
            id,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Clientes',
            accion: TipoAuditoria.UPDATE,
            descripcion: `Se reactivó el cliente ${cliente.nombre} ${cliente.apellido}`,
            registroId: cliente.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            cliente,
            'Cliente reactivado correctamente.'
        );
    });
}

export const clienteController =
    new ClienteController();