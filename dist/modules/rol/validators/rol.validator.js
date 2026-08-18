"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarActualizarRol = exports.validarCrearRol = void 0;
const zod_1 = require("zod");
const rol_dto_1 = require("../dto/rol.dto");
const AppError_1 = require("../../../utils/AppError");
/*=====================================================*
*=================== CREAR ROL ========================*
*=====================================================*/
const validarCrearRol = (req, _res, next) => {
    try {
        req.body = rol_dto_1.CrearRolSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return next(new AppError_1.AppError(error.issues[0]?.message ?? 'Datos inválidos.', 400));
        }
        next(error);
    }
};
exports.validarCrearRol = validarCrearRol;
/*=====================================================*
*================ ACTUALIZAR ROL ======================*
*=====================================================*/
const validarActualizarRol = (req, _res, next) => {
    try {
        req.body = rol_dto_1.ActualizarRolSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return next(new AppError_1.AppError(error.issues[0]?.message ?? 'Datos inválidos.', 400));
        }
        next(error);
    }
};
exports.validarActualizarRol = validarActualizarRol;
