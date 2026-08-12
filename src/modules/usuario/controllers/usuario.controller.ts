import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { UsuarioService } from '../services/usuario.service';

const usuarioService = new UsuarioService();

export class UsuarioController {
    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const data =
            await usuarioService.obtenerTodos(
                req.user!,
                req.query
            );

        return ApiResponse.success(
            res,
            data,
            'Usuarios obtenidos correctamente.'
        );
    });

    obtenerPorId = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id =
            getParam(req, 'id');

        const usuario =
            await usuarioService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            usuario,
            'Usuario obtenido correctamente.'
        );
    });

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const usuario =
            await usuarioService.crear(
                req.body,
                req.user!,
                {
                    ip: req.ip,
                    userAgent:
                        req.get('user-agent')
                }
            );

        return ApiResponse.success(
            res,
            usuario,
            'Usuario creado correctamente.',
            201
        );
    });

    actualizar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id =
            getParam(req, 'id');

        const usuario =
            await usuarioService.actualizar(
                id,
                req.body,
                req.user!,
                {
                    ip: req.ip,
                    userAgent:
                        req.get('user-agent')
                }
            );

        return ApiResponse.success(
            res,
            usuario,
            'Usuario actualizado correctamente.'
        );
    });

    eliminar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id =
            getParam(req, 'id');

        const usuario =
            await usuarioService.eliminar(
                id,
                req.user!,
                {
                    ip: req.ip,
                    userAgent:
                        req.get('user-agent')
                }
            );

        return ApiResponse.success(
            res,
            usuario,
            'Usuario desactivado correctamente.'
        );
    });

    reactivar = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id =
            getParam(req, 'id');

        const usuario =
            await usuarioService.reactivar(
                id,
                req.user!,
                {
                    ip: req.ip,
                    userAgent:
                        req.get('user-agent')
                }
            );

        return ApiResponse.success(
            res,
            usuario,
            'Usuario reactivado correctamente.'
        );
    });
}