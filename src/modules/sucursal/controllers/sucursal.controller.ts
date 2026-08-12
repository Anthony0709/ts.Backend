import { Request, Response } from 'express';

import {
    SucursalService
} from '../services/sucursal.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';


const sucursalService =
    new SucursalService();


export class SucursalController {

    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await sucursalService.obtenerTodos(
                req.user!.empresaId,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Sucursales obtenidas correctamente.'
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

        const sucursal =
            await sucursalService.obtenerPorId(
                id,
                req.user!.empresaId
            );

        return ApiResponse.success(
            res,
            sucursal,
            'Sucursal obtenida correctamente.'
        );
    });


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const sucursal =
            await sucursalService.crear(
                req.user!.empresaId,
                req.body
            );

        return ApiResponse.success(
            res,
            sucursal,
            'Sucursal creada correctamente.',
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

        const sucursal =
            await sucursalService.actualizar(
                id,
                req.user!.empresaId,
                req.body
            );

        return ApiResponse.success(
            res,
            sucursal,
            'Sucursal actualizada correctamente.'
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

        const sucursal =
            await sucursalService.cambiarEstado(
                id,
                req.user!.empresaId,
                req.body.estado
            );

        return ApiResponse.success(
            res,
            sucursal,
            req.body.estado
                ? 'Sucursal activada correctamente.'
                : 'Sucursal desactivada correctamente.'
        );
    });
}


export const sucursalController =
    new SucursalController();