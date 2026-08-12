import { Request, Response } from 'express';
import { configuracionService } from '../services/configuracion.service';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';

export class ConfiguracionController {
    obtener = catchAsync(async (req: Request, res: Response) => {
        const resultado = await configuracionService.obtener(req.user!.empresaId);
        return ApiResponse.success(res, resultado, 'Configuración obtenida correctamente.');
    });
    crear = catchAsync(async (req: Request, res: Response) => {
        const resultado = await configuracionService.crear(req.user!.empresaId, req.body);
        return ApiResponse.success(res, resultado, 'Configuración creada correctamente.', 201);
    });
    actualizar = catchAsync(async (req: Request, res: Response) => {
        const resultado = await configuracionService.actualizar(req.user!.empresaId, req.body);
        return ApiResponse.success(res, resultado, 'Configuración actualizada correctamente.');
    });
    restaurar = catchAsync(async (req: Request, res: Response) => {
        const resultado = await configuracionService.restaurar(req.user!.empresaId);
        return ApiResponse.success(res, resultado, 'Configuración restaurada correctamente.');
    });
}
export const configuracionController = new ConfiguracionController();