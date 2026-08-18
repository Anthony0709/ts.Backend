"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const api_response_1 = require("../utils/api-response");
function authorize(modulo, accion) {
    return (req, res, next) => {
        if (!req.user) {
            return api_response_1.ApiResponse.error(res, 'Usuario no autenticado.', 401);
        }
        if (req.user.rol === 'Super Administrador') {
            return next();
        }
        const permiso = `${modulo}.${accion}`;
        if (!req.user.permisos.includes(permiso)) {
            return api_response_1.ApiResponse.error(res, 'No tiene permisos para realizar esta acción.', 403);
        }
        next();
    };
}
