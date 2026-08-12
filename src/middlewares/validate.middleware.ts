import {
    Request,
    Response,
    NextFunction
} from 'express';
import { ZodSchema } from 'zod';
import { ApiResponse } from '../utils/api-response';

export const validate =
    (schema: ZodSchema) =>
        (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                const errors = result.error.issues.map(issue => ({
                    campo: issue.path.join('.'),
                    mensaje: issue.message,
                    codigo: issue.code
                }));
                return ApiResponse.error(
                    res,
                    'Datos inválidos.',
                    400,
                    errors
                );
            }
            req.body = result.data;
            next();
        };