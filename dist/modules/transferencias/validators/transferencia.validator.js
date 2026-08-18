"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultarTransferencias = exports.validarCrearTransferencia = void 0;
const transferencia_dto_1 = require("../dto/transferencia.dto");
exports.validarCrearTransferencia = transferencia_dto_1.CrearTransferenciaSchema;
exports.validarConsultarTransferencias = transferencia_dto_1.ConsultarTransferenciasSchema;
