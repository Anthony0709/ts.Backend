import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/api-response';

export function authorize(
    modulo: string,
    accion: string
) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.user) {
            return ApiResponse.error(
                res,
                'Usuario no autenticado.',
                401
            );
        }

        if (req.user.rol === 'Super Administrador') {
            return next();
        }

        const permiso = `${modulo}.${accion}`;

        if (!req.user.permisos.includes(permiso)) {
            return ApiResponse.error(
                res,
                'No tiene permisos para realizar esta acción.',
                403
            );
        }

        next();
    };
}