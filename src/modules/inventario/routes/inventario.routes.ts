import { Router } from 'express';

import { inventarioController } from '../controllers/inventario.controller';

import {
    CrearInventarioSchema,
    AjustarInventarioSchema,
    ActualizarInventarioSchema
} from '../dto/inventario.dto';

import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);

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
router.get(
    '/',
    authorize('Inventario', 'Ver'),
    inventarioController.obtenerTodos
);

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
router.get(
    '/movimientos',
    authorize('Inventario', 'Ver'),
    inventarioController.obtenerMovimientos
);

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
router.get(
    '/:id',
    authorize('Inventario', 'Ver'),
    inventarioController.obtenerPorId
);

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
router.post(
    '/',
    authorize('Inventario', 'Crear'),
    validate(CrearInventarioSchema),
    inventarioController.crear
);

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
router.post(
    '/ajustar',
    authorize('Inventario', 'Editar'),
    validate(AjustarInventarioSchema),
    inventarioController.ajustar
);

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
router.put(
    '/:id',
    authorize('Inventario', 'Editar'),
    validate(ActualizarInventarioSchema),
    inventarioController.actualizar
);

export default router;