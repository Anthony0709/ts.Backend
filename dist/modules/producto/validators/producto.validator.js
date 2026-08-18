"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarActualizarProducto = exports.validarCrearProducto = void 0;
const zod_1 = require("zod");
const producto_dto_1 = require("../dto/producto.dto");
const api_response_1 = require("../../../utils/api-response");
const validarCrearProducto = (req, res, next) => {
    try {
        req.body = producto_dto_1.CrearProductoSchema.parse(req.body);
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
exports.validarCrearProducto = validarCrearProducto;
const validarActualizarProducto = (req, res, next) => {
    try {
        req.body = producto_dto_1.ActualizarProductoSchema.parse(req.body);
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
exports.validarActualizarProducto = validarActualizarProducto;
