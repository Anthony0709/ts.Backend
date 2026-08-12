import { Router } from 'express';

import {
    movimientoInventarioController
} from '../controllers/movimiento-inventario.controller';

import {
    CrearMovimientoInventarioSchema,
    ConsultarMovimientoInventarioSchema
} from '../dto/movimiento-inventario.dto';

import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);

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
router.get(
    '/',
    authorize('Inventario', 'Ver'),
    validate(ConsultarMovimientoInventarioSchema),
    movimientoInventarioController.obtenerTodos
);

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
router.get(
    '/:id',
    authorize('Inventario', 'Ver'),
    movimientoInventarioController.obtenerPorId
);

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
router.post(
    '/',
    authorize('Inventario', 'Editar'),
    validate(CrearMovimientoInventarioSchema),
    movimientoInventarioController.crear
);

export default router;