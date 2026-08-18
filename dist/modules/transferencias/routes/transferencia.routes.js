"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transferencia_controller_1 = require("../controllers/transferencia.controller");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/*=====================================================
======================= SWAGGER =======================
=====================================================*/
/**
 * @swagger
 * tags:
 *   name: Transferencias
 *   description: Transferencias de inventario entre bodegas
 */
/*=====================================================
======================= LISTAR ========================
=====================================================*/
/**
 * @swagger
 * /transferencias:
 *   get:
 *     summary: Obtener transferencias
 *     tags: [Transferencias]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: productoId
 *         schema:
 *           type: string
 *         description: Filtrar por producto.
 *
 *       - in: query
 *         name: bodegaOrigenId
 *         schema:
 *           type: string
 *         description: Filtrar por bodega de origen.
 *
 *       - in: query
 *         name: bodegaDestinoId
 *         schema:
 *           type: string
 *         description: Filtrar por bodega de destino.
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *
 *     responses:
 *       200:
 *         description: Transferencias obtenidas correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Transferencias', 'Ver'), transferencia_controller_1.transferenciaController.obtenerTodos);
/*=====================================================
==================== OBTENER POR ID ===================
=====================================================*/
/**
 * @swagger
 * /transferencias/{id}:
 *   get:
 *     summary: Obtener transferencia por ID
 *     tags: [Transferencias]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Transferencia obtenida correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Transferencia no encontrada.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Transferencias', 'Ver'), transferencia_controller_1.transferenciaController.obtenerPorId);
/*=====================================================
======================= CREAR =========================
=====================================================*/
/**
 * @swagger
 * /transferencias:
 *   post:
 *     summary: Realizar transferencia de inventario
 *     description: Transfiere stock de una bodega origen a una bodega destino dentro de una única transacción.
 *     tags: [Transferencias]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - productoId
 *               - bodegaOrigenId
 *               - bodegaDestinoId
 *               - cantidad
 *
 *             properties:
 *
 *               productoId:
 *                 type: string
 *                 example: clxxxxxxxxxxxxxxxxxxxxxxxx
 *
 *               bodegaOrigenId:
 *                 type: string
 *                 example: clxxxxxxxxxxxxxxxxxxxxxxxx
 *
 *               bodegaDestinoId:
 *                 type: string
 *                 example: clxxxxxxxxxxxxxxxxxxxxxxxx
 *
 *               cantidad:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *
 *               observacion:
 *                 type: string
 *                 example: Transferencia para abastecimiento.
 *
 *     responses:
 *
 *       201:
 *         description: Transferencia realizada correctamente.
 *
 *       400:
 *         description: Stock insuficiente o datos inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Producto, bodega o inventario no encontrado.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Transferencias', 'Crear'), transferencia_controller_1.transferenciaController.crear);
exports.default = router;
