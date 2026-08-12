import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';
import { ProductoService } from '../services/producto.service';

const productoService = new ProductoService();

export class ProductoController {
    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const resultado = await productoService.obtenerTodos(
            req.user!,
            req.query
        );
        return ApiResponse.success(
            res,
            resultado,
            'Productos obtenidos correctamente.'
        );
    });

    obtenerPorId = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const producto = await productoService.obtenerPorId(
            id,
            req.user!
        );
        return ApiResponse.success(
            res,
            producto,
            'Producto obtenido correctamente.'
        );
    });

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const producto = await productoService.crear(
            req.body,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Productos',
            accion: TipoAuditoria.CREATE,
            descripcion: `Se creó el producto ${producto.nombre}`,
            registroId: producto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            producto,
            'Producto creado correctamente.',
            201
        );
    });

    actualizar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const producto = await productoService.actualizar(
            id,
            req.body,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Productos',
            accion: TipoAuditoria.UPDATE,
            descripcion: `Se actualizó el producto ${producto.nombre}`,
            registroId: producto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            producto,
            'Producto actualizado correctamente.'
        );
    });

    eliminar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const producto = await productoService.eliminar(
            id,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Productos',
            accion: TipoAuditoria.DELETE,
            descripcion: `Se desactivó el producto ${producto.nombre}`,
            registroId: producto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            producto,
            'Producto desactivado correctamente.'
        );
    });

    reactivar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const producto = await productoService.reactivar(
            id,
            req.user!
        );
        await registrarAuditoria({
            empresaId: req.user!.empresaId,
            usuarioId: req.user!.id,
            modulo: 'Productos',
            accion: TipoAuditoria.UPDATE,
            descripcion: `Se reactivó el producto ${producto.nombre}`,
            registroId: producto.id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });
        return ApiResponse.success(
            res,
            producto,
            'Producto reactivado correctamente.'
        );
    });
}

export const productoController =
    new ProductoController();