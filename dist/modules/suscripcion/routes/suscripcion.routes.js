"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const suscripcion_controller_1 = require("../controllers/suscripcion.controller");
const suscripcion_dto_1 = require("../dto/suscripcion.dto");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Suscripciones
 *   description: Gestión de suscripciones de empresas
 */
/**
 * @swagger
 * /suscripciones:
 *   get:
 *     summary: Obtener suscripciones
 *     tags: [Suscripciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: empresaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: planId
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ACTIVA, VENCIDA, SUSPENDIDA, CANCELADA]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Suscripciones obtenidas correctamente.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Suscripciones', 'Ver'), (0, validate_middleware_1.validate)(suscripcion_dto_1.ConsultarSuscripcionesSchema), suscripcion_controller_1.suscripcionController.obtenerTodos);
/**
 * @swagger
 * /suscripciones:
 *   post:
 *     summary: Crear suscripción
 *     tags: [Suscripciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empresaId
 *               - planId
 *               - fechaInicio
 *               - precio
 *             properties:
 *               empresaId:
 *                 type: string
 *               planId:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               precio:
 *                 type: number
 *                 example: 99.99
 *               renovacionAutomatica:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Suscripción creada correctamente.
 *       400:
 *         description: La empresa ya tiene una suscripción activa.
 *       404:
 *         description: Empresa o plan no encontrado.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Suscripciones', 'Crear'), (0, validate_middleware_1.validate)(suscripcion_dto_1.CrearSuscripcionSchema), suscripcion_controller_1.suscripcionController.crear);
/**
 * @swagger
 * /suscripciones/{id}:
 *   get:
 *     summary: Obtener suscripción por ID
 *     tags: [Suscripciones]
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
 *         description: Suscripción obtenida correctamente.
 *       404:
 *         description: Suscripción no encontrada.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Suscripciones', 'Ver'), suscripcion_controller_1.suscripcionController.obtenerPorId);
/**
 * @swagger
 * /suscripciones/{id}:
 *   put:
 *     summary: Actualizar suscripción
 *     tags: [Suscripciones]
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
 *               planId:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               precio:
 *                 type: number
 *               renovacionAutomatica:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Suscripción actualizada correctamente.
 *       404:
 *         description: Suscripción no encontrada.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Suscripciones', 'Editar'), (0, validate_middleware_1.validate)(suscripcion_dto_1.ActualizarSuscripcionSchema), suscripcion_controller_1.suscripcionController.actualizar);
/**
 * @swagger
 * /suscripciones/{id}/activar:
 *   patch:
 *     summary: Activar suscripción
 *     tags: [Suscripciones]
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
 *         description: Suscripción activada correctamente.
 */
router.patch('/:id/activar', (0, authorize_middleware_1.authorize)('Suscripciones', 'Editar'), suscripcion_controller_1.suscripcionController.activar);
/**
 * @swagger
 * /suscripciones/{id}/suspender:
 *   patch:
 *     summary: Suspender suscripción
 *     tags: [Suscripciones]
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
 *         description: Suscripción suspendida correctamente.
 */
router.patch('/:id/suspender', (0, authorize_middleware_1.authorize)('Suscripciones', 'Editar'), suscripcion_controller_1.suscripcionController.suspender);
/**
 * @swagger
 * /suscripciones/{id}/cancelar:
 *   patch:
 *     summary: Cancelar suscripción
 *     tags: [Suscripciones]
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
 *               motivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Suscripción cancelada correctamente.
 */
router.patch('/:id/cancelar', (0, authorize_middleware_1.authorize)('Suscripciones', 'Editar'), suscripcion_controller_1.suscripcionController.cancelar);
/**
 * @swagger
 * /suscripciones/{id}/renovar:
 *   patch:
 *     summary: Renovar suscripción
 *     tags: [Suscripciones]
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
 *         description: Suscripción renovada correctamente.
 */
router.patch('/:id/renovar', (0, authorize_middleware_1.authorize)('Suscripciones', 'Editar'), suscripcion_controller_1.suscripcionController.renovar);
/**
 * @swagger
 * /suscripciones/{id}:
 *   delete:
 *     summary: Eliminar suscripción
 *     tags: [Suscripciones]
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
 *         description: Suscripción eliminada correctamente.
 *       404:
 *         description: Suscripción no encontrada.
 */
router.delete('/:id', (0, authorize_middleware_1.authorize)('Suscripciones', 'Eliminar'), suscripcion_controller_1.suscripcionController.eliminar);
exports.default = router;
