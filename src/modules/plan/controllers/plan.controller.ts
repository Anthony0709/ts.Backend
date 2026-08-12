import { Request, Response } from 'express';
import { planService } from '../services/plan.service';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';

export class PlanController {
    crear = catchAsync(async (req: Request, res: Response) => {
        const resultado = await planService.crear(req.body);
        return ApiResponse.success(res, resultado, 'Plan creado correctamente.', 201);
    });
    obtenerTodos = catchAsync(async (req: Request, res: Response) => {
        const resultado = await planService.obtenerTodos(req.query as any);
        return ApiResponse.success(res, resultado, 'Planes obtenidos correctamente.');
    });
    obtenerPorId = catchAsync(async (req: Request, res: Response) => {
        const resultado = await planService.obtenerPorId(req.params.id as string);
        return ApiResponse.success(res, resultado, 'Plan obtenido correctamente.');
    });
    actualizar = catchAsync(async (req: Request, res: Response) => {
        const resultado = await planService.actualizar(req.params.id as string, req.body);
        return ApiResponse.success(res, resultado, 'Plan actualizado correctamente.');
    });
    activar = catchAsync(async (req: Request, res: Response) => {
        const resultado = await planService.cambiarEstado(req.params.id as string, true);
        return ApiResponse.success(res, resultado, 'Plan activado correctamente.');
    });
    desactivar = catchAsync(async (req: Request, res: Response) => {
        const resultado = await planService.cambiarEstado(req.params.id as string, false);
        return ApiResponse.success(res, resultado, 'Plan desactivado correctamente.');
    });
    eliminar = catchAsync(async (req: Request, res: Response) => {
        await planService.eliminar(req.params.id as string);
        return ApiResponse.success(res, null, 'Plan eliminado correctamente.');
    });
}
export const planController = new PlanController();