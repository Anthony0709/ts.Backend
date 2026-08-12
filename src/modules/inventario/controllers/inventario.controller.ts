import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import { InventarioService } from '../services/inventario.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';

const inventarioService =
    new InventarioService();

export class InventarioController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await inventarioService.obtenerTodos(
                req.user!,
                req.query
            );

        return ApiResponse.success(
            res,
            resultado,
            'Inventario obtenido correctamente.'
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

        const inventario =
            await inventarioService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            inventario,
            'Inventario obtenido correctamente.'
        );
    });

    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const inventario =
            await inventarioService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Inventario',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se creó inventario para el producto ${inventario.producto.nombre} en la bodega ${inventario.bodega.nombre}`,

            registroId:
                inventario.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            inventario,
            'Inventario creado correctamente.',
            201
        );
    });

    /*=====================================================
    ===================== AJUSTAR ========================
    =====================================================*/

    ajustar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await inventarioService.ajustar(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Inventario',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se realizó un movimiento ${resultado.movimiento.tipo} de ${resultado.movimiento.cantidad} unidades del producto ${resultado.inventario.producto.nombre} en la bodega ${resultado.inventario.bodega.nombre}`,

            registroId:
                resultado.inventario.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            resultado,
            'Movimiento de inventario realizado correctamente.'
        );
    });

    /*=====================================================
    ================= ACTUALIZAR STOCK ===================
    =====================================================*/

    actualizar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const inventario =
            await inventarioService.actualizar(
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
                'Inventario',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se ajustó manualmente el stock del producto ${inventario.producto.nombre} en la bodega ${inventario.bodega.nombre}`,

            registroId:
                inventario.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            inventario,
            'Stock actualizado correctamente.'
        );
    });

    /*=====================================================
    ==================== MOVIMIENTOS =====================
    =====================================================*/

    obtenerMovimientos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await inventarioService.obtenerMovimientos(
                req.user!,
                req.query
            );

        return ApiResponse.success(
            res,
            resultado,
            'Movimientos de inventario obtenidos correctamente.'
        );
    });
}

export const inventarioController =
    new InventarioController();