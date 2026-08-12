import { Request, Response } from 'express';
import { notificacionService } from '../services/notificacion.service';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';

export class NotificacionController {
    crear = catchAsync(async (req: Request, res: Response) => {
        const resultado = await notificacionService.crear(req.body);
        return ApiResponse.success(res, resultado, 'Notificación creada correctamente.', 201);
    });
    obtenerTodos = catchAsync(async (req: Request, res: Response) => {
        const resultado = await notificacionService.obtenerTodos(req.query as any);
        return ApiResponse.success(res, resultado, 'Notificaciones obtenidas correctamente.');
    });
    obtenerPorId = catchAsync(async (req: Request, res: Response) => {
        const resultado = await notificacionService.obtenerPorId(req.params.id as string);
        return ApiResponse.success(res, resultado, 'Notificación obtenida correctamente.');
    });
    obtenerMisNotificaciones = catchAsync(async (req: Request, res: Response) => {
        const resultado = await notificacionService.obtenerPorUsuario(req.user!.id, req.query as any);
        return ApiResponse.success(res, resultado, 'Notificaciones obtenidas correctamente.');
    });
    actualizar = catchAsync(async (req: Request, res: Response) => {
        const resultado = await notificacionService.actualizar(req.params.id as string, req.body);
        return ApiResponse.success(res, resultado, 'Notificación actualizada correctamente.');
    });
    marcarLeida = catchAsync(async (req: Request, res: Response) => {
        const resultado = await notificacionService.marcarLeida(req.params.id as string);
        return ApiResponse.success(res, resultado, 'Notificación marcada como leída correctamente.');
    });
    marcarTodasLeidas = catchAsync(async (req: Request, res: Response) => {
        const resultado = await notificacionService.marcarTodasLeidas(req.user!.id);
        return ApiResponse.success(res, resultado, 'Todas las notificaciones fueron marcadas como leídas.');
    });
    eliminar = catchAsync(async (req: Request, res: Response) => {
        await notificacionService.eliminar(req.params.id as string);
        return ApiResponse.success(res, null, 'Notificación eliminada correctamente.');
    });
}
export const notificacionController = new NotificacionController();