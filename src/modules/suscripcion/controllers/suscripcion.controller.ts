import { Request, Response } from 'express';
import { EstadoSuscripcion } from '@prisma/client';
import { suscripcionService } from '../services/suscripcion.service';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';

export class SuscripcionController {
    crear = catchAsync(async (req: Request, res: Response) => {
        const suscripcion = await suscripcionService.crear(req.body);
        return ApiResponse.success(
            res,
            suscripcion,
            'Suscripción creada correctamente.',
            201
        );
    });
    obtenerTodos = catchAsync(async (req: Request, res: Response) => {
        const suscripciones = await suscripcionService.obtenerTodos(req.query as any);
        return ApiResponse.success(
            res,
            suscripciones,
            'Suscripciones obtenidas correctamente.'
        );
    });
    obtenerPorId = catchAsync(async (req: Request, res: Response) => {
        const suscripcion = await suscripcionService.obtenerPorId(
            req.params.id as string
        );
        return ApiResponse.success(
            res,
            suscripcion,
            'Suscripción obtenida correctamente.'
        );
    });
    actualizar = catchAsync(async (req: Request, res: Response) => {
        const suscripcion = await suscripcionService.actualizar(
            req.params.id as string,
            req.body
        );
        return ApiResponse.success(
            res,
            suscripcion,
            'Suscripción actualizada correctamente.'
        );
    });
    activar = catchAsync(async (req: Request, res: Response) => {
        const suscripcion = await suscripcionService.cambiarEstado(
            req.params.id as string,
            EstadoSuscripcion.ACTIVA
        );
        return ApiResponse.success(
            res,
            suscripcion,
            'Suscripción activada correctamente.'
        );
    });
    suspender = catchAsync(async (req: Request, res: Response) => {
        const suscripcion = await suscripcionService.cambiarEstado(
            req.params.id as string,
            EstadoSuscripcion.SUSPENDIDA
        );
        return ApiResponse.success(
            res,
            suscripcion,
            'Suscripción suspendida correctamente.'
        );
    });
    cancelar = catchAsync(async (req: Request, res: Response) => {
        const suscripcion = await suscripcionService.cancelar(
            req.params.id as string,
            req.body?.motivo
        );
        return ApiResponse.success(
            res,
            suscripcion,
            'Suscripción cancelada correctamente.'
        );
    });
    renovar = catchAsync(async (req: Request, res: Response) => {
        const suscripcion = await suscripcionService.renovar(
            req.params.id as string
        );
        return ApiResponse.success(
            res,
            suscripcion,
            'Suscripción renovada correctamente.'
        );
    });
    eliminar = catchAsync(async (req: Request, res: Response) => {
        await suscripcionService.eliminar(
            req.params.id as string
        );
        return ApiResponse.success(
            res,
            null,
            'Suscripción eliminada correctamente.'
        );
    });
}
export const suscripcionController = new SuscripcionController();