"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditoria_controller_1 = require("../controllers/auditoria.controller");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const auditoria_dto_1 = require("../dto/auditoria.dto");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
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
router.get('/', (0, authorize_middleware_1.authorize)('Auditoria', 'Ver'), (0, validate_middleware_1.validate)(auditoria_dto_1.AuditoriaQuerySchema), auditoria_controller_1.auditoriaController.obtenerTodos);
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
router.get('/:id', (0, authorize_middleware_1.authorize)('Auditoria', 'Ver'), auditoria_controller_1.auditoriaController.obtenerPorId);
exports.default = router;
