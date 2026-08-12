import { Router } from 'express';

import {
    transferenciaController
} from '../controllers/transferencia.controller';

import {
    CrearTransferenciaSchema,
    ConsultarTransferenciasSchema
} from '../dto/transferencia.dto';

import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);

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
router.get(
    '/',
    authorize('Transferencias', 'Ver'),
    transferenciaController.obtenerTodos
);


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
router.get(
    '/:id',
    authorize('Transferencias', 'Ver'),
    transferenciaController.obtenerPorId
);


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
router.post(
    '/',
    authorize('Transferencias', 'Crear'),
    transferenciaController.crear
);


export default router;