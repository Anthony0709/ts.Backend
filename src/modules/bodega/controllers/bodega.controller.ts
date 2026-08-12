import { Request, Response } from 'express';

import {
    BodegaService
} from '../services/bodega.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';


const bodegaService =
    new BodegaService();


export class BodegaController {

    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await bodegaService.obtenerTodos(
                req.user!.empresaId,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Bodegas obtenidas correctamente.'
        );
    });


    /*=====================================================
    ================== OBTENER POR ID ====================
    =====================================================*/

    obtenerPorId = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(
                req,
                'id'
            );

        const bodega =
            await bodegaService.obtenerPorId(
                id,
                req.user!.empresaId
            );

        return ApiResponse.success(
            res,
            bodega,
            'Bodega obtenida correctamente.'
        );
    });


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const bodega =
            await bodegaService.crear(
                req.user!.empresaId,
                req.body
            );

        return ApiResponse.success(
            res,
            bodega,
            'Bodega creada correctamente.',
            201
        );
    });


    /*=====================================================
    ===================== ACTUALIZAR =====================
    =====================================================*/

    actualizar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(
                req,
                'id'
            );

        const bodega =
            await bodegaService.actualizar(
                id,
                req.user!.empresaId,
                req.body
            );

        return ApiResponse.success(
            res,
            bodega,
            'Bodega actualizada correctamente.'
        );
    });


    /*=====================================================
    ===================== ACTIVAR/DESACTIVAR =============
    =====================================================*/

    cambiarEstado = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(
                req,
                'id'
            );

        const bodega =
            await bodegaService.cambiarEstado(
                id,
                req.user!.empresaId,
                req.body.estado
            );

        return ApiResponse.success(
            res,
            bodega,
            req.body.estado
                ? 'Bodega activada correctamente.'
                : 'Bodega desactivada correctamente.'
        );
    });
}


export const bodegaController =
    new BodegaController();