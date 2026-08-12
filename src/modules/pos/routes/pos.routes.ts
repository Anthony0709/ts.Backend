import { Router } from 'express';
import { posController } from '../controllers/pos.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
    ProcesarVentaPOSSchema,
    BuscarProductosPOSSchema,
    BuscarClientesPOSSchema,
    ConsultarCajaPOSSchema,
    ConsultarResumenCajaPOSSchema
} from '../dto/pos.dto';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: POS
 *   description: Punto de venta
 */

/**
 * @swagger
 * /pos/venta:
 *   post:
 *     summary: Procesar venta POS
 *     description: Registra una venta aprobada y genera su movimiento en la caja abierta.
 *     tags: [POS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cajaId
 *               - clienteId
 *               - detalles
 *               - pagos
 *             properties:
 *               cajaId:
 *                 type: string
 *                 example: cm123456789abcdefghijkl
 *               clienteId:
 *                 type: string
 *                 example: cm123456789abcdefghijkl
 *               detalles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productoId
 *                     - cantidad
 *                     - precio
 *                   properties:
 *                     productoId:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *                       minimum: 1
 *                     precio:
 *                       type: number
 *                       format: double
 *               pagos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - metodoPago
 *                     - monto
 *                   properties:
 *                     metodoPago:
 *                       type: string
 *                       enum:
 *                         - EFECTIVO
 *                         - TARJETA
 *                         - TRANSFERENCIA
 *                         - CHEQUE
 *                         - CREDITO
 *                         - OTRO
 *                     monto:
 *                       type: number
 *                       format: double
 *                     referencia:
 *                       type: string
 *               descuento:
 *                 type: number
 *                 format: double
 *                 default: 0
 *               observacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Venta procesada correctamente.
 *       400:
 *         description: Datos inválidos o caja cerrada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Caja, cliente o producto no encontrado.
 */
router.post(
    '/venta',
    authorize('POS', 'Crear'),
    validate(ProcesarVentaPOSSchema),
    posController.procesarVenta
);

/**
 * @swagger
 * /pos/productos:
 *   get:
 *     summary: Buscar productos para POS
 *     tags: [POS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Código, SKU, código de barras o nombre.
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente.
 */
router.get(
    '/productos',
    authorize('POS', 'Ver'),
    validate(BuscarProductosPOSSchema),
    posController.buscarProductos
);

/**
 * @swagger
 * /pos/clientes:
 *   get:
 *     summary: Buscar clientes para POS
 *     tags: [POS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Clientes obtenidos correctamente.
 */
router.get(
    '/clientes',
    authorize('POS', 'Ver'),
    validate(BuscarClientesPOSSchema),
    posController.buscarClientes
);

/**
 * @swagger
 * /pos/caja:
 *   post:
 *     summary: Consultar caja del POS
 *     tags: [POS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cajaId
 *             properties:
 *               cajaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Caja obtenida correctamente.
 */
router.post(
    '/caja',
    authorize('POS', 'Ver'),
    validate(ConsultarCajaPOSSchema),
    posController.consultarCaja
);

/**
 * @swagger
 * /pos/caja/resumen:
 *   post:
 *     summary: Obtener resumen de caja del POS
 *     tags: [POS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cajaId
 *             properties:
 *               cajaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resumen de caja obtenido correctamente.
 */
router.post(
    '/caja/resumen',
    authorize('POS', 'Ver'),
    validate(ConsultarResumenCajaPOSSchema),
    posController.resumenCaja
);

export default router;