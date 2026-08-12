import { Router } from 'express';
import { notificacionController } from '../controllers/notificacion.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
    CrearNotificacionSchema,
    ActualizarNotificacionSchema,
    ConsultarNotificacionesSchema,
    MarcarNotificacionSchema
} from '../dto/notificacion.dto';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Gestión de notificaciones del sistema
 */

/**
 * @swagger
 * /notificaciones:
 *   get:
 *     summary: Obtener notificaciones
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [INFO, WARNING, ERROR, SUCCESS]
 *       - in: query
 *         name: leida
 *         schema:
 *           type: boolean
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
 *     responses:
 *       200:
 *         description: Notificaciones obtenidas correctamente.
 */
router.get(
    '/',
    authorize('Notificaciones', 'Ver'),
    validate(ConsultarNotificacionesSchema),
    notificacionController.obtenerTodos
);

/**
 * @swagger
 * /notificaciones/mis:
 *   get:
 *     summary: Obtener mis notificaciones
 *     description: Obtiene las notificaciones dirigidas al usuario autenticado.
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [INFO, WARNING, ERROR, SUCCESS]
 *       - in: query
 *         name: leida
 *         schema:
 *           type: boolean
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
 *     responses:
 *       200:
 *         description: Notificaciones obtenidas correctamente.
 */
router.get(
    '/mis',
    authorize('Notificaciones', 'Ver'),
    validate(ConsultarNotificacionesSchema),
    notificacionController.obtenerMisNotificaciones
);

/**
 * @swagger
 * /notificaciones:
 *   post:
 *     summary: Crear notificación
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - mensaje
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Stock bajo
 *               mensaje:
 *                 type: string
 *                 example: El producto tiene stock por debajo del mínimo.
 *               tipo:
 *                 type: string
 *                 enum: [INFO, WARNING, ERROR, SUCCESS]
 *                 example: WARNING
 *               usuarioId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Notificación creada correctamente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.post(
    '/',
    authorize('Notificaciones', 'Crear'),
    validate(CrearNotificacionSchema),
    notificacionController.crear
);

/**
 * @swagger
 * /notificaciones/marcar-todas:
 *   patch:
 *     summary: Marcar todas mis notificaciones como leídas
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificaciones marcadas como leídas.
 */
router.patch(
    '/marcar-todas',
    authorize('Notificaciones', 'Editar'),
    notificacionController.marcarTodasLeidas
);

/**
 * @swagger
 * /notificaciones/{id}:
 *   get:
 *     summary: Obtener notificación por ID
 *     tags: [Notificaciones]
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
 *         description: Notificación obtenida correctamente.
 *       404:
 *         description: Notificación no encontrada.
 */
router.get(
    '/:id',
    authorize('Notificaciones', 'Ver'),
    notificacionController.obtenerPorId
);

/**
 * @swagger
 * /notificaciones/{id}:
 *   put:
 *     summary: Actualizar notificación
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               mensaje:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [INFO, WARNING, ERROR, SUCCESS]
 *               leida:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notificación actualizada correctamente.
 *       404:
 *         description: Notificación no encontrada.
 */
router.put(
    '/:id',
    authorize('Notificaciones', 'Editar'),
    validate(ActualizarNotificacionSchema),
    notificacionController.actualizar
);

/**
 * @swagger
 * /notificaciones/{id}/leida:
 *   patch:
 *     summary: Marcar notificación como leída
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leida:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: Notificación marcada como leída.
 *       404:
 *         description: Notificación no encontrada.
 */
router.patch(
    '/:id/leida',
    authorize('Notificaciones', 'Editar'),
    validate(MarcarNotificacionSchema),
    notificacionController.marcarLeida
);

/**
 * @swagger
 * /notificaciones/{id}:
 *   delete:
 *     summary: Eliminar notificación
 *     tags: [Notificaciones]
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
 *         description: Notificación eliminada correctamente.
 *       404:
 *         description: Notificación no encontrada.
 */
router.delete(
    '/:id',
    authorize('Notificaciones', 'Eliminar'),
    notificacionController.eliminar
);

export default router;