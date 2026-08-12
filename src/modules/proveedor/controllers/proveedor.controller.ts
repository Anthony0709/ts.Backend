import { Request, Response } from 'express';
import { TipoAuditoria } from '@prisma/client';

import { ProveedorService } from '../services/proveedor.service';

import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { registrarAuditoria } from '../../../utils/auditoria';

const proveedorService =
    new ProveedorService();

export class ProveedorController {

    /*=====================================================
    =================== OBTENER TODOS ====================
    =====================================================*/

    obtenerTodos = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const resultado =
            await proveedorService.obtenerTodos(
                req.user!,
                req.query
            );

        return ApiResponse.success(
            res,
            resultado,
            'Proveedores obtenidos correctamente.'
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

        const proveedor =
            await proveedorService.obtenerPorId(
                id,
                req.user!
            );

        return ApiResponse.success(
            res,
            proveedor,
            'Proveedor obtenido correctamente.'
        );
    });

    /*=====================================================
    ======================= CREAR ========================
    =====================================================*/

    crear = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const proveedor =
            await proveedorService.crear(
                req.body,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Proveedores',

            accion:
                TipoAuditoria.CREATE,

            descripcion:
                `Se creó el proveedor ${proveedor.nombreComercial}`,

            registroId:
                proveedor.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            proveedor,
            'Proveedor creado correctamente.',
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

        const proveedor =
            await proveedorService.actualizar(
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
                'Proveedores',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se actualizó el proveedor ${proveedor.nombreComercial}`,

            registroId:
                proveedor.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            proveedor,
            'Proveedor actualizado correctamente.'
        );
    });

    /*=====================================================
    ====================== ELIMINAR ======================
    =====================================================*/

    eliminar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const proveedor =
            await proveedorService.eliminar(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Proveedores',

            accion:
                TipoAuditoria.DELETE,

            descripcion:
                `Se desactivó el proveedor ${proveedor.nombreComercial}`,

            registroId:
                proveedor.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            proveedor,
            'Proveedor desactivado correctamente.'
        );
    });

    /*=====================================================
    ====================== REACTIVAR =====================
    =====================================================*/

    reactivar = catchAsync(async (
        req: Request,
        res: Response
    ) => {

        const id =
            getParam(req, 'id');

        const proveedor =
            await proveedorService.reactivar(
                id,
                req.user!
            );

        await registrarAuditoria({

            empresaId:
                req.user!.empresaId,

            usuarioId:
                req.user!.id,

            modulo:
                'Proveedores',

            accion:
                TipoAuditoria.UPDATE,

            descripcion:
                `Se reactivó el proveedor ${proveedor.nombreComercial}`,

            registroId:
                proveedor.id,

            ip:
                req.ip,

            userAgent:
                req.headers['user-agent']

        });

        return ApiResponse.success(
            res,
            proveedor,
            'Proveedor reactivado correctamente.'
        );
    });
}

export const proveedorController =
    new ProveedorController();