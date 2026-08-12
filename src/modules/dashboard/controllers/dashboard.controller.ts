import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';

export class DashboardController {
    obtenerResumen = catchAsync(async (req: Request, res: Response) => {
        const resultado = await dashboardService.obtenerResumen(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Resumen del dashboard obtenido correctamente.');
    });
    obtenerVentasPorPeriodo = catchAsync(async (req: Request, res: Response) => {
        const resultado = await dashboardService.obtenerVentasPorPeriodo(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Ventas por periodo obtenidas correctamente.');
    });
    obtenerProductosBajoStock = catchAsync(async (req: Request, res: Response) => {
        const resultado = await dashboardService.obtenerProductosBajoStock(req.user!.empresaId, req.query.bodegaId as string | undefined);
        return ApiResponse.success(res, resultado, 'Productos con bajo stock obtenidos correctamente.');
    });
}
export const dashboardController = new DashboardController();