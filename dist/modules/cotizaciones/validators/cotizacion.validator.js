"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarCotizaciones = exports.validarActualizarCotizacion = exports.validarCrearCotizacion = void 0;
const cotizacion_dto_1 = require("../dto/cotizacion.dto");
/*=====================================================
======================= CREAR =========================
=====================================================*/
exports.validarCrearCotizacion = cotizacion_dto_1.CrearCotizacionSchema;
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
exports.validarActualizarCotizacion = cotizacion_dto_1.ActualizarCotizacionSchema;
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.validarConsultarCotizaciones = cotizacion_dto_1.ConsultarCotizacionesSchema;
