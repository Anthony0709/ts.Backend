import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
    CrearCategoriaSchema,
    ActualizarCategoriaSchema
} from '../dto/categoria.dto';
import { ApiResponse } from '../../../utils/api-response';

export const validarCrearCategoria = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        req.body = CrearCategoriaSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return ApiResponse.error(
                res,
                'Datos inválidos.',
                400,
                error.issues.map(issue => ({
                    campo: issue.path.join('.'),
                    mensaje: issue.message
                }))
            );
        }
        next(error);
    }
};

export const validarActualizarCategoria = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        req.body = ActualizarCategoriaSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return ApiResponse.error(
                res,
                'Datos inválidos.',
                400,
                error.issues.map(issue => ({
                    campo: issue.path.join('.'),
                    mensaje: issue.message
                }))
            );
        }
        next(error);
    }
};