"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarActualizarMarca = exports.validarCrearMarca = void 0;
const zod_1 = require("zod");
const dto_marca_1 = require("../dto/dto.marca");
const api_response_1 = require("../../../utils/api-response");
const validarCrearMarca = (req, res, next) => {
    try {
        req.body = dto_marca_1.CrearMarcaSchema.parse(req.body);
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
exports.validarCrearMarca = validarCrearMarca;
const validarActualizarMarca = (req, res, next) => {
    try {
        req.body = dto_marca_1.ActualizarMarcaSchema.parse(req.body);
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
exports.validarActualizarMarca = validarActualizarMarca;
