"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarOrdenesCompra = exports.validarActualizarOrdenCompra = exports.validarCrearOrdenCompra = void 0;
const orden_compra_dto_1 = require("../dto/orden-compra.dto");
/*=====================================================
======================= CREAR =========================
=====================================================*/
exports.validarCrearOrdenCompra = orden_compra_dto_1.CrearOrdenCompraSchema;
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
exports.validarActualizarOrdenCompra = orden_compra_dto_1.ActualizarOrdenCompraSchema;
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.validarConsultarOrdenesCompra = orden_compra_dto_1.ConsultarOrdenesCompraSchema;
