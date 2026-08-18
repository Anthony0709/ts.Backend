"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarGastos = exports.validarActualizarGasto = exports.validarCrearGasto = void 0;
const gasto_dto_1 = require("../dto/gasto.dto");
/*=====================================================
======================= CREAR =========================
=====================================================*/
exports.validarCrearGasto = gasto_dto_1.CrearGastoSchema;
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
exports.validarActualizarGasto = gasto_dto_1.ActualizarGastoSchema;
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.validarConsultarGastos = gasto_dto_1.ConsultarGastosSchema;
