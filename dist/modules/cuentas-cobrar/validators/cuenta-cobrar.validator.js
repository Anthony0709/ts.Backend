"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarObtenerCuentaCobrar = exports.validarConsultarCuentasCobrar = exports.validarRegistrarAbonoCuentaCobrar = exports.validarCrearCuentaCobrar = void 0;
const cuenta_cobrar_dto_1 = require("../dto/cuenta-cobrar.dto");
exports.validarCrearCuentaCobrar = cuenta_cobrar_dto_1.CrearCuentaCobrarSchema;
exports.validarRegistrarAbonoCuentaCobrar = cuenta_cobrar_dto_1.RegistrarAbonoCuentaCobrarSchema;
exports.validarConsultarCuentasCobrar = cuenta_cobrar_dto_1.ConsultarCuentasCobrarSchema;
exports.validarObtenerCuentaCobrar = cuenta_cobrar_dto_1.ObtenerCuentaCobrarSchema;
