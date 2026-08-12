import { Router } from 'express';
import { auditoriaController } from '../controllers/auditoria.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { AuditoriaQuerySchema } from '../dto/auditoria.dto';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Auditoría
 *   description: Consulta del historial de acciones del sistema
 */

/**
 * @swagger
 * /auditorias:
 *   get:
 *     summary: Obtener registros de auditoría
 *     tags: [Auditoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: modulo
 *         schema:
 *           type: string
 *       - in: query
 *         name: accion
 *         schema:
 *           type: string
 *           enum:
 *             - LOGIN
 *             - LOGOUT
 *             - CREATE
 *             - UPDATE
 *             - DELETE
 *             - APROBAR
 *             - ANULAR
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: string
 *       - in: query
 *         name: registroId
 *         schema:
 *           type: string
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Registros obtenidos correctamente.
 *       400:
 *         description: Parámetros inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get(
    '/',
    authorize('Auditoria', 'Ver'),
    validate(AuditoriaQuerySchema),
    auditoriaController.obtenerTodos
);

/**
 * @swagger
 * /auditorias/{id}:
 *   get:
 *     summary: Obtener registro de auditoría por ID
 *     tags: [Auditoría]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro obtenido correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Registro de auditoría no encontrado.
 */
router.get(
    '/:id',
    authorize('Auditoria', 'Ver'),
    auditoriaController.obtenerPorId
);

export default router;