import { Request, Response } from 'express';

import {
    CajaService
} from '../services/caja.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';


const cajaService =
    new CajaService();


export class CajaController {

    /*=====================================================
    ======================= LISTAR =======================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await cajaService.obtenerTodos(
                req.user!.empresaId,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Cajas obtenidas correctamente.'
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

        const caja =
            await cajaService.obtenerPorId(
                id,
                req.user!.empresaId
            );

        return ApiResponse.success(
            res,
            caja,
            'Caja obtenida correctamente.'
        );
    });


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const caja =
            await cajaService.crear(
                req.user!.empresaId,
                req.body
            );

        return ApiResponse.success(
            res,
            caja,
            'Caja creada correctamente.',
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

        const caja =
            await cajaService.actualizar(
                id,
                req.user!.empresaId,
                req.body
            );

        return ApiResponse.success(
            res,
            caja,
            'Caja actualizada correctamente.'
        );
    });


    /*=====================================================
    ======================== ABRIR =======================
    =====================================================*/

    abrir = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(
                req,
                'id'
            );

        const caja =
            await cajaService.abrir(
                id,
                req.user!.empresaId,
                req.user!.id,
                req.body
            );

        return ApiResponse.success(
            res,
            caja,
            'Caja abierta correctamente.'
        );
    });


    /*=====================================================
    ======================== CERRAR ======================
    =====================================================*/

    cerrar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(
                req,
                'id'
            );

        const caja =
            await cajaService.cerrar(
                id,
                req.user!.empresaId,
                req.user!.id,
                req.body
            );

        return ApiResponse.success(
            res,
            caja,
            'Caja cerrada correctamente.'
        );
    });


    /*=====================================================
    =================== MOVIMIENTOS ======================
    =====================================================*/

    obtenerMovimientos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const cajaId =
            getParam(
                req,
                'id'
            );

        const resultado =
            await cajaService.obtenerMovimientos(
                req.user!.empresaId,
                {
                    ...(req.query as any),
                    cajaId
                }
            );

        return ApiResponse.success(
            res,
            resultado,
            'Movimientos de caja obtenidos correctamente.'
        );
    });


    /*=====================================================
    ====================== RESUMEN =======================
    =====================================================*/

    obtenerResumen = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(
                req,
                'id'
            );

        const resumen =
            await cajaService.obtenerResumen(
                id,
                req.user!.empresaId
            );

        return ApiResponse.success(
            res,
            resumen,
            'Resumen de caja obtenido correctamente.'
        );
    });
}


export const cajaController =
    new CajaController();