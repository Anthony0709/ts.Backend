import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import {
    CotizacionService
} from '../services/cotizacion.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';


const cotizacionService =
    new CotizacionService();


export class CotizacionController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await cotizacionService.obtenerTodos(
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Cotizaciones obtenidas correctamente.'
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

        const cotizacion =
            await cotizacionService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            cotizacion,
            'Cotización obtenida correctamente.'
        );
    });


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const cotizacion =
            await cotizacionService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Cotizaciones',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se creó la cotización ${cotizacion.numero}`,

            registroId:
                cotizacion.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            cotizacion,
            'Cotización creada correctamente.',
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

        const cotizacion =
            await cotizacionService.actualizar(
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
                'Cotizaciones',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se actualizó la cotización ${cotizacion.numero}`,

            registroId:
                cotizacion.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            cotizacion,
            'Cotización actualizada correctamente.'
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

        const cotizacion =
            await cotizacionService.aprobar(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Cotizaciones',

            accion:
                TipoAuditoria.APROBAR,

            descripcion:
                `Se aprobó la cotización ${cotizacion.numero}`,

            registroId:
                cotizacion.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            cotizacion,
            'Cotización aprobada correctamente.'
        );
    });


    /*=====================================================
    ====================== RECHAZAR ======================
    =====================================================*/

    rechazar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const cotizacion =
            await cotizacionService.rechazar(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Cotizaciones',

            accion:
                TipoAuditoria.ANULAR,

            descripcion:
                `Se rechazó la cotización ${cotizacion.numero}`,

            registroId:
                cotizacion.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            cotizacion,
            'Cotización rechazada correctamente.'
        );
    });


    /*=====================================================
    ===================== CONVERTIR ======================
    =====================================================*/

    convertir = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const cotizacion =
            await cotizacionService.convertir(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Cotizaciones',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se convirtió la cotización ${cotizacion.numero}`,

            registroId:
                cotizacion.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            cotizacion,
            'Cotización convertida correctamente.'
        );
    });
}


export const cotizacionController =
    new CotizacionController();