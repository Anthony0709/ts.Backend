import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import {
    OrdenCompraService
} from '../services/orden-compra.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';


const ordenCompraService =
    new OrdenCompraService();


export class OrdenCompraController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await ordenCompraService.obtenerTodos(
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Órdenes de compra obtenidas correctamente.'
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

        const orden =
            await ordenCompraService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            orden,
            'Orden de compra obtenida correctamente.'
        );
    });


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const orden =
            await ordenCompraService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'OrdenesCompra',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se creó la orden de compra ${orden.numero}`,

            registroId:
                orden.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            orden,
            'Orden de compra creada correctamente.',
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

        const orden =
            await ordenCompraService.actualizar(
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
                'OrdenesCompra',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se actualizó la orden de compra ${orden.numero}`,

            registroId:
                orden.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            orden,
            'Orden de compra actualizada correctamente.'
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

        const orden =
            await ordenCompraService.aprobar(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'OrdenesCompra',

            accion:
                TipoAuditoria.APROBAR,

            descripcion:
                `Se aprobó la orden de compra ${orden.numero}`,

            registroId:
                orden.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            orden,
            'Orden de compra aprobada correctamente.'
        );
    });


    /*=====================================================
    ======================= CANCELAR =====================
    =====================================================*/

    cancelar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const orden =
            await ordenCompraService.cancelar(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'OrdenesCompra',

            accion:
                TipoAuditoria.ANULAR,

            descripcion:
                `Se canceló la orden de compra ${orden.numero}`,

            registroId:
                orden.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            orden,
            'Orden de compra cancelada correctamente.'
        );
    });
}


export const ordenCompraController =
    new OrdenCompraController();