"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarCambiarEstadoSuscripcion = exports.validarObtenerSuscripcion = exports.validarConsultarSuscripciones = exports.validarActualizarSuscripcion = exports.validarCrearSuscripcion = void 0;
const suscripcion_dto_1 = require("../dto/suscripcion.dto");
exports.validarCrearSuscripcion = suscripcion_dto_1.CrearSuscripcionSchema;
exports.validarActualizarSuscripcion = suscripcion_dto_1.ActualizarSuscripcionSchema;
exports.validarConsultarSuscripciones = suscripcion_dto_1.ConsultarSuscripcionesSchema;
exports.validarObtenerSuscripcion = suscripcion_dto_1.ObtenerSuscripcionSchema;
exports.validarCambiarEstadoSuscripcion = suscripcion_dto_1.CambiarEstadoSuscripcionSchema;
