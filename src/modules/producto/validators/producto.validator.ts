import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
    CrearProductoSchema,
    ActualizarProductoSchema
} from '../dto/producto.dto';
import { ApiResponse } from '../../../utils/api-response';

export const validarCrearProducto = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        req.body = CrearProductoSchema.parse(req.body);
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

export const validarActualizarProducto = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        req.body = ActualizarProductoSchema.parse(req.body);
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