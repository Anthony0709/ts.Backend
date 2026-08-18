"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const catchAsync_1 = require("../../../utils/catchAsync");
const router = (0, express_1.Router)();
const controller = new auth_controller_1.AuthController();
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Demasiados intentos de inicio de sesión. Intente nuevamente en unos minutos.'
    }
});
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y devuelve JWT, empresa, rol y permisos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@enterpriseflow.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: Credenciales incorrectas.
 *       403:
 *         description: Usuario, empresa o rol inactivo.
 *       429:
 *         description: Demasiados intentos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/login', loginLimiter, (0, validate_middleware_1.validate)(auth_validator_1.loginSchema), (0, catchAsync_1.catchAsync)((req, res) => controller.login(req, res)));
exports.default = router;
