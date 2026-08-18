"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarInventario = exports.validarActualizarInventario = exports.validarAjustarInventario = exports.validarCrearInventario = void 0;
const inventario_dto_1 = require("../dto/inventario.dto");
exports.validarCrearInventario = inventario_dto_1.CrearInventarioSchema;
exports.validarAjustarInventario = inventario_dto_1.AjustarInventarioSchema;
exports.validarActualizarInventario = inventario_dto_1.ActualizarInventarioSchema;
exports.validarConsultarInventario = inventario_dto_1.ConsultarInventarioSchema;
