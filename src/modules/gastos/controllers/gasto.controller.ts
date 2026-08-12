import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import {
    GastoService
} from '../services/gasto.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';


const gastoService =
    new GastoService();


export class GastoController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await gastoService.obtenerTodos(
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Gastos obtenidos correctamente.'
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
            getParam(req, 'id');

        const gasto =
            await gastoService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            gasto,
            'Gasto obtenido correctamente.'
        );
    });


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const gasto =
            await gastoService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Gastos',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se creó el gasto ${gasto.numero}`,

            registroId:
                gasto.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            gasto,
            'Gasto creado correctamente.',
            201
        );
    });


    /*=====================================================
    ==================== ACTUALIZAR ======================
    =====================================================*/

    actualizar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const gasto =
            await gastoService.actualizar(
                id,
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Gastos',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se actualizó el gasto ${gasto.numero}`,

            registroId:
                gasto.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            gasto,
            'Gasto actualizado correctamente.'
        );
    });


    /*=====================================================
    ======================= PAGAR ========================
    =====================================================*/

    pagar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const gasto =
            await gastoService.pagar(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Gastos',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se marcó como pagado el gasto ${gasto.numero}`,

            registroId:
                gasto.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            gasto,
            'Gasto pagado correctamente.'
        );
    });


    /*=====================================================
    ======================= ANULAR =======================
    =====================================================*/

    anular = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const gasto =
            await gastoService.anular(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Gastos',

            accion:
                TipoAuditoria.ANULAR,

            descripcion:
                `Se anuló el gasto ${gasto.numero}`,

            registroId:
                gasto.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            gasto,
            'Gasto anulado correctamente.'
        );
    });
}


export const gastoController =
    new GastoController();