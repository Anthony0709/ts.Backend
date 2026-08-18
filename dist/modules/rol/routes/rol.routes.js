"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rol_controller_1 = require("../controllers/rol.controller");
const rol_dto_1 = require("../dto/rol.dto");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
const controller = new rol_controller_1.RolController();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles y permisos
 */
/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtener roles
 *     tags: [Roles]
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
 *         name: empresaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Roles obtenidos correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Roles', 'Ver'), controller.obtenerTodos);
/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Obtener rol por ID
 *     tags: [Roles]
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
 *         description: Rol obtenido correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Rol no encontrado.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Roles', 'Ver'), controller.obtenerPorId);
/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crear rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - empresaId
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: ADMIN
 *               nombre:
 *                 type: string
 *                 example: Administrador
 *               descripcion:
 *                 type: string
 *                 example: Acceso administrativo del sistema
 *               empresaId:
 *                 type: string
 *                 example: clxxxxxxxxxxxxxxxxxxxxxxxx
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Rol creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Roles', 'Crear'), (0, validate_middleware_1.validate)(rol_dto_1.CrearRolSchema), controller.crear);
/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Actualizar rol
 *     tags: [Roles]
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
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               empresaId:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Rol no encontrado.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Roles', 'Editar'), (0, validate_middleware_1.validate)(rol_dto_1.ActualizarRolSchema), controller.actualizar);
/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Desactivar rol
 *     tags: [Roles]
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
 *         description: Rol desactivado correctamente.
 *       400:
 *         description: No se puede desactivar el rol.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Rol no encontrado.
 */
router.delete('/:id', (0, authorize_middleware_1.authorize)('Roles', 'Eliminar'), controller.eliminar);
/**
 * @swagger
 * /roles/{id}/reactivar:
 *   patch:
 *     summary: Reactivar rol
 *     tags: [Roles]
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
 *         description: Rol reactivado correctamente.
 *       400:
 *         description: El rol ya está activo.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Rol no encontrado.
 */
router.patch('/:id/reactivar', (0, authorize_middleware_1.authorize)('Roles', 'Editar'), controller.reactivar);
/**
 * @swagger
 * /roles/{id}/permisos:
 *   get:
 *     summary: Obtener permisos del rol
 *     tags: [Roles]
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
 *         description: Permisos obtenidos correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Rol no encontrado.
 */
router.get('/:id/permisos', (0, authorize_middleware_1.authorize)('Roles', 'Ver'), controller.obtenerPermisos);
/**
 * @swagger
 * /roles/{id}/permisos:
 *   put:
 *     summary: Guardar permisos del rol
 *     tags: [Roles]
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
 *             required:
 *               - permisos
 *             properties:
 *               permisos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - clxxxxxxxxxxxxxxxxxxxxxxxx
 *                   - clyyyyyyyyyyyyyyyyyyyyyyyy
 *     responses:
 *       200:
 *         description: Permisos actualizados correctamente.
 *       400:
 *         description: Lista de permisos inválida.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Rol no encontrado.
 */
router.put('/:id/permisos', (0, authorize_middleware_1.authorize)('Roles', 'Editar'), controller.guardarPermisos);
exports.default = router;
