"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gasto_controller_1 = require("../controllers/gasto.controller");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/*=====================================================
======================= SWAGGER =======================
=====================================================*/
/**
 * @swagger
 * tags:
 *   name: Gastos
 *   description: Gestión de gastos de la empresa
 */
/*=====================================================
======================= LISTAR ========================
=====================================================*/
/**
 * @swagger
 * /gastos:
 *   get:
 *     summary: Obtener gastos
 *     description: Obtiene los gastos de la empresa autenticada con filtros y paginación.
 *     tags: [Gastos]
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
 *             - PENDIENTE
 *             - PAGADO
 *             - ANULADO
 *
 *       - in: query
 *         name: categoria
 *         description: Filtrar por categoría del gasto.
 *         schema:
 *           type: string
 *           example: Servicios básicos
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
 *         name: montoMinimo
 *         description: Monto mínimo.
 *         schema:
 *           type: number
 *           format: double
 *           minimum: 0
 *
 *       - in: query
 *         name: montoMaximo
 *         description: Monto máximo.
 *         schema:
 *           type: number
 *           format: double
 *           minimum: 0
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
 *         description: Gastos obtenidos correctamente.
 *
 *       400:
 *         description: Parámetros inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para consultar gastos.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Gastos', 'Ver'), gasto_controller_1.gastoController.obtenerTodos);
/*=====================================================
====================== OBTENER ========================
=====================================================*/
/**
 * @swagger
 * /gastos/{id}:
 *   get:
 *     summary: Obtener gasto por ID
 *     description: Obtiene el detalle completo de un gasto.
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del gasto.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Gasto obtenido correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos.
 *
 *       404:
 *         description: Gasto no encontrado.
 *
 *       500:
 *         description: Error interno.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Gastos', 'Ver'), gasto_controller_1.gastoController.obtenerPorId);
/*=====================================================
======================= CREAR =========================
=====================================================*/
/**
 * @swagger
 * /gastos:
 *   post:
 *     summary: Crear gasto
 *     description: Crea un gasto en estado PENDIENTE. El número, fecha y empresa son controlados por el backend.
 *     tags: [Gastos]
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
 *               - concepto
 *               - categoria
 *               - monto
 *
 *             properties:
 *
 *               concepto:
 *                 type: string
 *                 maxLength: 200
 *                 example: Pago de energía eléctrica
 *
 *               descripcion:
 *                 type: string
 *                 maxLength: 500
 *                 example: Consumo correspondiente al mes.
 *
 *               proveedorId:
 *                 type: string
 *                 description: Proveedor relacionado, si aplica.
 *                 example: cm123456789abcdefghijkl
 *
 *               categoria:
 *                 type: string
 *                 maxLength: 100
 *                 example: Servicios básicos
 *
 *               monto:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *                 exclusiveMinimum: true
 *                 example: 125.50
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
 *                 example: TRX-123456
 *
 *           examples:
 *
 *             gasto:
 *               summary: Crear gasto
 *               value:
 *                 concepto: Pago de energía eléctrica
 *                 descripcion: Consumo correspondiente al mes.
 *                 proveedorId: cm123456789abcdefghijkl
 *                 categoria: Servicios básicos
 *                 monto: 125.50
 *                 metodoPago: TRANSFERENCIA
 *                 referencia: TRX-123456
 *
 *     responses:
 *
 *       201:
 *         description: Gasto creado correctamente.
 *
 *       400:
 *         description: Datos inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para crear gastos.
 *
 *       404:
 *         description: Proveedor no encontrado.
 *
 *       500:
 *         description: Error interno.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Gastos', 'Crear'), gasto_controller_1.gastoController.crear);
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
/**
 * @swagger
 * /gastos/{id}:
 *   put:
 *     summary: Actualizar gasto
 *     description: Actualiza un gasto mientras se encuentre PENDIENTE.
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del gasto.
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
 *               concepto:
 *                 type: string
 *                 maxLength: 200
 *
 *               descripcion:
 *                 type: string
 *                 maxLength: 500
 *
 *               proveedorId:
 *                 type: string
 *                 nullable: true
 *
 *               categoria:
 *                 type: string
 *                 maxLength: 100
 *
 *               monto:
 *                 type: number
 *                 format: double
 *                 minimum: 0
 *
 *               metodoPago:
 *                 type: string
 *                 nullable: true
 *                 enum:
 *                   - EFECTIVO
 *                   - TARJETA
 *                   - TRANSFERENCIA
 *                   - CHEQUE
 *                   - CREDITO
 *                   - OTRO
 *
 *               referencia:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 150
 *
 *     responses:
 *
 *       200:
 *         description: Gasto actualizado correctamente.
 *
 *       400:
 *         description: El gasto no está pendiente o los datos son inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para editar gastos.
 *
 *       404:
 *         description: Gasto o proveedor no encontrado.
 *
 *       500:
 *         description: Error interno.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Gastos', 'Editar'), gasto_controller_1.gastoController.actualizar);
/*=====================================================
======================= PAGAR =========================
=====================================================*/
/**
 * @swagger
 * /gastos/{id}/pagar:
 *   patch:
 *     summary: Marcar gasto como pagado
 *     description: Cambia el estado de un gasto PENDIENTE a PAGADO.
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del gasto.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Gasto marcado como pagado correctamente.
 *
 *       400:
 *         description: El gasto ya está pagado o está anulado.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para pagar gastos.
 *
 *       404:
 *         description: Gasto no encontrado.
 *
 *       500:
 *         description: Error interno.
 */
router.patch('/:id/pagar', (0, authorize_middleware_1.authorize)('Gastos', 'Editar'), gasto_controller_1.gastoController.pagar);
/*=====================================================
======================= ANULAR ========================
=====================================================*/
/**
 * @swagger
 * /gastos/{id}/anular:
 *   patch:
 *     summary: Anular gasto
 *     description: Anula un gasto que se encuentre PENDIENTE.
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del gasto.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Gasto anulado correctamente.
 *
 *       400:
 *         description: El gasto ya está anulado o ya fue pagado.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para anular gastos.
 *
 *       404:
 *         description: Gasto no encontrado.
 *
 *       500:
 *         description: Error interno.
 */
router.patch('/:id/anular', (0, authorize_middleware_1.authorize)('Gastos', 'Anular'), gasto_controller_1.gastoController.anular);
exports.default = router;
