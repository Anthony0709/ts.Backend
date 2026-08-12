import { Request, Response } from 'express';
import { posService } from '../services/pos.service';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';

export class PosController {
    procesarVenta = catchAsync(async (req: Request, res: Response) => {
        const resultado = await posService.procesarVenta(req.user!.empresaId, req.user!.id, req.body);
        return ApiResponse.success(res, resultado, 'Venta POS procesada correctamente.', 201);
    });
    buscarProductos = catchAsync(async (req: Request, res: Response) => {
        const resultado = await posService.buscarProductos(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Productos obtenidos correctamente.');
    });
    buscarClientes = catchAsync(async (req: Request, res: Response) => {
        const resultado = await posService.buscarClientes(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Clientes obtenidos correctamente.');
    });
    consultarCaja = catchAsync(async (req: Request, res: Response) => {
        const resultado = await posService.consultarCaja(req.user!.empresaId, req.body);
        return ApiResponse.success(res, resultado, 'Caja obtenida correctamente.');
    });
    resumenCaja = catchAsync(async (req: Request, res: Response) => {
        const resultado = await posService.resumenCaja(req.user!.empresaId, req.body);
        return ApiResponse.success(res, resultado, 'Resumen de caja obtenido correctamente.');
    });
}
export const posController = new PosController();