import { Router } from 'express';

import { kardexController } from '../controllers/kardex.controller';

import { ConsultarKardexSchema } from '../dto/kardex.dto';

import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Kardex
 *   description: Historial de movimientos y evolución del inventario
 */

/**
 * @swagger
 * /kardex:
 *   get:
 *     summary: Obtener Kardex
 *     tags: [Kardex]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productoId
 *         schema:
 *           type: string
 *         description: Filtrar por producto.
 *       - in: query
 *         name: bodegaId
 *         schema:
 *           type: string
 *         description: Filtrar por bodega.
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum:
 *             - ENTRADA
 *             - SALIDA
 *             - AJUSTE
 *             - TRANSFERENCIA
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date-time
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
 *     responses:
 *       200:
 *         description: Kardex obtenido correctamente.
 *       400:
 *         description: Parámetros inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get(
    '/',
    authorize('Kardex', 'Ver'),
    kardexController.obtener
);

/**
 * @swagger
 * /kardex/producto/{productoId}:
 *   get:
 *     summary: Obtener Kardex por producto
 *     tags: [Kardex]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productoId
 *         required: true
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
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date-time
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
 *     responses:
 *       200:
 *         description: Kardex del producto obtenido correctamente.
 *       404:
 *         description: Producto no encontrado.
 */
router.get(
    '/producto/:productoId',
    authorize('Kardex', 'Ver'),
    kardexController.obtenerPorProducto
);

/**
 * @swagger
 * /kardex/bodega/{bodegaId}:
 *   get:
 *     summary: Obtener Kardex por bodega
 *     tags: [Kardex]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bodegaId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: productoId
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
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date-time
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
 *     responses:
 *       200:
 *         description: Kardex de la bodega obtenido correctamente.
 *       404:
 *         description: Bodega no encontrada.
 */
router.get(
    '/bodega/:bodegaId',
    authorize('Kardex', 'Ver'),
    kardexController.obtenerPorBodega
);

export default router;