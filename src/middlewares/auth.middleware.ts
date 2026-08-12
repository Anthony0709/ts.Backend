import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/api-response';

interface TokenPayload extends JwtPayload {
    id: string;
    email: string;
    empresaId: string;
    rolId: string;
    rol: string;
}

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return ApiResponse.error(
                res,
                'Token no proporcionado.',
                401
            );
        }

        const [type, token] = authorization.split(' ');

        if (type !== 'Bearer' || !token) {
            return ApiResponse.error(
                res,
                'Formato de token inválido.',
                401
            );
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error('JWT_SECRET no configurado.');
            return ApiResponse.error(
                res,
                'Error de configuración del servidor.',
                500
            );
        }

        const payload = jwt.verify(
            token,
            secret
        ) as TokenPayload;

        if (
            !payload.id ||
            !payload.empresaId ||
            !payload.rolId
        ) {
            return ApiResponse.error(
                res,
                'Token inválido.',
                401
            );
        }

        const usuario = await prisma.usuario.findFirst({
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
            return ApiResponse.error(
                res,
                'Sesión no válida.',
                401
            );
        }

        if (!usuario.empresa.activo) {
            return ApiResponse.error(
                res,
                'La empresa se encuentra inactiva.',
                403
            );
        }

        if (!usuario.rol.activo) {
            return ApiResponse.error(
                res,
                'El rol se encuentra inactivo.',
                403
            );
        }

        req.user = {
            id: usuario.id,
            empresaId: usuario.empresaId,
            rol: usuario.rol.nombre,
            permisos: usuario.rol.permisos.map(
                item =>
                    `${item.permiso.modulo}.${item.permiso.accion}`
            )
        };

        next();
    } catch (error) {
        return ApiResponse.error(
            res,
            'Token inválido o expirado.',
            401
        );
    }
}