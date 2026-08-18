"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marca_controller_1 = require("../controllers/marca.controller");
const dto_marca_1 = require("../dto/dto.marca");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Marcas
 *   description: Gestión de marcas de productos
 */
/**
 * @swagger
 * /marcas:
 *   get:
 *     summary: Obtener marcas
 *     tags: [Marcas]
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
 *         description: Marcas obtenidas correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Marcas', 'Ver'), marca_controller_1.marcaController.obtenerTodos);
/**
 * @swagger
 * /marcas/{id}:
 *   get:
 *     summary: Obtener marca por ID
 *     tags: [Marcas]
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
 *         description: Marca obtenida correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Marca no encontrada.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Marcas', 'Ver'), marca_controller_1.marcaController.obtenerPorId);
/**
 * @swagger
 * /marcas:
 *   post:
 *     summary: Crear marca
 *     tags: [Marcas]
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
 *                 example: Samsung
 *               descripcion:
 *                 type: string
 *                 example: Marca de productos electrónicos
 *               estado:
 *                 type: boolean
 *                 example: true
 *               empresaId:
 *                 type: string
 *                 example: clxxxxxxxxxxxxxxxxxxxxxxxx
 *     responses:
 *       201:
 *         description: Marca creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Marcas', 'Crear'), (0, validate_middleware_1.validate)(dto_marca_1.CrearMarcaSchema), marca_controller_1.marcaController.crear);
/**
 * @swagger
 * /marcas/{id}:
 *   put:
 *     summary: Actualizar marca
 *     tags: [Marcas]
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
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Marca actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Marca no encontrada.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Marcas', 'Editar'), (0, validate_middleware_1.validate)(dto_marca_1.ActualizarMarcaSchema), marca_controller_1.marcaController.actualizar);
/**
 * @swagger
 * /marcas/{id}:
 *   delete:
 *     summary: Desactivar marca
 *     tags: [Marcas]
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
 *         description: Marca desactivada correctamente.
 *       400:
 *         description: La marca ya está desactivada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Marca no encontrada.
 */
router.delete('/:id', (0, authorize_middleware_1.authorize)('Marcas', 'Eliminar'), marca_controller_1.marcaController.eliminar);
/**
 * @swagger
 * /marcas/{id}/reactivar:
 *   patch:
 *     summary: Reactivar marca
 *     tags: [Marcas]
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
 *         description: Marca reactivada correctamente.
 *       400:
 *         description: La marca ya está activa.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Marca no encontrada.
 */
router.patch('/:id/reactivar', (0, authorize_middleware_1.authorize)('Marcas', 'Editar'), marca_controller_1.marcaController.reactivar);
exports.default = router;
