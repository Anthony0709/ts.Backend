import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../../../middlewares/validate.middleware';
import { loginSchema } from '../validators/auth.validator';
import { catchAsync } from '../../../utils/catchAsync';

const router = Router();
const controller = new AuthController();

const loginLimiter = rateLimit({
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
router.post(
    '/login',
    loginLimiter,
    validate(loginSchema),
    catchAsync((req, res) => controller.login(req, res))
);

export default router;