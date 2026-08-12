import { Router } from 'express';
import { cuentaCobrarController } from '../controllers/cuenta-cobrar.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
    CrearCuentaCobrarSchema,
    RegistrarAbonoCuentaCobrarSchema,
    ConsultarCuentasCobrarSchema
} from '../dto/cuenta-cobrar.dto';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Cuentas por Cobrar
 *   description: Gestión de cuentas por cobrar y abonos de clientes
 */

/**
 * @swagger
 * /cuentas-cobrar:
 *   get:
 *     summary: Obtener cuentas por cobrar
 *     tags: [Cuentas por Cobrar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clienteId
 *         schema:
 *           type: string
 *       - in: query
 *         name: ventaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [PENDIENTE, PARCIAL, PAGADA, VENCIDA]
 *       - in: query
 *         name: numeroDocumento
 *         schema:
 *           type: string
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
 *         name: vencidas
 *         schema:
 *           type: boolean
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
 *         description: Cuentas obtenidas correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       500:
 *         description: Error interno.
 */
router.get(
    '/',
    authorize('CuentasPorCobrar', 'Ver'),
    validate(ConsultarCuentasCobrarSchema),
    cuentaCobrarController.obtenerTodos
);

/**
 * @swagger
 * /cuentas-cobrar:
 *   post:
 *     summary: Crear cuenta por cobrar
 *     description: Crea una cuenta por cobrar asociada a una venta.
 *     tags: [Cuentas por Cobrar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clienteId
 *               - ventaId
 *               - numeroDocumento
 *               - fechaEmision
 *               - fechaVencimiento
 *               - monto
 *             properties:
 *               clienteId:
 *                 type: string
 *               ventaId:
 *                 type: string
 *               numeroDocumento:
 *                 type: string
 *                 example: FAC-001-000001
 *               fechaEmision:
 *                 type: string
 *                 format: date-time
 *               fechaVencimiento:
 *                 type: string
 *                 format: date-time
 *               monto:
 *                 type: number
 *                 format: double
 *                 example: 250.50
 *               observacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cuenta creada correctamente.
 *       400:
 *         description: Datos inválidos o la venta ya tiene cuenta por cobrar.
 *       404:
 *         description: Cliente o venta no encontrados.
 *       500:
 *         description: Error interno.
 */
router.post(
    '/',
    authorize('CuentasPorCobrar', 'Crear'),
    validate(CrearCuentaCobrarSchema),
    cuentaCobrarController.crear
);

/**
 * @swagger
 * /cuentas-cobrar/vencidas:
 *   patch:
 *     summary: Actualizar cuentas vencidas
 *     description: Cambia a VENCIDA las cuentas pendientes o parciales cuyo vencimiento ya pasó.
 *     tags: [Cuentas por Cobrar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuentas vencidas actualizadas correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.patch(
    '/vencidas',
    authorize('CuentasPorCobrar', 'Editar'),
    cuentaCobrarController.actualizarVencidas
);

/**
 * @swagger
 * /cuentas-cobrar/{id}:
 *   get:
 *     summary: Obtener cuenta por cobrar por ID
 *     tags: [Cuentas por Cobrar]
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
 *         description: Cuenta obtenida correctamente.
 *       404:
 *         description: Cuenta no encontrada.
 */
router.get(
    '/:id',
    authorize('CuentasPorCobrar', 'Ver'),
    cuentaCobrarController.obtenerPorId
);

/**
 * @swagger
 * /cuentas-cobrar/{id}/abono:
 *   post:
 *     summary: Registrar abono
 *     description: Registra un abono y actualiza automáticamente el saldo y estado de la cuenta.
 *     tags: [Cuentas por Cobrar]
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
 *               - monto
 *               - metodoPago
 *             properties:
 *               monto:
 *                 type: number
 *                 format: double
 *                 example: 100
 *               metodoPago:
 *                 type: string
 *                 enum: [EFECTIVO, TARJETA, TRANSFERENCIA, CHEQUE, CREDITO, OTRO]
 *               referencia:
 *                 type: string
 *               observacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Abono registrado correctamente.
 *       400:
 *         description: Monto inválido o mayor al saldo.
 *       404:
 *         description: Cuenta no encontrada.
 */
router.post(
    '/:id/abono',
    authorize('CuentasPorCobrar', 'Editar'),
    validate(RegistrarAbonoCuentaCobrarSchema),
    cuentaCobrarController.registrarAbono
);

/**
 * @swagger
 * /cuentas-cobrar/{id}/abonos:
 *   get:
 *     summary: Obtener abonos de una cuenta
 *     tags: [Cuentas por Cobrar]
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
 *         description: Abonos obtenidos correctamente.
 *       404:
 *         description: Cuenta no encontrada.
 */
router.get(
    '/:id/abonos',
    authorize('CuentasPorCobrar', 'Ver'),
    cuentaCobrarController.obtenerAbonos
);

export default router;