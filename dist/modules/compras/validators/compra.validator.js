"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarCompras = exports.validarActualizarCompra = exports.validarCrearCompra = void 0;
const compra_dto_1 = require("../dto/compra.dto");
/*=====================================================
======================= CREAR =========================
=====================================================*/
exports.validarCrearCompra = compra_dto_1.CrearCompraSchema;
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
exports.validarActualizarCompra = compra_dto_1.ActualizarCompraSchema;
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.validarConsultarCompras = compra_dto_1.ConsultarComprasSchema;
