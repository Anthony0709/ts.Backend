"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarVentas = exports.validarActualizarVenta = exports.validarCrearVenta = void 0;
const venta_dto_1 = require("../dto/venta.dto");
/*=====================================================
======================= CREAR =========================
=====================================================*/
exports.validarCrearVenta = venta_dto_1.CrearVentaSchema;
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
exports.validarActualizarVenta = venta_dto_1.ActualizarVentaSchema;
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.validarConsultarVentas = venta_dto_1.ConsultarVentasSchema;
