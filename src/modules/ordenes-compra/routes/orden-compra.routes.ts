import { Router } from 'express';

import {
    ordenCompraController
} from '../controllers/orden-compra.controller';

import {
    CrearOrdenCompraSchema,
    ActualizarOrdenCompraSchema,
    ConsultarOrdenesCompraSchema
} from '../dto/orden-compra.dto';

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
 *   name: Ordenes de Compra
 *   description: Gestión de órdenes de compra
 */


/*=====================================================
======================= LISTAR ========================
=====================================================*/

/**
 * @swagger
 * /ordenes-compra:
 *   get:
 *     summary: Obtener órdenes de compra
 *     description: Obtiene las órdenes de compra de la empresa autenticada con filtros y paginación.
 *     tags: [Ordenes de Compra]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: proveedorId
 *         description: Filtrar por proveedor.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *       - in: query
 *         name: estado
 *         description: Filtrar por estado.
 *         schema:
 *           type: string
 *           enum:
 *             - BORRADOR
 *             - APROBADA
 *             - CANCELADA
 *             - CONVERTIDA
 *
 *       - in: query
 *         name: fechaDesde
 *         description: Fecha inicial.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: fechaHasta
 *         description: Fecha final.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: page
 *         description: Número de página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *         description: Registros por página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *
 *     responses:
 *
 *       200:
 *         description: Órdenes obtenidas correctamente.
 *
 *       400:
 *         description: Parámetros inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para consultar órdenes de compra.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
    '/',
    authorize('OrdenesCompra', 'Ver'),
    ordenCompraController.obtenerTodos
);


/*=====================================================
====================== OBTENER ========================
=====================================================*/

/**
 * @swagger
 * /ordenes-compra/{id}:
 *   get:
 *     summary: Obtener orden de compra por ID
 *     description: Obtiene una orden de compra completa incluyendo proveedor y detalles.
 *     tags: [Ordenes de Compra]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Orden obtenida correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Orden no encontrada.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
    '/:id',
    authorize('OrdenesCompra', 'Ver'),
    ordenCompraController.obtenerPorId
);


/*=====================================================
======================= CREAR =========================
=====================================================*/

/**
 * @swagger
 * /ordenes-compra:
 *   post:
 *     summary: Crear orden de compra
 *     description: Crea una nueva orden en estado BORRADOR. El número, subtotal, impuesto y total son generados/calculados por el backend.
 *     tags: [Ordenes de Compra]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             type: object
 *
 *             required:
 *               - proveedorId
 *               - detalles
 *
 *             properties:
 *
 *               proveedorId:
 *                 type: string
 *                 description: ID del proveedor.
 *                 example: cm123456789abcdefghijkl
 *
 *               observacion:
 *                 type: string
 *                 maxLength: 500
 *                 example: Compra mensual de inventario.
 *
 *               detalles:
 *                 type: array
 *                 minItems: 1
 *
 *                 items:
 *                   type: object
 *
 *                   required:
 *                     - productoId
 *                     - cantidad
 *                     - costo
 *
 *                   properties:
 *
 *                     productoId:
 *                       type: string
 *                       example: cm987654321abcdefghijkl
 *
 *                     cantidad:
 *                       type: integer
 *                       minimum: 1
 *                       example: 10
 *
 *                     costo:
 *                       type: number
 *                       format: double
 *                       minimum: 0
 *                       example: 25.50
 *
 *           examples:
 *
 *             ordenCompra:
 *               summary: Orden de compra
 *               value:
 *                 proveedorId: cm123456789abcdefghijkl
 *                 observacion: Compra de inventario.
 *                 detalles:
 *                   - productoId: cm987654321abcdefghijkl
 *                     cantidad: 10
 *                     costo: 25.50
 *                   - productoId: cm555555555abcdefghijkl
 *                     cantidad: 5
 *                     costo: 40.00
 *
 *     responses:
 *
 *       201:
 *         description: Orden creada correctamente.
 *
 *       400:
 *         description: Datos inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para crear órdenes.
 *
 *       404:
 *         description: Proveedor o producto no encontrado.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
    '/',
    authorize('OrdenesCompra', 'Crear'),
    ordenCompraController.crear
);


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

/**
 * @swagger
 * /ordenes-compra/{id}:
 *   put:
 *     summary: Actualizar orden de compra
 *     description: Actualiza una orden mientras se encuentre en estado BORRADOR.
 *     tags: [Ordenes de Compra]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden.
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             type: object
 *
 *             properties:
 *
 *               proveedorId:
 *                 type: string
 *                 example: cm123456789abcdefghijkl
 *
 *               observacion:
 *                 type: string
 *                 maxLength: 500
 *
 *               detalles:
 *                 type: array
 *                 minItems: 1
 *
 *                 items:
 *                   type: object
 *
 *                   required:
 *                     - productoId
 *                     - cantidad
 *                     - costo
 *
 *                   properties:
 *
 *                     productoId:
 *                       type: string
 *
 *                     cantidad:
 *                       type: integer
 *                       minimum: 1
 *
 *                     costo:
 *                       type: number
 *                       format: double
 *
 *     responses:
 *
 *       200:
 *         description: Orden actualizada correctamente.
 *
 *       400:
 *         description: La orden no está en BORRADOR o los datos son inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Orden, proveedor o producto no encontrado.
 *
 *       500:
 *         description: Error interno.
 */
router.put(
    '/:id',
    authorize('OrdenesCompra', 'Editar'),
    ordenCompraController.actualizar
);


/*=====================================================
======================= APROBAR =======================
=====================================================*/

/**
 * @swagger
 * /ordenes-compra/{id}/aprobar:
 *   patch:
 *     summary: Aprobar orden de compra
 *     description: Cambia una orden de BORRADOR a APROBADA. La aprobación no aumenta inventario; la recepción de mercancía corresponde al proceso de compras.
 *     tags: [Ordenes de Compra]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Orden aprobada correctamente.
 *
 *       400:
 *         description: La orden no está en BORRADOR.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos para aprobar órdenes.
 *
 *       404:
 *         description: Orden no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch(
    '/:id/aprobar',
    authorize('OrdenesCompra', 'Aprobar'),
    ordenCompraController.aprobar
);


/*=====================================================
====================== CANCELAR =======================
=====================================================*/

/**
 * @swagger
 * /ordenes-compra/{id}/cancelar:
 *   patch:
 *     summary: Cancelar orden de compra
 *     description: Cancela una orden de compra que todavía no ha sido convertida.
 *     tags: [Ordenes de Compra]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Orden cancelada correctamente.
 *
 *       400:
 *         description: La orden ya está cancelada o fue convertida.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos para cancelar órdenes.
 *
 *       404:
 *         description: Orden no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch(
    '/:id/cancelar',
    authorize('OrdenesCompra', 'Anular'),
    ordenCompraController.cancelar
);


export default router;