import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../../../utils/api-response';

export class AuthController {
    private readonly service = new AuthService();

    async login(req: Request, res: Response) {
        const resultado = await this.service.login(
            req.body,
            {
                ip: req.ip,
                userAgent: req.get('user-agent')
            }
        );

        return ApiResponse.success(
            res,
            resultado,
            'Inicio de sesión exitoso.'
        );
    }
}