import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import {
    TransferenciaService
} from '../services/transferencia.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';

const transferenciaService =
    new TransferenciaService();

export class TransferenciaController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await transferenciaService.obtenerTodos(
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Transferencias obtenidas correctamente.'
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

        const transferencia =
            await transferenciaService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            transferencia,
            'Transferencia obtenida correctamente.'
        );
    });

    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const transferencia =
            await transferenciaService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Transferencias',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se transfirieron ${transferencia.cantidad} unidades del producto ${transferencia.producto.nombre} desde ${transferencia.origen.bodega.nombre} hacia ${transferencia.destino.bodega.nombre}`,

            registroId:
                transferencia.origen.movimiento.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            transferencia,
            'Transferencia realizada correctamente.',
            201
        );
    });
}

export const transferenciaController =
    new TransferenciaController();