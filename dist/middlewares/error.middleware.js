"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const api_response_1 = require("../utils/api-response");
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof zod_1.ZodError) {
        return api_response_1.ApiResponse.error(res, 'Datos inválidos.', 400, err.issues.map(issue => ({
            campo: issue.path.join('.'),
            mensaje: issue.message,
            codigo: issue.code
        })));
    }
    if (err instanceof AppError_1.AppError) {
        return api_response_1.ApiResponse.error(res, err.message, err.statusCode);
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        console.error('PRISMA ERROR:', err);
        switch (err.code) {
            case 'P2002':
                return api_response_1.ApiResponse.error(res, 'Ya existe un registro con uno de los valores proporcionados.', 409);
            case 'P2025':
                return api_response_1.ApiResponse.error(res, 'El registro solicitado no existe.', 404);
            case 'P2003':
                return api_response_1.ApiResponse.error(res, 'No se puede realizar la operación porque existen registros relacionados.', 409);
            default:
                return api_response_1.ApiResponse.error(res, 'Error al procesar la operación en la base de datos.', 500);
        }
    }
    console.error('ERROR NO CONTROLADO:', err);
    return api_response_1.ApiResponse.error(res, 'Error interno del servidor.', 500);
}
