"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarDevoluciones = exports.validarActualizarDevolucion = exports.validarCrearDevolucion = void 0;
const devolucion_dto_1 = require("../dto/devolucion.dto");
/*=====================================================
==================== CREAR ============================
=====================================================*/
exports.validarCrearDevolucion = devolucion_dto_1.CrearDevolucionSchema;
/*=====================================================
================== ACTUALIZAR =========================
=====================================================*/
exports.validarActualizarDevolucion = devolucion_dto_1.ActualizarDevolucionSchema;
/*=====================================================
==================== CONSULTAR ========================
=====================================================*/
exports.validarConsultarDevoluciones = devolucion_dto_1.ConsultarDevolucionesSchema;
