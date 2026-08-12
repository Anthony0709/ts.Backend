import { Router } from 'express';
import { configuracionController } from '../controllers/configuracion.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { CrearConfiguracionSchema, ActualizarConfiguracionSchema } from '../dto/configuracion.dto';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Configuración
 *   description: Configuración general de la empresa
 */

/**
 * @swagger
 * /configuracion:
 *   get:
 *     summary: Obtener configuración
 *     tags: [Configuración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuración obtenida correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       500:
 *         description: Error interno.
 */
router.get(
    '/',
    authorize('Configuracion', 'Ver'),
    configuracionController.obtener
);

/**
 * @swagger
 * /configuracion:
 *   post:
 *     summary: Crear configuración
 *     tags: [Configuración]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *               moneda:
 *                 type: string
 *                 example: USD
 *               simboloMoneda:
 *                 type: string
 *                 example: $
 *               iva:
 *                 type: number
 *                 example: 15
 *               zonaHoraria:
 *                 type: string
 *                 example: America/Guayaquil
 *               formatoFecha:
 *                 type: string
 *                 example: dd/MM/yyyy
 *               idioma:
 *                 type: string
 *                 example: es
 *               prefijoCompra:
 *                 type: string
 *                 example: COM
 *               prefijoVenta:
 *                 type: string
 *                 example: VEN
 *               prefijoCotizacion:
 *                 type: string
 *                 example: COT
 *               prefijoFactura:
 *                 type: string
 *                 example: FAC
 *               prefijoGasto:
 *                 type: string
 *                 example: GAS
 *               prefijoTransferencia:
 *                 type: string
 *                 example: TRF
 *               prefijoDevolucion:
 *                 type: string
 *                 example: DEV
 *               permitirStockNegativo:
 *                 type: boolean
 *               controlarLotes:
 *                 type: boolean
 *               controlarSeries:
 *                 type: boolean
 *               actualizarCostoPromedio:
 *                 type: boolean
 *               aprobarCompras:
 *                 type: boolean
 *               aprobarVentas:
 *                 type: boolean
 *               permitirDescuento:
 *                 type: boolean
 *               porcentajeMaxDescuento:
 *                 type: number
 *                 example: 20
 *               dobleFactor:
 *                 type: boolean
 *               expiracionPassword:
 *                 type: integer
 *                 example: 90
 *               longitudMinimaPassword:
 *                 type: integer
 *                 example: 8
 *               intentosLogin:
 *                 type: integer
 *                 example: 5
 *               bloqueoMinutos:
 *                 type: integer
 *                 example: 30
 *               auditoriaActiva:
 *                 type: boolean
 *               diasRetencionAuditoria:
 *                 type: integer
 *                 example: 365
 *               enviarCorreo:
 *                 type: boolean
 *               enviarNotificaciones:
 *                 type: boolean
 *               mantenimiento:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Configuración creada correctamente.
 *       400:
 *         description: La configuración ya existe o los datos son inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.post(
    '/',
    authorize('Configuracion', 'Crear'),
    validate(CrearConfiguracionSchema),
    configuracionController.crear
);

/**
 * @swagger
 * /configuracion:
 *   put:
 *     summary: Actualizar configuración
 *     tags: [Configuración]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 nullable: true
 *               moneda:
 *                 type: string
 *               simboloMoneda:
 *                 type: string
 *               iva:
 *                 type: number
 *               zonaHoraria:
 *                 type: string
 *               formatoFecha:
 *                 type: string
 *               idioma:
 *                 type: string
 *               prefijoCompra:
 *                 type: string
 *               prefijoVenta:
 *                 type: string
 *               prefijoCotizacion:
 *                 type: string
 *               prefijoFactura:
 *                 type: string
 *               prefijoGasto:
 *                 type: string
 *               prefijoTransferencia:
 *                 type: string
 *               prefijoDevolucion:
 *                 type: string
 *               permitirStockNegativo:
 *                 type: boolean
 *               controlarLotes:
 *                 type: boolean
 *               controlarSeries:
 *                 type: boolean
 *               actualizarCostoPromedio:
 *                 type: boolean
 *               aprobarCompras:
 *                 type: boolean
 *               aprobarVentas:
 *                 type: boolean
 *               permitirDescuento:
 *                 type: boolean
 *               porcentajeMaxDescuento:
 *                 type: number
 *               dobleFactor:
 *                 type: boolean
 *               expiracionPassword:
 *                 type: integer
 *               longitudMinimaPassword:
 *                 type: integer
 *               intentosLogin:
 *                 type: integer
 *               bloqueoMinutos:
 *                 type: integer
 *               auditoriaActiva:
 *                 type: boolean
 *               diasRetencionAuditoria:
 *                 type: integer
 *               enviarCorreo:
 *                 type: boolean
 *               enviarNotificaciones:
 *                 type: boolean
 *               mantenimiento:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Configuración actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Configuración no encontrada.
 */
router.put(
    '/',
    authorize('Configuracion', 'Editar'),
    validate(ActualizarConfiguracionSchema),
    configuracionController.actualizar
);

/**
 * @swagger
 * /configuracion/restaurar:
 *   patch:
 *     summary: Restaurar configuración
 *     description: Restaura la configuración de la empresa a sus valores predeterminados.
 *     tags: [Configuración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuración restaurada correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Configuración no encontrada.
 */
router.patch(
    '/restaurar',
    authorize('Configuracion', 'Editar'),
    configuracionController.restaurar
);

export default router;