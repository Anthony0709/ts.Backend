"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarActualizarCategoria = exports.validarCrearCategoria = void 0;
const zod_1 = require("zod");
const categoria_dto_1 = require("../dto/categoria.dto");
const api_response_1 = require("../../../utils/api-response");
const validarCrearCategoria = (req, res, next) => {
    try {
        req.body = categoria_dto_1.CrearCategoriaSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return api_response_1.ApiResponse.error(res, 'Datos inválidos.', 400, error.issues.map(issue => ({
                campo: issue.path.join('.'),
                mensaje: issue.message
            })));
        }
        next(error);
    }
};
exports.validarCrearCategoria = validarCrearCategoria;
const validarActualizarCategoria = (req, res, next) => {
    try {
        req.body = categoria_dto_1.ActualizarCategoriaSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return api_response_1.ApiResponse.error(res, 'Datos inválidos.', 400, error.issues.map(issue => ({
                campo: issue.path.join('.'),
                mensaje: issue.message
            })));
        }
        next(error);
    }
};
exports.validarActualizarCategoria = validarActualizarCategoria;
