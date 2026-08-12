import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';
import { MarcaService } from '../services/marca.service';

const marcaService = new MarcaService();

export class MarcaController {
    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const resultado = await marcaService.obtenerTodos(
            req.user!,
            req.query
        );
        return ApiResponse.success(
            res,
            resultado,
            'Marcas obtenidas correctamente.'
        );
    });

    obtenerPorId = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const marca = await marcaService.obtenerPorId(
            id,
            req.user!
        );
        return ApiResponse.success(
            res,
            marca,
            'Marca obtenida correctamente.'
        );
    });

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const marca = await marcaService.crear(
            req.body,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Marcas',
            accion: TipoAuditoria.CREATE,
            descripcion: `Se creó la marca ${marca.nombre}`,
            registroId: marca.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            marca,
            'Marca creada correctamente.',
            201
        );
    });

    actualizar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const marca = await marcaService.actualizar(
            id,
            req.body,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Marcas',
            accion: TipoAuditoria.UPDATE,
            descripcion: `Se actualizó la marca ${marca.nombre}`,
            registroId: marca.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            marca,
            'Marca actualizada correctamente.'
        );
    });

    eliminar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const marca = await marcaService.eliminar(
            id,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Marcas',
            accion: TipoAuditoria.DELETE,
            descripcion: `Se desactivó la marca ${marca.nombre}`,
            registroId: marca.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            marca,
            'Marca desactivada correctamente.'
        );
    });

    reactivar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const marca = await marcaService.reactivar(
            id,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Marcas',
            accion: TipoAuditoria.UPDATE,
            descripcion: `Se reactivó la marca ${marca.nombre}`,
            registroId: marca.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            marca,
            'Marca reactivada correctamente.'
        );
    });
}

export const marcaController =
    new MarcaController();