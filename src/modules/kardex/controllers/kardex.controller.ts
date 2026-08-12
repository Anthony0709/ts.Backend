import { Request, Response } from 'express';

import { KardexService } from '../services/kardex.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';

const kardexService =
    new KardexService();

export class KardexController {

    /*=====================================================
    ======================= KARDEX =======================
    =====================================================*/

    obtener = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await kardexService.obtener(
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Kardex obtenido correctamente.'
        );
    });

    /*=====================================================
    ================= KARDEX POR PRODUCTO ===============
    =====================================================*/

    obtenerPorProducto = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const productoId =
            getParam(req, 'productoId');

        const resultado =
            await kardexService.obtenerPorProducto(
                productoId,
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Kardex del producto obtenido correctamente.'
        );
    });

    /*=====================================================
    =================== KARDEX POR BODEGA ===============
    =====================================================*/

    obtenerPorBodega = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const bodegaId =
            getParam(req, 'bodegaId');

        const resultado =
            await kardexService.obtenerPorBodega(
                bodegaId,
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Kardex de la bodega obtenido correctamente.'
        );
    });
}

export const kardexController =
    new KardexController();