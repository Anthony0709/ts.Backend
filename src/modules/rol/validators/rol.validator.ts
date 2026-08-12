import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { CrearRolSchema, ActualizarRolSchema } from '../dto/rol.dto';
import { AppError } from '../../../utils/AppError';

/*=====================================================*
*=================== CREAR ROL ========================*
*=====================================================*/

export const validarCrearRol = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        req.body = CrearRolSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return next(
                new AppError(
                    error.issues[0]?.message ?? 'Datos inválidos.',
                    400
                )
            );
        }
        next(error);
    }
};

/*=====================================================*
*================ ACTUALIZAR ROL ======================*
*=====================================================*/

export const validarActualizarRol = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        req.body = ActualizarRolSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return next(
                new AppError(
                    error.issues[0]?.message ?? 'Datos inválidos.',
                    400
                )
            );
        }
        next(error);
    }
};