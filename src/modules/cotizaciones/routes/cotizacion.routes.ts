import { Router } from 'express';

import {
    cotizacionController
} from '../controllers/cotizacion.controller';

import {
    CrearCotizacionSchema,
    ActualizarCotizacionSchema,
    ConsultarCotizacionesSchema
} from '../dto/cotizacion.dto';

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
 *   name: Cotizaciones
 *   description: Gestión de cotizaciones de clientes
 */


/*=====================================================
======================= LISTAR ========================
=====================================================*/

/**
 * @swagger
 * /cotizaciones:
 *   get:
 *     summary: Obtener cotizaciones
 *     description: Obtiene las cotizaciones de la empresa autenticada con filtros y paginación.
 *     tags: [Cotizaciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: clienteId
 *         description: Filtrar por cliente.
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
 *             - RECHAZADA
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
 *         description: Cotizaciones obtenidas correctamente.
 *
 *       400:
 *         description: Parámetros inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para consultar cotizaciones.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
    '/',
    authorize('Cotizaciones', 'Ver'),
    cotizacionController.obtenerTodos
);


/*=====================================================
====================== OBTENER ========================
=====================================================*/

/**
 * @swagger
 * /cotizaciones/{id}:
 *   get:
 *     summary: Obtener cotización por ID
 *     description: Obtiene una cotización completa incluyendo cliente y detalles.
 *     tags: [Cotizaciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cotización.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Cotización obtenida correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Cotización no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.get(
    '/:id',
    authorize('Cotizaciones', 'Ver'),
    cotizacionController.obtenerPorId
);


/*=====================================================
======================= CREAR =========================
=====================================================*/

/**
 * @swagger
 * /cotizaciones:
 *   post:
 *     summary: Crear cotización
 *     description: Crea una cotización en estado BORRADOR. El número, empresa, subtotal, impuesto y total son controlados por el backend.
 *     tags: [Cotizaciones]
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
 *               - clienteId
 *               - detalles
 *
 *             properties:
 *
 *               clienteId:
 *                 type: string
 *                 description: ID del cliente.
 *                 example: cm123456789abcdefghijkl
 *
 *               observacion:
 *                 type: string
 *                 maxLength: 500
 *                 example: Cotización válida por 15 días.
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
 *                     - precio
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
 *                       example: 5
 *
 *                     precio:
 *                       type: number
 *                       format: double
 *                       minimum: 0
 *                       example: 25.50
 *
 *           examples:
 *
 *             cotizacion:
 *               summary: Cotización con productos
 *               value:
 *                 clienteId: cm123456789abcdefghijkl
 *                 observacion: Cotización válida por 15 días.
 *                 detalles:
 *                   - productoId: cm987654321abcdefghijkl
 *                     cantidad: 5
 *                     precio: 25.50
 *                   - productoId: cm555555555abcdefghijkl
 *                     cantidad: 2
 *                     precio: 40.00
 *
 *     responses:
 *
 *       201:
 *         description: Cotización creada correctamente.
 *
 *       400:
 *         description: Datos inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para crear cotizaciones.
 *
 *       404:
 *         description: Cliente o producto no encontrado.
 *
 *       500:
 *         description: Error interno.
 */
router.post(
    '/',
    authorize('Cotizaciones', 'Crear'),
    cotizacionController.crear
);


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

/**
 * @swagger
 * /cotizaciones/{id}:
 *   put:
 *     summary: Actualizar cotización
 *     description: Actualiza una cotización mientras se encuentre en estado BORRADOR.
 *     tags: [Cotizaciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cotización.
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
 *               clienteId:
 *                 type: string
 *
 *               observacion:
 *                 type: string
 *                 maxLength: 500
 *
 *               detalles:
 *                 type: array
 *
 *                 items:
 *                   type: object
 *
 *                   required:
 *                     - productoId
 *                     - cantidad
 *                     - precio
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
 *                     precio:
 *                       type: number
 *                       format: double
 *                       minimum: 0
 *
 *     responses:
 *
 *       200:
 *         description: Cotización actualizada correctamente.
 *
 *       400:
 *         description: La cotización no está en BORRADOR o los datos son inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos para editar.
 *
 *       404:
 *         description: Cotización, cliente o producto no encontrado.
 *
 *       500:
 *         description: Error interno.
 */
router.put(
    '/:id',
    authorize('Cotizaciones', 'Editar'),
    cotizacionController.actualizar
);


/*=====================================================
======================= APROBAR =======================
=====================================================*/

/**
 * @swagger
 * /cotizaciones/{id}/aprobar:
 *   patch:
 *     summary: Aprobar cotización
 *     description: Cambia una cotización de BORRADOR a APROBADA.
 *     tags: [Cotizaciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cotización.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Cotización aprobada correctamente.
 *
 *       400:
 *         description: La cotización no está en BORRADOR.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos para aprobar.
 *
 *       404:
 *         description: Cotización no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch(
    '/:id/aprobar',
    authorize('Cotizaciones', 'Aprobar'),
    cotizacionController.aprobar
);


/*=====================================================
====================== RECHAZAR =======================
=====================================================*/

/**
 * @swagger
 * /cotizaciones/{id}/rechazar:
 *   patch:
 *     summary: Rechazar cotización
 *     description: Cambia una cotización de BORRADOR a RECHAZADA.
 *     tags: [Cotizaciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cotización.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Cotización rechazada correctamente.
 *
 *       400:
 *         description: La cotización no está en BORRADOR.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos para rechazar.
 *
 *       404:
 *         description: Cotización no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch(
    '/:id/rechazar',
    authorize('Cotizaciones', 'Anular'),
    cotizacionController.rechazar
);


/*=====================================================
====================== CONVERTIR ======================
=====================================================*/

/**
 * @swagger
 * /cotizaciones/{id}/convertir:
 *   patch:
 *     summary: Convertir cotización
 *     description: Cambia una cotización APROBADA a CONVERTIDA. La conversión no genera inventario ni crea una venta automáticamente.
 *     tags: [Cotizaciones]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cotización.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Cotización convertida correctamente.
 *
 *       400:
 *         description: Solo se pueden convertir cotizaciones APROBADAS.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos para convertir.
 *
 *       404:
 *         description: Cotización no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch(
    '/:id/convertir',
    authorize('Cotizaciones', 'Editar'),
    cotizacionController.convertir
);


export default router;