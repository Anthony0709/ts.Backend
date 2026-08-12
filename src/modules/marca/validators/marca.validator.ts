import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
    CrearMarcaSchema,
    ActualizarMarcaSchema
} from '../dto/dto.marca';
import { ApiResponse } from '../../../utils/api-response';

export const validarCrearMarca = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        req.body = CrearMarcaSchema.parse(req.body);
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

export const validarActualizarMarca = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        req.body = ActualizarMarcaSchema.parse(req.body);
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