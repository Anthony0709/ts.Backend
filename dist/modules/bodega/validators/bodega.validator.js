"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarBodegas = exports.validarActualizarBodega = exports.validarCrearBodega = void 0;
const bodega_dto_1 = require("../dto/bodega.dto");
/*=====================================================
======================= CREAR =========================
=====================================================*/
exports.validarCrearBodega = bodega_dto_1.CrearBodegaSchema;
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
exports.validarActualizarBodega = bodega_dto_1.ActualizarBodegaSchema;
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.validarConsultarBodegas = bodega_dto_1.ConsultarBodegasSchema;
