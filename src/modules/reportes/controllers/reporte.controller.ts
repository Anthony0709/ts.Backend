import { Request, Response } from 'express';
import { reporteService } from '../services/reporte.service';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
export class ReporteController {
    ventas = catchAsync(async (req: Request, res: Response) => {
        const resultado = await reporteService.ventas(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Reporte de ventas obtenido correctamente.');
    });
    compras = catchAsync(async (req: Request, res: Response) => {
        const resultado = await reporteService.compras(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Reporte de compras obtenido correctamente.');
    });
    inventario = catchAsync(async (req: Request, res: Response) => {
        const resultado = await reporteService.inventario(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Reporte de inventario obtenido correctamente.');
    });
    clientes = catchAsync(async (req: Request, res: Response) => {
        const resultado = await reporteService.clientes(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Reporte de clientes obtenido correctamente.');
    });
    cuentasCobrar = catchAsync(async (req: Request, res: Response) => {
        const resultado = await reporteService.cuentasCobrar(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Reporte de cuentas por cobrar obtenido correctamente.');
    });
    cuentasPagar = catchAsync(async (req: Request, res: Response) => {
        const resultado = await reporteService.cuentasPagar(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Reporte de cuentas por pagar obtenido correctamente.');
    });
    gastos = catchAsync(async (req: Request, res: Response) => {
        const resultado = await reporteService.gastos(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Reporte de gastos obtenido correctamente.');
    });
}
export const reporteController = new ReporteController();