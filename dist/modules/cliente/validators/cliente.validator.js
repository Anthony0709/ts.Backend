"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarActualizarCliente = exports.validarCrearCliente = void 0;
const cliente_dto_1 = require("../dto/cliente.dto");
exports.validarCrearCliente = cliente_dto_1.CrearClienteSchema;
exports.validarActualizarCliente = cliente_dto_1.ActualizarClienteSchema;
