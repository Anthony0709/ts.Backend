import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import {
    VentaService
} from '../services/venta.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';


const ventaService =
    new VentaService();


export class VentaController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await ventaService.obtenerTodos(
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Ventas obtenidas correctamente.'
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

        const venta =
            await ventaService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            venta,
            'Venta obtenida correctamente.'
        );
    });


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const venta =
            await ventaService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Ventas',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se creó la venta ${venta.numero}`,

            registroId:
                venta.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            venta,
            'Venta creada correctamente.',
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
            getParam(
                req,
                'id'
            );

        const venta =
            await ventaService.actualizar(
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
                'Ventas',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se actualizó la venta ${venta.numero}`,

            registroId:
                venta.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            venta,
            'Venta actualizada correctamente.'
        );
    });


    /*=====================================================
    ======================= APROBAR ======================
    =====================================================*/

    aprobar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(
                req,
                'id'
            );

        const venta =
            await ventaService.aprobar(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Ventas',

            accion:
                TipoAuditoria.APROBAR,

            descripcion:
                `Se aprobó la venta ${venta.numero}`,

            registroId:
                venta.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            venta,
            'Venta aprobada correctamente.'
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
            getParam(
                req,
                'id'
            );

        const venta =
            await ventaService.anular(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Ventas',

            accion:
                TipoAuditoria.ANULAR,

            descripcion:
                `Se anuló la venta ${venta.numero}`,

            registroId:
                venta.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            venta,
            'Venta anulada correctamente.'
        );
    });
}


export const ventaController =
    new VentaController();