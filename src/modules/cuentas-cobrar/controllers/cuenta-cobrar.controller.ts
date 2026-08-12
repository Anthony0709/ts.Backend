import { Request, Response } from 'express';
import { cuentaCobrarService } from '../services/cuenta-cobrar.service';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';

export class CuentaCobrarController {
    crear = catchAsync(async (req: Request, res: Response) => {
        const resultado = await cuentaCobrarService.crear(req.user!.empresaId, req.body);
        return ApiResponse.success(res, resultado, 'Cuenta por cobrar creada correctamente.', 201);
    });
    obtenerTodos = catchAsync(async (req: Request, res: Response) => {
        const resultado = await cuentaCobrarService.obtenerTodos(req.user!.empresaId, req.query as any);
        return ApiResponse.success(res, resultado, 'Cuentas por cobrar obtenidas correctamente.');
    });
    obtenerPorId = catchAsync(async (req: Request, res: Response) => {
        const resultado = await cuentaCobrarService.obtenerPorId(req.params.id as string, req.user!.empresaId);
        return ApiResponse.success(res, resultado, 'Cuenta por cobrar obtenida correctamente.');
    });
    registrarAbono = catchAsync(async (req: Request, res: Response) => {
        const resultado = await cuentaCobrarService.registrarAbono(req.params.id as string, req.user!.empresaId, req.body);
        return ApiResponse.success(res, resultado, 'Abono registrado correctamente.', 201);
    });
    obtenerAbonos = catchAsync(async (req: Request, res: Response) => {
        const resultado = await cuentaCobrarService.obtenerAbonos(req.params.id as string, req.user!.empresaId);
        return ApiResponse.success(res, resultado, 'Abonos obtenidos correctamente.');
    });
    actualizarVencidas = catchAsync(async (req: Request, res: Response) => {
        const resultado = await cuentaCobrarService.actualizarVencidas(req.user!.empresaId);
        return ApiResponse.success(res, resultado, 'Cuentas vencidas actualizadas correctamente.');
    });
}
export const cuentaCobrarController = new CuentaCobrarController();