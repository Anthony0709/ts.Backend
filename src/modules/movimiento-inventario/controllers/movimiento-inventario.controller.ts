import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import {
    MovimientoInventarioService
} from '../services/movimiento-inventario.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';

const movimientoInventarioService =
    new MovimientoInventarioService();

export class MovimientoInventarioController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await movimientoInventarioService.obtenerTodos(
                req.user!,
                req.query as any
            );

        return ApiResponse.success(
            res,
            resultado,
            'Movimientos de inventario obtenidos correctamente.'
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

        const movimiento =
            await movimientoInventarioService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            movimiento,
            'Movimiento de inventario obtenido correctamente.'
        );
    });

    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const movimiento =
            await movimientoInventarioService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'MovimientoInventario',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se registró movimiento ${movimiento.tipo} de ${movimiento.cantidad} unidades del producto ${movimiento.producto.nombre} en la bodega ${movimiento.bodega.nombre}`,

            registroId:
                movimiento.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            movimiento,
            'Movimiento de inventario registrado correctamente.',
            201
        );
    });
}

export const movimientoInventarioController =
    new MovimientoInventarioController();