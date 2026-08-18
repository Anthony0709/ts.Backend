"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificacion_controller_1 = require("../controllers/notificacion.controller");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const notificacion_dto_1 = require("../dto/notificacion.dto");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
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
router.get('/', (0, authorize_middleware_1.authorize)('Notificaciones', 'Ver'), (0, validate_middleware_1.validate)(notificacion_dto_1.ConsultarNotificacionesSchema), notificacion_controller_1.notificacionController.obtenerTodos);
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
router.get('/mis', (0, authorize_middleware_1.authorize)('Notificaciones', 'Ver'), (0, validate_middleware_1.validate)(notificacion_dto_1.ConsultarNotificacionesSchema), notificacion_controller_1.notificacionController.obtenerMisNotificaciones);
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
router.post('/', (0, authorize_middleware_1.authorize)('Notificaciones', 'Crear'), (0, validate_middleware_1.validate)(notificacion_dto_1.CrearNotificacionSchema), notificacion_controller_1.notificacionController.crear);
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
router.patch('/marcar-todas', (0, authorize_middleware_1.authorize)('Notificaciones', 'Editar'), notificacion_controller_1.notificacionController.marcarTodasLeidas);
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
router.get('/:id', (0, authorize_middleware_1.authorize)('Notificaciones', 'Ver'), notificacion_controller_1.notificacionController.obtenerPorId);
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
router.put('/:id', (0, authorize_middleware_1.authorize)('Notificaciones', 'Editar'), (0, validate_middleware_1.validate)(notificacion_dto_1.ActualizarNotificacionSchema), notificacion_controller_1.notificacionController.actualizar);
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
router.patch('/:id/leida', (0, authorize_middleware_1.authorize)('Notificaciones', 'Editar'), (0, validate_middleware_1.validate)(notificacion_dto_1.MarcarNotificacionSchema), notificacion_controller_1.notificacionController.marcarLeida);
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
router.delete('/:id', (0, authorize_middleware_1.authorize)('Notificaciones', 'Eliminar'), notificacion_controller_1.notificacionController.eliminar);
exports.default = router;
