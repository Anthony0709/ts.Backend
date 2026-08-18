"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configuracion_controller_1 = require("../controllers/configuracion.controller");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const configuracion_dto_1 = require("../dto/configuracion.dto");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
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
router.get('/', (0, authorize_middleware_1.authorize)('Configuracion', 'Ver'), configuracion_controller_1.configuracionController.obtener);
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
router.post('/', (0, authorize_middleware_1.authorize)('Configuracion', 'Crear'), (0, validate_middleware_1.validate)(configuracion_dto_1.CrearConfiguracionSchema), configuracion_controller_1.configuracionController.crear);
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
router.put('/', (0, authorize_middleware_1.authorize)('Configuracion', 'Editar'), (0, validate_middleware_1.validate)(configuracion_dto_1.ActualizarConfiguracionSchema), configuracion_controller_1.configuracionController.actualizar);
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
router.patch('/restaurar', (0, authorize_middleware_1.authorize)('Configuracion', 'Editar'), configuracion_controller_1.configuracionController.restaurar);
exports.default = router;
