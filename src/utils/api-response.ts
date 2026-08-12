import { Response } from 'express';

export interface ApiErrorDetail {
    campo?: string;
    mensaje: string;
    codigo?: string;
}

export class ApiResponse {
    static success<T>(
        res: Response,
        data: T = null as T,
        message = 'Operación realizada correctamente.',
        statusCode = 200
    ): Response {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(
        res: Response,
        message = 'Ha ocurrido un error.',
        statusCode = 500,
        errors: ApiErrorDetail[] = []
    ): Response {
        return res.status(statusCode).json({
            success: false,
            message,
            ...(errors.length > 0 ? { errors } : {})
        });
    }
}