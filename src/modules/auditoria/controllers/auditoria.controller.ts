import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { AuditoriaService } from '../services/auditoria.service';

const auditoriaService = new AuditoriaService();

export class AuditoriaController {
    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const resultado = await auditoriaService.obtenerTodos(
            req.user!,
            req.query as any
        );
        return ApiResponse.success(
            res,
            resultado,
            'Registros de auditoría obtenidos correctamente.'
        );
    });

    obtenerPorId = catchAsync(async (
        req: Request,
        res: Response
    ) => {
        const id = getParam(req, 'id');
        const auditoria = await auditoriaService.obtenerPorId(
            id,
            req.user!
        );
        return ApiResponse.success(
            res,
            auditoria,
            'Registro de auditoría obtenido correctamente.'
        );
    });
}

export const auditoriaController =
    new AuditoriaController();