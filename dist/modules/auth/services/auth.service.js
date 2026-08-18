"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
const auditoria_1 = require("../../../utils/auditoria");
class AuthService {
    async login(data, meta) {
        const email = data.email.trim().toLowerCase();
        const usuario = await prisma_1.default.usuario.findFirst({
            where: {
                email,
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
            throw new AppError_1.AppError('Credenciales incorrectas.', 401);
        }
        const passwordValido = await bcrypt_1.default.compare(data.password, usuario.password);
        if (!passwordValido) {
            throw new AppError_1.AppError('Credenciales incorrectas.', 401);
        }
        if (!usuario.empresa.activo) {
            throw new AppError_1.AppError('La empresa se encuentra inactiva.', 403);
        }
        if (!usuario.rol.activo) {
            throw new AppError_1.AppError('El rol del usuario se encuentra inactivo.', 403);
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new AppError_1.AppError('JWT_SECRET no está configurado.', 500, false);
        }
        const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
        const permisos = usuario.rol.permisos.map(item => ({
            id: item.permiso.id,
            modulo: item.permiso.modulo,
            accion: item.permiso.accion,
            nombre: item.permiso.nombre
        }));
        const token = jsonwebtoken_1.default.sign({
            id: usuario.id,
            email: usuario.email,
            empresaId: usuario.empresaId,
            rolId: usuario.rolId,
            rol: usuario.rol.nombre
        }, secret, {
            expiresIn: expiresIn
        });
        await (0, auditoria_1.registrarAuditoria)({
            empresaId: usuario.empresaId,
            usuarioId: usuario.id,
            modulo: 'AUTH',
            accion: 'LOGIN',
            descripcion: 'Inicio de sesión exitoso.',
            ip: meta?.ip,
            userAgent: meta?.userAgent
        });
        return {
            usuario: {
                id: usuario.id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.email,
                rol: {
                    id: usuario.rol.id,
                    nombre: usuario.rol.nombre
                },
                empresa: {
                    id: usuario.empresa.id,
                    nombre: usuario.empresa.nombre
                }
            },
            permisos,
            token
        };
    }
}
exports.AuthService = AuthService;
