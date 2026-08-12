import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';
import { CategoriaService } from '../services/categoria.service';

const categoriaService = new CategoriaService();

export class CategoriaController {
    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const resultado = await categoriaService.obtenerTodos(
            req.user!,
            req.query
        );
        return ApiResponse.success(
            res,
            resultado,
            'Categorías obtenidas correctamente.'
        );
    });

    obtenerPorId = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const categoria = await categoriaService.obtenerPorId(
            id,
            req.user!
        );
        return ApiResponse.success(
            res,
            categoria,
            'Categoría obtenida correctamente.'
        );
    });

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const categoria = await categoriaService.crear(
            req.body,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Categorias',
            accion: TipoAuditoria.CREATE,
            descripcion: `Se creó la categoría ${categoria.nombre}`,
            registroId: categoria.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            categoria,
            'Categoría creada correctamente.',
            201
        );
    });

    actualizar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const categoria = await categoriaService.actualizar(
            id,
            req.body,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Categorias',
            accion: TipoAuditoria.UPDATE,
            descripcion: `Se actualizó la categoría ${categoria.nombre}`,
            registroId: categoria.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            categoria,
            'Categoría actualizada correctamente.'
        );
    });

    eliminar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const categoria = await categoriaService.eliminar(
            id,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Categorias',
            accion: TipoAuditoria.DELETE,
            descripcion: `Se desactivó la categoría ${categoria.nombre}`,
            registroId: categoria.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            categoria,
            'Categoría desactivada correctamente.'
        );
    });

    reactivar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const categoria = await categoriaService.reactivar(
            id,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Categorias',
            accion: TipoAuditoria.UPDATE,
            descripcion: `Se reactivó la categoría ${categoria.nombre}`,
            registroId: categoria.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            categoria,
            'Categoría reactivada correctamente.'
        );
    });
}

export const categoriaController =
    new CategoriaController();