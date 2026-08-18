"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const api_response_1 = require("../utils/api-response");
async function authenticate(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return api_response_1.ApiResponse.error(res, 'Token no proporcionado.', 401);
        }
        const [type, token] = authorization.split(' ');
        if (type !== 'Bearer' || !token) {
            return api_response_1.ApiResponse.error(res, 'Formato de token inválido.', 401);
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET no configurado.');
            return api_response_1.ApiResponse.error(res, 'Error de configuración del servidor.', 500);
        }
        const payload = jsonwebtoken_1.default.verify(token, secret);
        if (!payload.id ||
            !payload.empresaId ||
            !payload.rolId) {
            return api_response_1.ApiResponse.error(res, 'Token inválido.', 401);
        }
        const usuario = await prisma_1.default.usuario.findFirst({
            where: {
                id: payload.id,
                empresaId: payload.empresaId,
                activo: true
            },
            include: {
                empresa: true,
                rol: {
                    include: {
                        permisos: {
                            where: {
                                permiso: {
                                    estado: true
                                }
                            },
                            include: {
                                permiso: true
                            }
                        }
                    }
                }
            }
        });
        if (!usuario) {
            return api_response_1.ApiResponse.error(res, 'Sesión no válida.', 401);
        }
        if (!usuario.empresa.activo) {
            return api_response_1.ApiResponse.error(res, 'La empresa se encuentra inactiva.', 403);
        }
        if (!usuario.rol.activo) {
            return api_response_1.ApiResponse.error(res, 'El rol se encuentra inactivo.', 403);
        }
        req.user = {
            id: usuario.id,
            empresaId: usuario.empresaId,
            rol: usuario.rol.nombre,
            permisos: usuario.rol.permisos.map(item => `${item.permiso.modulo}.${item.permiso.accion}`)
        };
        next();
    }
    catch (error) {
        return api_response_1.ApiResponse.error(res, 'Token inválido o expirado.', 401);
    }
}
