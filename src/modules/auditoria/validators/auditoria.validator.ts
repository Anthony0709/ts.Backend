import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuditoriaQuerySchema } from '../dto/auditoria.dto';
import { ApiResponse } from '../../../utils/api-response';

export const validarConsultaAuditoria = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        AuditoriaQuerySchema.parse(req.query);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return ApiResponse.error(
                res,
                'Parámetros de consulta inválidos.',
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