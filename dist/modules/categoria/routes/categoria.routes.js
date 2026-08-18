"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoria_controller_1 = require("../controllers/categoria.controller");
const categoria_dto_1 = require("../dto/categoria.dto");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Gestión de categorías de productos
 */
/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Obtener categorías
 *     tags: [Categorías]
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
 *         name: estado
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Categorías obtenidas correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Categorias', 'Ver'), categoria_controller_1.categoriaController.obtenerTodos);
/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags: [Categorías]
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
 *         description: Categoría obtenida correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Categoría no encontrada.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Categorias', 'Ver'), categoria_controller_1.categoriaController.obtenerPorId);
/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Crear categoría
 *     description: El código de 4 dígitos se genera automáticamente en el backend.
 *     tags: [Categorías]
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
 *               nombre:
 *                 type: string
 *                 example: Electrónica
 *               descripcion:
 *                 type: string
 *                 example: Productos electrónicos
 *               color:
 *                 type: string
 *                 example: "#2563EB"
 *               icono:
 *                 type: string
 *                 example: devices
 *               orden:
 *                 type: integer
 *                 example: 1
 *               estado:
 *                 type: boolean
 *                 example: true
 *               empresaId:
 *                 type: string
 *                 example: clxxxxxxxxxxxxxxxxxxxxxxxx
 *     responses:
 *       201:
 *         description: Categoría creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Categorias', 'Crear'), (0, validate_middleware_1.validate)(categoria_dto_1.CrearCategoriaSchema), categoria_controller_1.categoriaController.crear);
/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Actualizar categoría
 *     tags: [Categorías]
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               color:
 *                 type: string
 *               icono:
 *                 type: string
 *               orden:
 *                 type: integer
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Categoría no encontrada.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Categorias', 'Editar'), (0, validate_middleware_1.validate)(categoria_dto_1.ActualizarCategoriaSchema), categoria_controller_1.categoriaController.actualizar);
/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Desactivar categoría
 *     tags: [Categorías]
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
 *         description: Categoría desactivada correctamente.
 *       400:
 *         description: La categoría ya está desactivada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Categoría no encontrada.
 */
router.delete('/:id', (0, authorize_middleware_1.authorize)('Categorias', 'Eliminar'), categoria_controller_1.categoriaController.eliminar);
/**
 * @swagger
 * /categorias/{id}/reactivar:
 *   patch:
 *     summary: Reactivar categoría
 *     tags: [Categorías]
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
 *         description: Categoría reactivada correctamente.
 *       400:
 *         description: La categoría ya está activa.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Categoría no encontrada.
 */
router.patch('/:id/reactivar', (0, authorize_middleware_1.authorize)('Categorias', 'Editar'), categoria_controller_1.categoriaController.reactivar);
exports.default = router;
