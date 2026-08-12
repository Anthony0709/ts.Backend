import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { ApiResponse } from '../../../utils/api-response';
import { getParam } from '../../../utils/get-param';
import { EmpresaService } from '../services/empresa.service';

const service = new EmpresaService();

export class EmpresaController {
    obtenerTodos = catchAsync(async (req: Request, res: Response) => {
        const resultado = await service.obtenerTodos(req.query);
        return ApiResponse.success(res, resultado, 'Empresas obtenidas correctamente.');
    });

    obtenerPorId = catchAsync(async (req: Request, res: Response) => {
        const id = getParam(req, 'id');
        const empresa = await service.obtenerPorId(id);
        return ApiResponse.success(res, empresa, 'Empresa obtenida correctamente.');
    });

    crear = catchAsync(async (req: Request, res: Response) => {
        const empresa = await service.crear(req.body, req.user!);
        return ApiResponse.success(res, empresa, 'Empresa creada correctamente.', 201);
    });

    actualizar = catchAsync(async (req: Request, res: Response) => {
        const id = getParam(req, 'id');
        const empresa = await service.actualizar(id, req.body, req.user!);
        return ApiResponse.success(res, empresa, 'Empresa actualizada correctamente.');
    });

    eliminar = catchAsync(async (req: Request, res: Response) => {
        const id = getParam(req, 'id');
        const empresa = await service.eliminar(id, req.user!);
        return ApiResponse.success(res, empresa, 'Empresa desactivada correctamente.');
    });

    reactivar = catchAsync(async (req: Request, res: Response) => {
        const id = getParam(req, 'id');
        const empresa = await service.reactivar(id, req.user!);
        return ApiResponse.success(res, empresa, 'Empresa reactivada correctamente.');
    });
}