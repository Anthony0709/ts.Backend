import { Request, Response } from 'express';
import { RolService } from '../services/rol.service';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';

const service = new RolService();

export class RolController {
    obtenerTodos = catchAsync(async (req: Request, res: Response) => {
        const resultado = await service.obtenerTodos(req.query);
        return ApiResponse.success(
            res,
            resultado,
            'Roles obtenidos correctamente.'
        );
    });

    obtenerPorId = catchAsync(async (req: Request, res: Response) => {
        const id = getParam(req, 'id');
        const rol = await service.obtenerPorId(id);
        return ApiResponse.success(
            res,
            rol,
            'Rol obtenido correctamente.'
        );
    });

    crear = catchAsync(async (req: Request, res: Response) => {
        const rol = await service.crear(req.body);
        return ApiResponse.success(
            res,
            rol,
            'Rol creado correctamente.',
            201
        );
    });

    actualizar = catchAsync(async (req: Request, res: Response) => {
        const id = getParam(req, 'id');
        const rol = await service.actualizar(
            id,
            req.body
        );
        return ApiResponse.success(
            res,
            rol,
            'Rol actualizado correctamente.'
        );
    });

    eliminar = catchAsync(async (req: Request, res: Response) => {
        const id = getParam(req, 'id');
        const rol = await service.eliminar(id);
        return ApiResponse.success(
            res,
            rol,
            'Rol desactivado correctamente.'
        );
    });

    reactivar = catchAsync(async (req: Request, res: Response) => {
        const id = getParam(req, 'id');
        const rol = await service.reactivar(id);
        return ApiResponse.success(
            res,
            rol,
            'Rol reactivado correctamente.'
        );
    });

    obtenerPermisos = catchAsync(async (req: Request, res: Response) => {
        const id = getParam(req, 'id');
        const permisos = await service.obtenerPermisos(id);
        return ApiResponse.success(
            res,
            permisos,
            'Permisos obtenidos correctamente.'
        );
    });

    guardarPermisos = catchAsync(async (req: Request, res: Response) => {
        const id = getParam(req, 'id');
        const resultado = await service.guardarPermisos(
            id,
            req.body.permisos
        );
        return ApiResponse.success(
            res,
            resultado,
            'Permisos actualizados correctamente.'
        );
    });
}