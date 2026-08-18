"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarMarcarNotificacion = exports.validarObtenerNotificacion = exports.validarConsultarNotificaciones = exports.validarActualizarNotificacion = exports.validarCrearNotificacion = void 0;
const notificacion_dto_1 = require("../dto/notificacion.dto");
exports.validarCrearNotificacion = notificacion_dto_1.CrearNotificacionSchema;
exports.validarActualizarNotificacion = notificacion_dto_1.ActualizarNotificacionSchema;
exports.validarConsultarNotificaciones = notificacion_dto_1.ConsultarNotificacionesSchema;
exports.validarObtenerNotificacion = notificacion_dto_1.ObtenerNotificacionSchema;
exports.validarMarcarNotificacion = notificacion_dto_1.MarcarNotificacionSchema;
