"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarActualizarProveedor = exports.validarCrearProveedor = void 0;
const proveedor_dto_1 = require("../dto/proveedor.dto");
exports.validarCrearProveedor = proveedor_dto_1.CrearProveedorSchema;
exports.validarActualizarProveedor = proveedor_dto_1.ActualizarProveedorSchema;
