"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarUsuarioSchema = exports.crearUsuarioSchema = void 0;
const zod_1 = require("zod");
exports.crearUsuarioSchema = zod_1.z.object({
    nombres: zod_1.z
        .string()
        .trim()
        .min(2, 'Los nombres son obligatorios.')
        .max(100, 'Los nombres no pueden superar los 100 caracteres.'),
    apellidos: zod_1.z
        .string()
        .trim()
        .min(2, 'Los apellidos son obligatorios.')
        .max(100, 'Los apellidos no pueden superar los 100 caracteres.'),
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.'),
    password: zod_1.z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .max(100, 'La contraseña no puede superar los 100 caracteres.'),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.'),
    rolId: zod_1.z
        .string()
        .cuid('Rol inválido.'),
    activo: zod_1.z
        .boolean()
        .optional()
        .default(true)
}).strict();
exports.actualizarUsuarioSchema = zod_1.z.object({
    nombres: zod_1.z
        .string()
        .trim()
        .min(2, 'Los nombres deben tener al menos 2 caracteres.')
        .max(100, 'Los nombres no pueden superar los 100 caracteres.')
        .optional(),
    apellidos: zod_1.z
        .string()
        .trim()
        .min(2, 'Los apellidos deben tener al menos 2 caracteres.')
        .max(100, 'Los apellidos no pueden superar los 100 caracteres.')
        .optional(),
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email('Correo electrónico inválido.')
        .max(150, 'El correo electrónico no puede superar los 150 caracteres.')
        .optional(),
    password: zod_1.z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .max(100, 'La contraseña no puede superar los 100 caracteres.')
        .optional(),
    empresaId: zod_1.z
        .string()
        .cuid('Empresa inválida.')
        .optional(),
    rolId: zod_1.z
        .string()
        .cuid('Rol inválido.')
        .optional(),
    activo: zod_1.z
        .boolean()
        .optional()
}).strict();
