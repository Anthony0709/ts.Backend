"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarResumenCajaPOS = exports.validarConsultarCajaPOS = exports.validarBuscarClientesPOS = exports.validarBuscarProductosPOS = exports.validarProcesarVentaPOS = void 0;
const pos_dto_1 = require("../dto/pos.dto");
exports.validarProcesarVentaPOS = pos_dto_1.ProcesarVentaPOSSchema;
exports.validarBuscarProductosPOS = pos_dto_1.BuscarProductosPOSSchema;
exports.validarBuscarClientesPOS = pos_dto_1.BuscarClientesPOSSchema;
exports.validarConsultarCajaPOS = pos_dto_1.ConsultarCajaPOSSchema;
exports.validarConsultarResumenCajaPOS = pos_dto_1.ConsultarResumenCajaPOSSchema;
