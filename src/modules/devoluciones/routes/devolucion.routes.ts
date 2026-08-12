import { Router } from 'express';

import {
    devolucionController
} from '../controllers/devolucion.controller';

import {
    CrearDevolucionSchema,
    ActualizarDevolucionSchema,
    ConsultarDevolucionesSchema
} from '../dto/devolucion.dto';

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
 *   name: Devoluciones
 *   description: Gestión de devoluciones de compras y ventas
 */


/*=====================================================
======================= LISTAR ========================
=====================================================*/

/**
 * @swagger
 * /devoluciones:
 *   get:
 *     summary: Obtener devoluciones
 *     description: Obtiene las devoluciones de la empresa autenticada con filtros y paginación.
 *     tags: [Devoluciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: tipo
 *         description: Tipo de devolución.
 *         schema:
 *           type: string
 *           enum:
 *             - COMPRA
 *             - VENTA
 *
 *       - in: query
 *         name: estado
 *         description: Estado actual de la devolución.
 *         schema:
 *           type: string
 *           enum:
 *             - BORRADOR
 *             - APROBADA
 *             - ANULADA
 *
 *       - in: query
 *         name: ventaId
 *         description: Filtrar por venta.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *       - in: query
 *         name: compraId
 *         description: Filtrar por compra.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *       - in: query
 *         name: bodegaId
 *         description: Filtrar por bodega.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *       - in: query
 *         name: page
 *         description: Número de página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         description: Cantidad de registros por página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           example: 10
 *
 *     responses:
 *
 *       200:
 *         description: Devoluciones obtenidas correctamente.
 *
 *       400:
 *         description: Parámetros de consulta inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para consultar devoluciones.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
    '/',
    authorize('Devoluciones', 'Ver'),
    validate(ConsultarDevolucionesSchema),
    devolucionController.obtenerTodos
);


/*=====================================================
====================== OBTENER POR ID =================
=====================================================*/

/**
 * @swagger
 * /devoluciones/{id}:
 *   get:
 *     summary: Obtener devolución por ID
 *     description: Obtiene el detalle completo de una devolución perteneciente a la empresa autenticada.
 *     tags: [Devoluciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la devolución.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Devolución obtenida correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para consultar devoluciones.
 *
 *       404:
 *         description: Devolución no encontrada.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
    '/:id',
    authorize('Devoluciones', 'Ver'),
    devolucionController.obtenerPorId
);


/*=====================================================
======================= CREAR =========================
=====================================================*/

/**
 * @swagger
 * /devoluciones:
 *   post:
 *     summary: Crear devolución
 *     description: Crea una devolución en estado BORRADOR. El número de devolución es generado automáticamente por el backend y el inventario no se modifica hasta la aprobación.
 *     tags: [Devoluciones]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - bodegaId
 *               - detalles
 *
 *             properties:
 *
 *               tipo:
 *                 type: string
 *                 description: Tipo de devolución.
 *                 enum:
 *                   - COMPRA
 *                   - VENTA
 *                 example: VENTA
 *
 *               ventaId:
 *                 type: string
 *                 description: Obligatorio cuando el tipo es VENTA.
 *                 example: cm123456789abcdefghijkl
 *
 *               compraId:
 *                 type: string
 *                 description: Obligatorio cuando el tipo es COMPRA.
 *                 example: cm123456789abcdefghijkl
 *
 *               bodegaId:
 *                 type: string
 *                 description: Bodega donde se aplicará la devolución.
 *                 example: cm123456789abcdefghijkl
 *
 *               observacion:
 *                 type: string
 *                 maxLength: 500
 *                 example: Cliente devuelve productos por defecto de fabricación.
 *
 *               detalles:
 *                 type: array
 *                 minItems: 1
 *                 description: Productos incluidos en la devolución.
 *                 items:
 *                   type: object
 *                   required:
 *                     - productoId
 *                     - cantidad
 *                   properties:
 *                     productoId:
 *                       type: string
 *                       example: cm123456789abcdefghijkl
 *                     cantidad:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *
 *           examples:
 *             devolucionVenta:
 *               summary: Devolución de una venta
 *               value:
 *                 tipo: VENTA
 *                 ventaId: cm123456789abcdefghijkl
 *                 bodegaId: cm987654321abcdefghijkl
 *                 observacion: Producto devuelto por el cliente.
 *                 detalles:
 *                   - productoId: cm111111111abcdefghijkl
 *                     cantidad: 2
 *
 *             devolucionCompra:
 *               summary: Devolución de una compra
 *               value:
 *                 tipo: COMPRA
 *                 compraId: cm222222222abcdefghijkl
 *                 bodegaId: cm987654321abcdefghijkl
 *                 observacion: Producto defectuoso devuelto al proveedor.
 *                 detalles:
 *                   - productoId: cm111111111abcdefghijkl
 *                     cantidad: 5
 *
 *     responses:
 *
 *       201:
 *         description: Devolución creada correctamente.
 *
 *       400:
 *         description: Datos inválidos, venta/compra incorrecta o productos inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para crear devoluciones.
 *
 *       404:
 *         description: Venta, compra, bodega o producto no encontrado.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
    '/',
    authorize('Devoluciones', 'Crear'),
    validate(CrearDevolucionSchema),
    devolucionController.crear
);


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

/**
 * @swagger
 * /devoluciones/{id}:
 *   put:
 *     summary: Actualizar devolución
 *     description: Actualiza una devolución mientras permanezca en estado BORRADOR.
 *     tags: [Devoluciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la devolución.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observacion:
 *                 type: string
 *                 maxLength: 500
 *                 example: Se actualizó la observación.
 *
 *     responses:
 *
 *       200:
 *         description: Devolución actualizada correctamente.
 *
 *       400:
 *         description: La devolución no está en estado BORRADOR o los datos son inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para editar devoluciones.
 *
 *       404:
 *         description: Devolución no encontrada.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.put(
    '/:id',
    authorize('Devoluciones', 'Editar'),
    validate(ActualizarDevolucionSchema),
    devolucionController.actualizar
);


/*=====================================================
======================= APROBAR =======================
=====================================================*/

/**
 * @swagger
 * /devoluciones/{id}/aprobar:
 *   patch:
 *     summary: Aprobar devolución
 *     description: Aprueba una devolución en estado BORRADOR y aplica el movimiento correspondiente al inventario.
 *     tags: [Devoluciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la devolución.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Devolución aprobada correctamente.
 *
 *       400:
 *         description: La devolución no puede aprobarse o existe stock insuficiente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para aprobar devoluciones.
 *
 *       404:
 *         description: Devolución o inventario no encontrado.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.patch(
    '/:id/aprobar',
    authorize('Devoluciones', 'Aprobar'),
    devolucionController.aprobar
);


/*=====================================================
======================== ANULAR =======================
=====================================================*/

/**
 * @swagger
 * /devoluciones/{id}/anular:
 *   patch:
 *     summary: Anular devolución
 *     description: Anula una devolución que todavía se encuentra en estado BORRADOR. Una devolución aprobada no puede anularse mediante esta operación.
 *     tags: [Devoluciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la devolución.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Devolución anulada correctamente.
 *
 *       400:
 *         description: La devolución ya está anulada o ya fue aprobada.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para anular devoluciones.
 *
 *       404:
 *         description: Devolución no encontrada.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.patch(
    '/:id/anular',
    authorize('Devoluciones', 'Anular'),
    devolucionController.anular
);


export default router;