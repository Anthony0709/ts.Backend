import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import {
    CompraService
} from '../services/compra.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';


const compraService =
    new CompraService();


export class CompraController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await compraService.obtenerTodos(
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Compras obtenidas correctamente.'
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

        const compra =
            await compraService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            compra,
            'Compra obtenida correctamente.'
        );
    });


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const compra =
            await compraService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Compras',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se creó la compra ${compra.numero}`,

            registroId:
                compra.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            compra,
            'Compra creada correctamente.',
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

        const compra =
            await compraService.actualizar(
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
                'Compras',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se actualizó la compra ${compra.numero}`,

            registroId:
                compra.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            compra,
            'Compra actualizada correctamente.'
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
            getParam(req, 'id');

        const compra =
            await compraService.aprobar(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Compras',

            accion:
                TipoAuditoria.APROBAR,

            descripcion:
                `Se aprobó la compra ${compra?.numero}`,

            registroId:
                compra?.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            compra,
            'Compra aprobada correctamente.'
        );
    });


    /*=====================================================
    ======================== ANULAR ======================
    =====================================================*/

    anular = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const compra =
            await compraService.anular(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Compras',

            accion:
                TipoAuditoria.ANULAR,

            descripcion:
                `Se anuló la compra ${compra.numero}`,

            registroId:
                compra.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            compra,
            'Compra anulada correctamente.'
        );
    });
}


export const compraController =
    new CompraController();