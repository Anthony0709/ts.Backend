import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import {
    DevolucionService
} from '../services/devolucion.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';

const devolucionService =
    new DevolucionService();


export class DevolucionController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await devolucionService.obtenerTodos(
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Devoluciones obtenidas correctamente.'
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

        const devolucion =
            await devolucionService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            devolucion,
            'Devolución obtenida correctamente.'
        );
    });


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const devolucion =
            await devolucionService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Devoluciones',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se creó la devolución ${devolucion.numero}`,

            registroId:
                devolucion.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            devolucion,
            'Devolución creada correctamente.',
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

        const devolucion =
            await devolucionService.actualizar(
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
                'Devoluciones',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se actualizó la devolución ${devolucion.numero}`,

            registroId:
                devolucion.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            devolucion,
            'Devolución actualizada correctamente.'
        );
    });


    /*=====================================================
    ====================== APROBAR =======================
    =====================================================*/

    aprobar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const devolucion =
            await devolucionService.aprobar(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Devoluciones',

            accion:
                TipoAuditoria.APROBAR,

            descripcion:
                `Se aprobó la devolución ${devolucion.numero}`,

            registroId:
                devolucion.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            devolucion,
            'Devolución aprobada correctamente.'
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

        const devolucion =
            await devolucionService.anular(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Devoluciones',

            accion:
                TipoAuditoria.ANULAR,

            descripcion:
                `Se anuló la devolución ${devolucion.numero}`,

            registroId:
                devolucion.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            devolucion,
            'Devolución anulada correctamente.'
        );
    });
}


export const devolucionController =
    new DevolucionController();