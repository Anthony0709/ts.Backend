import {
    Request,
    Response,
    NextFunction
} from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/api-response';

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ZodError) {
        return ApiResponse.error(
            res,
            'Datos inválidos.',
            400,
            err.issues.map(issue => ({
                campo: issue.path.join('.'),
                mensaje: issue.message,
                codigo: issue.code
            }))
        );
    }

    if (err instanceof AppError) {
        return ApiResponse.error(
            res,
            err.message,
            err.statusCode
        );
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('PRISMA ERROR:', err);

        switch (err.code) {
            case 'P2002':
                return ApiResponse.error(
                    res,
                    'Ya existe un registro con uno de los valores proporcionados.',
                    409
                );

            case 'P2025':
                return ApiResponse.error(
                    res,
                    'El registro solicitado no existe.',
                    404
                );

            case 'P2003':
                return ApiResponse.error(
                    res,
                    'No se puede realizar la operación porque existen registros relacionados.',
                    409
                );

            default:
                return ApiResponse.error(
                    res,
                    'Error al procesar la operación en la base de datos.',
                    500
                );
        }
    }

    console.error('ERROR NO CONTROLADO:', err);

    return ApiResponse.error(
        res,
        'Error interno del servidor.',
        500
    );
}