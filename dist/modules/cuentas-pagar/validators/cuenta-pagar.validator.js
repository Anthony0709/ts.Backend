"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarPagosCuentaPagar = exports.validarRegistrarPagoCuentaPagar = exports.validarConsultarCuentasPagar = exports.validarActualizarCuentaPagar = exports.validarCrearCuentaPagar = void 0;
const cuenta_pagar_dto_1 = require("../dto/cuenta-pagar.dto");
/*=====================================================
======================= CREAR =========================
=====================================================*/
exports.validarCrearCuentaPagar = cuenta_pagar_dto_1.CrearCuentaPagarSchema;
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
exports.validarActualizarCuentaPagar = cuenta_pagar_dto_1.ActualizarCuentaPagarSchema;
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.validarConsultarCuentasPagar = cuenta_pagar_dto_1.ConsultarCuentasPagarSchema;
/*=====================================================
==================== REGISTRAR PAGO ===================
=====================================================*/
exports.validarRegistrarPagoCuentaPagar = cuenta_pagar_dto_1.RegistrarPagoCuentaPagarSchema;
/*=====================================================
==================== CONSULTAR PAGOS ==================
=====================================================*/
exports.validarConsultarPagosCuentaPagar = cuenta_pagar_dto_1.ConsultarPagosCuentaPagarSchema;
