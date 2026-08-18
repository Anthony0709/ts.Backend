"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventario_controller_1 = require("../controllers/inventario.controller");
const inventario_dto_1 = require("../dto/inventario.dto");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Gestión de existencias y movimientos de inventario
 */
/**
 * @swagger
 * /inventario:
 *   get:
 *     summary: Obtener inventario
 *     tags: [Inventario]
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
 *         name: productoId
 *         schema:
 *           type: string
 *       - in: query
 *         name: bodegaId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventario obtenido correctamente.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Inventario', 'Ver'), inventario_controller_1.inventarioController.obtenerTodos);
/**
 * @swagger
 * /inventario/movimientos:
 *   get:
 *     summary: Obtener movimientos de inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: productoId
 *         schema:
 *           type: string
 *       - in: query
 *         name: bodegaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum:
 *             - ENTRADA
 *             - SALIDA
 *             - AJUSTE
 *             - TRANSFERENCIA
 *     responses:
 *       200:
 *         description: Movimientos obtenidos correctamente.
 */
router.get('/movimientos', (0, authorize_middleware_1.authorize)('Inventario', 'Ver'), inventario_controller_1.inventarioController.obtenerMovimientos);
/**
 * @swagger
 * /inventario/{id}:
 *   get:
 *     summary: Obtener inventario por ID
 *     tags: [Inventario]
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
 *         description: Inventario obtenido correctamente.
 *       404:
 *         description: Registro de inventario no encontrado.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Inventario', 'Ver'), inventario_controller_1.inventarioController.obtenerPorId);
/**
 * @swagger
 * /inventario:
 *   post:
 *     summary: Crear registro de inventario
 *     description: Asigna un producto a una bodega y crea su existencia inicial.
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productoId
 *               - bodegaId
 *               - empresaId
 *             properties:
 *               productoId:
 *                 type: string
 *               bodegaId:
 *                 type: string
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *               empresaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inventario creado correctamente.
 *       400:
 *         description: El producto ya tiene inventario en esa bodega.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Inventario', 'Crear'), (0, validate_middleware_1.validate)(inventario_dto_1.CrearInventarioSchema), inventario_controller_1.inventarioController.crear);
/**
 * @swagger
 * /inventario/ajustar:
 *   post:
 *     summary: Realizar movimiento de inventario
 *     description: Permite realizar entradas, salidas y ajustes de stock. Las transferencias se realizan desde el módulo de Transferencias.
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productoId
 *               - bodegaId
 *               - cantidad
 *               - tipo
 *               - empresaId
 *             properties:
 *               productoId:
 *                 type: string
 *               bodegaId:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *                 minimum: 1
 *               tipo:
 *                 type: string
 *                 enum:
 *                   - ENTRADA
 *                   - SALIDA
 *                   - AJUSTE
 *               observacion:
 *                 type: string
 *               empresaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movimiento realizado correctamente.
 *       400:
 *         description: Stock insuficiente o datos inválidos.
 */
router.post('/ajustar', (0, authorize_middleware_1.authorize)('Inventario', 'Editar'), (0, validate_middleware_1.validate)(inventario_dto_1.AjustarInventarioSchema), inventario_controller_1.inventarioController.ajustar);
/**
 * @swagger
 * /inventario/{id}:
 *   put:
 *     summary: Actualizar stock manualmente
 *     tags: [Inventario]
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
 *               - stock
 *             properties:
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Stock actualizado correctamente.
 *       404:
 *         description: Inventario no encontrado.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Inventario', 'Editar'), (0, validate_middleware_1.validate)(inventario_dto_1.ActualizarInventarioSchema), inventario_controller_1.inventarioController.actualizar);
exports.default = router;
