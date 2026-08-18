"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string({
        message: 'El correo electrónico es obligatorio.'
    })
        .trim()
        .toLowerCase()
        .email('El correo electrónico no es válido.').max(150, 'El correo electrónico no puede superar los 150 caracteres.'),
    password: zod_1.z.string({
        message: 'La contraseña es obligatoria.'
    })
        .min(6, 'La contraseña debe tener al menos 6 caracteres.').max(100, 'La contraseña no puede superar los 100 caracteres.')
});
