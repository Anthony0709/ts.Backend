"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarMovimientosCaja = exports.validarConsultarCajas = exports.validarCerrarCaja = exports.validarAbrirCaja = exports.validarActualizarCaja = exports.validarCrearCaja = void 0;
const caja_dto_1 = require("../dto/caja.dto");
/*=====================================================
======================= CREAR =========================
=====================================================*/
exports.validarCrearCaja = caja_dto_1.CrearCajaSchema;
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
exports.validarActualizarCaja = caja_dto_1.ActualizarCajaSchema;
/*=====================================================
======================= ABRIR =========================
=====================================================*/
exports.validarAbrirCaja = caja_dto_1.AbrirCajaSchema;
/*=====================================================
======================= CERRAR ========================
=====================================================*/
exports.validarCerrarCaja = caja_dto_1.CerrarCajaSchema;
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.validarConsultarCajas = caja_dto_1.ConsultarCajasSchema;
/*=====================================================
==================== MOVIMIENTOS ======================
=====================================================*/
exports.validarConsultarMovimientosCaja = caja_dto_1.ConsultarMovimientosCajaSchema;
