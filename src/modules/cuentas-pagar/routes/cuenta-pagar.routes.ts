import { Router } from 'express';

import {
    cuentaPagarController
} from '../controllers/cuenta-pagar.controller';

import {
    CrearCuentaPagarSchema,
    ActualizarCuentaPagarSchema,
    ConsultarCuentasPagarSchema,
    RegistrarPagoCuentaPagarSchema,
    ConsultarPagosCuentaPagarSchema
} from '../dto/cuenta-pagar.dto';

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
 *   name: Cuentas por Pagar
 *   description: Gestión de obligaciones y pagos a proveedores
 */


/*=====================================================
======================= LISTAR ========================
=====================================================*/

/**
 * @swagger
 * /cuentas-pagar:
 *   get:
 *     summary: Obtener cuentas por pagar
 *     description: Obtiene las cuentas por pagar de la empresa autenticada con filtros y paginación.
 *     tags: [Cuentas por Pagar]
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
 *         name: compraId
 *         description: Filtrar por compra.
 *         schema:
 *           type: string
 *           example: cm987654321abcdefghijkl
 *
 *       - in: query
 *         name: estado
 *         description: Estado de la cuenta.
 *         schema:
 *           type: string
 *           enum:
 *             - PENDIENTE
 *             - PARCIAL
 *             - PAGADA
 *             - VENCIDA
 *
 *       - in: query
 *         name: fechaDesde
 *         description: Fecha inicial de creación.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: fechaHasta
 *         description: Fecha final de creación.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: vencimientoDesde
 *         description: Fecha inicial de vencimiento.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: vencimientoHasta
 *         description: Fecha final de vencimiento.
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
 *         description: Cuentas por pagar obtenidas correctamente.
 *
 *       400:
 *         description: Parámetros inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para consultar cuentas por pagar.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
    '/',
    authorize('CuentasPagar', 'Ver'),
    cuentaPagarController.obtenerTodos
);


/*=====================================================
====================== OBTENER ========================
=====================================================*/

/**
 * @swagger
 * /cuentas-pagar/{id}:
 *   get:
 *     summary: Obtener cuenta por pagar
 *     description: Obtiene una cuenta por pagar con proveedor, compra y todos sus pagos.
 *     tags: [Cuentas por Pagar]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cuenta por pagar.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Cuenta obtenida correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos.
 *
 *       404:
 *         description: Cuenta por pagar no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.get(
    '/:id',
    authorize('CuentasPagar', 'Ver'),
    cuentaPagarController.obtenerPorId
);


/*=====================================================
======================= CREAR =========================
=====================================================*/

/**
 * @swagger
 * /cuentas-pagar:
 *   post:
 *     summary: Crear cuenta por pagar
 *     description: Crea una cuenta por pagar a partir de una compra APROBADA. El proveedor, total, saldo y número son obtenidos/generados por el backend.
 *     tags: [Cuentas por Pagar]
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
 *               - compraId
 *
 *             properties:
 *
 *               compraId:
 *                 type: string
 *                 description: Compra aprobada que origina la obligación.
 *                 example: cm123456789abcdefghijkl
 *
 *               fechaVencimiento:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de vencimiento. Si no se envía, se calcula usando los días de crédito del proveedor.
 *
 *               observacion:
 *                 type: string
 *                 maxLength: 500
 *                 example: Crédito acordado con el proveedor.
 *
 *           examples:
 *
 *             cuenta:
 *               summary: Crear cuenta por pagar
 *               value:
 *                 compraId: cm123456789abcdefghijkl
 *                 fechaVencimiento: "2026-09-30T00:00:00.000Z"
 *                 observacion: Pago a 30 días.
 *
 *     responses:
 *
 *       201:
 *         description: Cuenta por pagar creada correctamente.
 *
 *       400:
 *         description: La compra no está aprobada o ya tiene una cuenta.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para crear cuentas.
 *
 *       404:
 *         description: Compra no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.post(
    '/',
    authorize('CuentasPagar', 'Crear'),
    cuentaPagarController.crear
);


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

/**
 * @swagger
 * /cuentas-pagar/{id}:
 *   put:
 *     summary: Actualizar cuenta por pagar
 *     description: Actualiza la fecha de vencimiento u observación de una cuenta que aún tenga saldo pendiente.
 *     tags: [Cuentas por Pagar]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cuenta.
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
 *               fechaVencimiento:
 *                 type: string
 *                 format: date-time
 *
 *               observacion:
 *                 type: string
 *                 maxLength: 500
 *
 *     responses:
 *
 *       200:
 *         description: Cuenta actualizada correctamente.
 *
 *       400:
 *         description: La cuenta ya está pagada o los datos son inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Cuenta no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.put(
    '/:id',
    authorize('CuentasPagar', 'Editar'),
    cuentaPagarController.actualizar
);


/*=====================================================
==================== REGISTRAR PAGO ===================
=====================================================*/

/**
 * @swagger
 * /cuentas-pagar/{id}/pagos:
 *   post:
 *     summary: Registrar pago
 *     description: Registra un abono a la cuenta por pagar y actualiza automáticamente el saldo y estado.
 *     tags: [Cuentas por Pagar]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cuenta por pagar.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
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
 *               - monto
 *
 *             properties:
 *
 *               monto:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *                 exclusiveMinimum: true
 *                 example: 250.50
 *
 *               metodoPago:
 *                 type: string
 *                 enum:
 *                   - EFECTIVO
 *                   - TARJETA
 *                   - TRANSFERENCIA
 *                   - CHEQUE
 *                   - CREDITO
 *                   - OTRO
 *                 example: TRANSFERENCIA
 *
 *               referencia:
 *                 type: string
 *                 maxLength: 150
 *                 example: TRX-987654321
 *
 *               observacion:
 *                 type: string
 *                 maxLength: 500
 *                 example: Abono correspondiente al mes.
 *
 *           examples:
 *
 *             transferencia:
 *               summary: Pago mediante transferencia
 *               value:
 *                 monto: 250.50
 *                 metodoPago: TRANSFERENCIA
 *                 referencia: TRX-987654321
 *                 observacion: Pago parcial al proveedor.
 *
 *     responses:
 *
 *       200:
 *         description: Pago registrado correctamente.
 *
 *       400:
 *         description: El monto supera el saldo pendiente o la cuenta ya está pagada.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para registrar pagos.
 *
 *       404:
 *         description: Cuenta por pagar no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.post(
    '/:id/pagos',
    authorize('CuentasPagar', 'Editar'),
    cuentaPagarController.registrarPago
);


/*=====================================================
==================== CONSULTAR PAGOS ==================
=====================================================*/

/**
 * @swagger
 * /cuentas-pagar/{id}/pagos:
 *   get:
 *     summary: Obtener pagos de una cuenta
 *     description: Obtiene todos los abonos realizados sobre una cuenta por pagar.
 *     tags: [Cuentas por Pagar]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la cuenta por pagar.
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: metodoPago
 *         description: Filtrar por método de pago.
 *         schema:
 *           type: string
 *           enum:
 *             - EFECTIVO
 *             - TARJETA
 *             - TRANSFERENCIA
 *             - CHEQUE
 *             - CREDITO
 *             - OTRO
 *
 *       - in: query
 *         name: fechaDesde
 *         description: Fecha inicial del pago.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: fechaHasta
 *         description: Fecha final del pago.
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
 *         description: Pagos obtenidos correctamente.
 *
 *       400:
 *         description: Parámetros inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Cuenta por pagar no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.get(
    '/:id/pagos',
    authorize('CuentasPagar', 'Ver'),
    cuentaPagarController.obtenerPagos
);


export default router;