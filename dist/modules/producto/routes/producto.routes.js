"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_controller_1 = require("../controllers/producto.controller");
const producto_dto_1 = require("../dto/producto.dto");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos
 */
/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener productos
 *     tags: [Productos]
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
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: marcaId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Productos', 'Ver'), producto_controller_1.productoController.obtenerTodos);
/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Productos]
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
 *         description: Producto obtenido correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Producto no encontrado.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Productos', 'Ver'), producto_controller_1.productoController.obtenerPorId);
/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear producto
 *     description: El código, SKU y código de barras se generan automáticamente en el backend.
 *     tags: [Productos]
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
 *               - precioCompra
 *               - precioVenta
 *               - categoriaId
 *               - marcaId
 *               - empresaId
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Laptop Lenovo ThinkPad
 *               descripcion:
 *                 type: string
 *                 example: Laptop empresarial
 *               imagen:
 *                 type: string
 *                 format: uri
 *               precioCompra:
 *                 type: number
 *                 format: double
 *                 example: 650.00
 *               precioVenta:
 *                 type: number
 *                 format: double
 *                 example: 850.00
 *               stockMinimo:
 *                 type: integer
 *                 example: 5
 *               stockMaximo:
 *                 type: integer
 *                 example: 50
 *               estado:
 *                 type: boolean
 *                 example: true
 *               categoriaId:
 *                 type: string
 *               marcaId:
 *                 type: string
 *               empresaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Productos', 'Crear'), (0, validate_middleware_1.validate)(producto_dto_1.CrearProductoSchema), producto_controller_1.productoController.crear);
/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Productos]
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
 *               imagen:
 *                 type: string
 *                 format: uri
 *               precioCompra:
 *                 type: number
 *               precioVenta:
 *                 type: number
 *               stockMinimo:
 *                 type: integer
 *               stockMaximo:
 *                 type: integer
 *               estado:
 *                 type: boolean
 *               categoriaId:
 *                 type: string
 *               marcaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Producto no encontrado.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Productos', 'Editar'), (0, validate_middleware_1.validate)(producto_dto_1.ActualizarProductoSchema), producto_controller_1.productoController.actualizar);
/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Desactivar producto
 *     tags: [Productos]
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
 *         description: Producto desactivado correctamente.
 *       400:
 *         description: El producto ya está desactivado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Producto no encontrado.
 */
router.delete('/:id', (0, authorize_middleware_1.authorize)('Productos', 'Eliminar'), producto_controller_1.productoController.eliminar);
/**
 * @swagger
 * /productos/{id}/reactivar:
 *   patch:
 *     summary: Reactivar producto
 *     tags: [Productos]
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
 *         description: Producto reactivado correctamente.
 *       400:
 *         description: El producto ya está activo.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Producto no encontrado.
 */
router.patch('/:id/reactivar', (0, authorize_middleware_1.authorize)('Productos', 'Editar'), producto_controller_1.productoController.reactivar);
exports.default = router;
