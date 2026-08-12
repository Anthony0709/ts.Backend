import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../config/prisma';
import { LoginDto, LoginMeta } from '../dto/auth.dto';
import { AppError } from '../../../utils/AppError';
import { registrarAuditoria } from '../../../utils/auditoria';

export class AuthService {
    async login(data: LoginDto, meta?: LoginMeta) {
        const email = data.email.trim().toLowerCase();
        const usuario = await prisma.usuario.findFirst({
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
            throw new AppError('Credenciales incorrectas.', 401);
        }

        const passwordValido = await bcrypt.compare(
            data.password,
            usuario.password
        );

        if (!passwordValido) {
            throw new AppError('Credenciales incorrectas.', 401);
        }

        if (!usuario.empresa.activo) {
            throw new AppError('La empresa se encuentra inactiva.', 403);
        }

        if (!usuario.rol.activo) {
            throw new AppError('El rol del usuario se encuentra inactivo.', 403);
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new AppError('JWT_SECRET no está configurado.', 500, false);
        }

        const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

        const permisos = usuario.rol.permisos.map(item => ({
            id: item.permiso.id,
            modulo: item.permiso.modulo,
            accion: item.permiso.accion,
            nombre: item.permiso.nombre
        }));

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                empresaId: usuario.empresaId,
                rolId: usuario.rolId,
                rol: usuario.rol.nombre
            },
            secret,
            {
                expiresIn: expiresIn as jwt.SignOptions['expiresIn']
            }
        );

        await registrarAuditoria({
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