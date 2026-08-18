"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarActualizarConfiguracion = exports.validarCrearConfiguracion = void 0;
const configuracion_dto_1 = require("../dto/configuracion.dto");
exports.validarCrearConfiguracion = configuracion_dto_1.CrearConfiguracionSchema;
exports.validarActualizarConfiguracion = configuracion_dto_1.ActualizarConfiguracionSchema;
