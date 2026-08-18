"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const api_response_1 = require("../../../utils/api-response");
class AuthController {
    service = new auth_service_1.AuthService();
    async login(req, res) {
        const resultado = await this.service.login(req.body, {
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        return api_response_1.ApiResponse.success(res, resultado, 'Inicio de sesión exitoso.');
    }
}
exports.AuthController = AuthController;
