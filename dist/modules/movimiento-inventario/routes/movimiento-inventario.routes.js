"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movimiento_inventario_controller_1 = require("../controllers/movimiento-inventario.controller");
const movimiento_inventario_dto_1 = require("../dto/movimiento-inventario.dto");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Movimientos de Inventario
 *   description: Historial de movimientos de inventario
 */
/**
 * @swagger
 * /movimientos-inventario:
 *   get:
 *     summary: Obtener movimientos de inventario
 *     tags: [Movimientos de Inventario]
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
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Inventario', 'Ver'), (0, validate_middleware_1.validate)(movimiento_inventario_dto_1.ConsultarMovimientoInventarioSchema), movimiento_inventario_controller_1.movimientoInventarioController.obtenerTodos);
/**
 * @swagger
 * /movimientos-inventario/{id}:
 *   get:
 *     summary: Obtener movimiento por ID
 *     tags: [Movimientos de Inventario]
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
 *         description: Movimiento obtenido correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Movimiento no encontrado.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Inventario', 'Ver'), movimiento_inventario_controller_1.movimientoInventarioController.obtenerPorId);
/**
 * @swagger
 * /movimientos-inventario:
 *   post:
 *     summary: Registrar movimiento de inventario
 *     description: Registra una entrada, salida o ajuste y actualiza automáticamente el stock. Las transferencias deben realizarse mediante el módulo de Transferencias.
 *     tags: [Movimientos de Inventario]
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
 *               - tipo
 *               - cantidad
 *             properties:
 *               productoId:
 *                 type: string
 *               bodegaId:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum:
 *                   - ENTRADA
 *                   - SALIDA
 *                   - AJUSTE
 *                   - TRANSFERENCIA
 *               cantidad:
 *                 type: integer
 *                 minimum: 1
 *               observacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movimiento registrado correctamente.
 *       400:
 *         description: Datos inválidos o stock insuficiente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Producto, bodega o inventario no encontrado.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Inventario', 'Editar'), (0, validate_middleware_1.validate)(movimiento_inventario_dto_1.CrearMovimientoInventarioSchema), movimiento_inventario_controller_1.movimientoInventarioController.crear);
exports.default = router;
