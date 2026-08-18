"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_controller_1 = require("../controllers/usuario.controller");
const usuario_validator_1 = require("../validators/usuario.validator");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
const controller = new usuario_controller_1.UsuarioController();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener usuarios
 *     tags: [Usuarios]
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
 *         name: activo
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Usuarios obtenidos correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Usuarios', 'Ver'), controller.obtenerTodos);
/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
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
 *         description: Usuario obtenido correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Usuario no encontrado.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Usuarios', 'Ver'), controller.obtenerPorId);
/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombres
 *               - apellidos
 *               - email
 *               - password
 *               - empresaId
 *               - rolId
 *             properties:
 *               nombres:
 *                 type: string
 *                 example: Juan
 *               apellidos:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@empresa.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               empresaId:
 *                 type: string
 *                 example: clxxxxxxxxxxxxxxxxxxxxxxxx
 *               rolId:
 *                 type: string
 *                 example: clxxxxxxxxxxxxxxxxxxxxxxxx
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       409:
 *         description: El usuario ya existe.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Usuarios', 'Crear'), (0, validate_middleware_1.validate)(usuario_validator_1.crearUsuarioSchema), controller.crear);
/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
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
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               empresaId:
 *                 type: string
 *               rolId:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Usuario no encontrado.
 *       409:
 *         description: El usuario ya existe.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Usuarios', 'Editar'), (0, validate_middleware_1.validate)(usuario_validator_1.actualizarUsuarioSchema), controller.actualizar);
/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Desactivar usuario
 *     tags: [Usuarios]
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
 *         description: Usuario desactivado correctamente.
 *       400:
 *         description: No se puede desactivar el usuario.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Usuario no encontrado.
 */
router.delete('/:id', (0, authorize_middleware_1.authorize)('Usuarios', 'Eliminar'), controller.eliminar);
/**
 * @swagger
 * /usuarios/{id}/reactivar:
 *   patch:
 *     summary: Reactivar usuario
 *     tags: [Usuarios]
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
 *         description: Usuario reactivado correctamente.
 *       400:
 *         description: El usuario ya está activo.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Usuario no encontrado.
 */
router.patch('/:id/reactivar', (0, authorize_middleware_1.authorize)('Usuarios', 'Editar'), controller.reactivar);
exports.default = router;
