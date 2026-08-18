"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarSucursales = exports.validarActualizarSucursal = exports.validarCrearSucursal = void 0;
const sucursal_dto_1 = require("../dto/sucursal.dto");
/*=====================================================
======================= CREAR =========================
=====================================================*/
exports.validarCrearSucursal = sucursal_dto_1.CrearSucursalSchema;
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
exports.validarActualizarSucursal = sucursal_dto_1.ActualizarSucursalSchema;
/*=====================================================
====================== CONSULTAR ======================
=====================================================*/
exports.validarConsultarSucursales = sucursal_dto_1.ConsultarSucursalesSchema;
