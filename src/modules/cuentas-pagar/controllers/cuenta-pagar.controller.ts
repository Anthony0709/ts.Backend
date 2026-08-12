import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import {
    CuentaPagarService
} from '../services/cuenta-pagar.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';


const cuentaPagarService =
    new CuentaPagarService();


export class CuentaPagarController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await cuentaPagarService.obtenerTodos(
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Cuentas por pagar obtenidas correctamente.'
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

        const cuenta =
            await cuentaPagarService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            cuenta,
            'Cuenta por pagar obtenida correctamente.'
        );
    });


    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const cuenta =
            await cuentaPagarService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'CuentasPagar',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se creó la cuenta por pagar ${cuenta.numero}`,

            registroId:
                cuenta.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            cuenta,
            'Cuenta por pagar creada correctamente.',
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

        const cuenta =
            await cuentaPagarService.actualizar(
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
                'CuentasPagar',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se actualizó la cuenta por pagar ${cuenta.numero}`,

            registroId:
                cuenta.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            cuenta,
            'Cuenta por pagar actualizada correctamente.'
        );
    });


    /*=====================================================
    ==================== REGISTRAR PAGO ==================
    =====================================================*/

    registrarPago = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const resultado =
            await cuentaPagarService.registrarPago(
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
                'CuentasPagar',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se registró un pago de ${resultado.pago.monto} en la cuenta por pagar ${resultado.cuenta.numero}`,

            registroId:
                resultado.cuenta.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            resultado,
            'Pago registrado correctamente.'
        );
    });


    /*=====================================================
    =================== CONSULTAR PAGOS ==================
    =====================================================*/

    obtenerPagos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const resultado =
            await cuentaPagarService.obtenerPagos(
                id,
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Pagos obtenidos correctamente.'
        );
    });
}


export const cuentaPagarController =
    new CuentaPagarController();