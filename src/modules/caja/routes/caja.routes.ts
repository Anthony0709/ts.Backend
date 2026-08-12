import { Router } from 'express';

import {
    cajaController
} from '../controllers/caja.controller';

import {
    CrearCajaSchema,
    ActualizarCajaSchema,
    AbrirCajaSchema,
    CerrarCajaSchema,
    ConsultarCajasSchema
} from '../dto/caja.dto';

import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';


const router =
    Router();


router.use(
    authenticate
);


/*=====================================================
======================= SWAGGER =======================
=====================================================*/

/**
 * @swagger
 * tags:
 *   name: Cajas
 *   description: Gestión de cajas y operaciones de caja
 */


/*=====================================================
======================= LISTAR ========================
=====================================================*/

/**
 * @swagger
 * /cajas:
 *   get:
 *     summary: Obtener cajas
 *     description: Obtiene las cajas de la empresa autenticada.
 *     tags: [Cajas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: sucursalId
 *         description: Filtrar cajas por sucursal.
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: estado
 *         description: Filtrar por estado.
 *         schema:
 *           type: string
 *           enum:
 *             - ABIERTA
 *             - CERRADA
 *
 *       - in: query
 *         name: nombre
 *         description: Buscar por nombre.
 *         schema:
 *           type: string
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
 *
 *       200:
 *         description: Cajas obtenidas correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       500:
 *         description: Error interno.
 */
router.get(
    '/',
    authorize(
        'Cajas',
        'Ver'
    ),
    validate(
        ConsultarCajasSchema
    ),
    cajaController.obtenerTodos
);


/*=====================================================
====================== OBTENER ========================
=====================================================*/

/**
 * @swagger
 * /cajas/{id}:
 *   get:
 *     summary: Obtener caja por ID
 *     tags: [Cajas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Caja obtenida correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Caja no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.get(
    '/:id',
    authorize(
        'Cajas',
        'Ver'
    ),
    cajaController.obtenerPorId
);


/*=====================================================
======================= CREAR =========================
=====================================================*/

/**
 * @swagger
 * /cajas:
 *   post:
 *     summary: Crear caja
 *     description: Crea una caja cerrada asociada a una sucursal.
 *     tags: [Cajas]
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
 *               - nombre
 *               - sucursalId
 *               - saldoInicial
 *
 *             properties:
 *
 *               nombre:
 *                 type: string
 *                 example: Caja 01
 *
 *               sucursalId:
 *                 type: string
 *                 example: cm123456789abcdefghijkl
 *
 *               saldoInicial:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *                 example: 100
 *
 *               observacion:
 *                 type: string
 *                 example: Caja principal de la sucursal.
 *
 *     responses:
 *
 *       201:
 *         description: Caja creada correctamente.
 *
 *       400:
 *         description: Caja duplicada o datos inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Sucursal no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.post(
    '/',
    authorize(
        'Cajas',
        'Crear'
    ),
    validate(
        CrearCajaSchema
    ),
    cajaController.crear
);


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

/**
 * @swagger
 * /cajas/{id}:
 *   put:
 *     summary: Actualizar caja
 *     description: Actualiza una caja cerrada.
 *     tags: [Cajas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
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
 *               nombre:
 *                 type: string
 *                 example: Caja Principal
 *
 *               sucursalId:
 *                 type: string
 *
 *               observacion:
 *                 type: string
 *
 *     responses:
 *
 *       200:
 *         description: Caja actualizada correctamente.
 *
 *       400:
 *         description: La caja está abierta o los datos son inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Caja o sucursal no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.put(
    '/:id',
    authorize(
        'Cajas',
        'Editar'
    ),
    validate(
        ActualizarCajaSchema
    ),
    cajaController.actualizar
);


/*=====================================================
======================== ABRIR ========================
=====================================================*/

/**
 * @swagger
 * /cajas/{id}/abrir:
 *   patch:
 *     summary: Abrir caja
 *     description: Abre una caja y registra el usuario y fecha de apertura.
 *     tags: [Cajas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
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
 *             required:
 *               - saldoInicial
 *
 *             properties:
 *
 *               saldoInicial:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *                 example: 100
 *
 *               observacion:
 *                 type: string
 *                 example: Apertura de caja del turno de la mañana.
 *
 *     responses:
 *
 *       200:
 *         description: Caja abierta correctamente.
 *
 *       400:
 *         description: La caja ya está abierta.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Caja no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch(
    '/:id/abrir',
    authorize(
        'Cajas',
        'Abrir'
    ),
    validate(
        AbrirCajaSchema
    ),
    cajaController.abrir
);


/*=====================================================
======================== CERRAR =======================
=====================================================*/

/**
 * @swagger
 * /cajas/{id}/cerrar:
 *   patch:
 *     summary: Cerrar caja
 *     description: Cierra la caja, calcula el saldo esperado y registra la diferencia contra el dinero contado.
 *     tags: [Cajas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
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
 *             required:
 *               - saldoContado
 *
 *             properties:
 *
 *               saldoContado:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *                 example: 350.50
 *
 *               observacion:
 *                 type: string
 *                 example: Cierre normal del turno.
 *
 *     responses:
 *
 *       200:
 *         description: Caja cerrada correctamente.
 *
 *       400:
 *         description: La caja ya está cerrada o los datos son inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Caja no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch(
    '/:id/cerrar',
    authorize(
        'Cajas',
        'Cerrar'
    ),
    validate(
        CerrarCajaSchema
    ),
    cajaController.cerrar
);


/*=====================================================
===================== MOVIMIENTOS =====================
=====================================================*/

/**
 * @swagger
 * /cajas/{id}/movimientos:
 *   get:
 *     summary: Obtener movimientos de caja
 *     description: Obtiene los movimientos registrados en una caja.
 *     tags: [Cajas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date-time
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
 *
 *       200:
 *         description: Movimientos obtenidos correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Caja no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.get(
    '/:id/movimientos',
    authorize(
        'Cajas',
        'Ver'
    ),
    cajaController.obtenerMovimientos
);


/*=====================================================
======================= RESUMEN =======================
=====================================================*/

/**
 * @swagger
 * /cajas/{id}/resumen:
 *   get:
 *     summary: Obtener resumen de caja
 *     description: Obtiene saldos y resumen de movimientos de una caja.
 *     tags: [Cajas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Resumen obtenido correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Caja no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.get(
    '/:id/resumen',
    authorize(
        'Cajas',
        'Ver'
    ),
    cajaController.obtenerResumen
);


export default router;