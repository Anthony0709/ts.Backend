"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const venta_controller_1 = require("../controllers/venta.controller");
const venta_dto_1 = require("../dto/venta.dto");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/*=====================================================
======================= SWAGGER =======================
=====================================================*/
/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: Gestión de ventas
 */
/*=====================================================
======================= LISTAR ========================
=====================================================*/
/**
 * @swagger
 * /ventas:
 *   get:
 *     summary: Obtener ventas
 *     description: Obtiene las ventas de la empresa autenticada con filtros y paginación.
 *     tags: [Ventas]
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
 *             - ANULADA
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
 *         description: Ventas obtenidas correctamente.
 *
 *       400:
 *         description: Parámetros inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para consultar ventas.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Ventas', 'Ver'), (0, validate_middleware_1.validate)(venta_dto_1.ConsultarVentasSchema), venta_controller_1.ventaController.obtenerTodos);
/*=====================================================
====================== OBTENER ========================
=====================================================*/
/**
 * @swagger
 * /ventas/{id}:
 *   get:
 *     summary: Obtener venta por ID
 *     description: Obtiene una venta completa incluyendo cliente, detalles y cuenta por cobrar.
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la venta.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Venta obtenida correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Venta no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Ventas', 'Ver'), venta_controller_1.ventaController.obtenerPorId);
/*=====================================================
======================= CREAR =========================
=====================================================*/
/**
 * @swagger
 * /ventas:
 *   post:
 *     summary: Crear venta
 *     description: Crea una venta. El número, empresa, estado y totales son controlados por el backend.
 *     tags: [Ventas]
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
 *                 example: Venta mostrador.
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
 *                       example: 2
 *
 *                     precio:
 *                       type: number
 *                       format: double
 *                       minimum: 0
 *                       example: 25.50
 *
 *           examples:
 *
 *             venta:
 *               summary: Crear venta
 *               value:
 *                 clienteId: cm123456789abcdefghijkl
 *                 observacion: Venta mostrador.
 *                 detalles:
 *                   - productoId: cm987654321abcdefghijkl
 *                     cantidad: 2
 *                     precio: 25.50
 *                   - productoId: cm555555555abcdefghijkl
 *                     cantidad: 1
 *                     precio: 40.00
 *
 *     responses:
 *
 *       201:
 *         description: Venta creada correctamente.
 *
 *       400:
 *         description: Datos inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para crear ventas.
 *
 *       404:
 *         description: Cliente o producto no encontrado.
 *
 *       500:
 *         description: Error interno.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Ventas', 'Crear'), (0, validate_middleware_1.validate)(venta_dto_1.CrearVentaSchema), venta_controller_1.ventaController.crear);
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
/**
 * @swagger
 * /ventas/{id}:
 *   put:
 *     summary: Actualizar venta
 *     description: Actualiza una venta mientras se encuentre en estado BORRADOR.
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la venta.
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
 *         description: Venta actualizada correctamente.
 *
 *       400:
 *         description: La venta no está en BORRADOR o los datos son inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos para editar.
 *
 *       404:
 *         description: Venta, cliente o producto no encontrado.
 *
 *       500:
 *         description: Error interno.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Ventas', 'Editar'), (0, validate_middleware_1.validate)(venta_dto_1.ActualizarVentaSchema), venta_controller_1.ventaController.actualizar);
/*=====================================================
======================= APROBAR =======================
=====================================================*/
/**
 * @swagger
 * /ventas/{id}/aprobar:
 *   patch:
 *     summary: Aprobar venta
 *     description: Cambia una venta de BORRADOR a APROBADA.
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la venta.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Venta aprobada correctamente.
 *
 *       400:
 *         description: La venta no está en BORRADOR.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para aprobar ventas.
 *
 *       404:
 *         description: Venta no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch('/:id/aprobar', (0, authorize_middleware_1.authorize)('Ventas', 'Aprobar'), venta_controller_1.ventaController.aprobar);
/*=====================================================
======================= ANULAR ========================
=====================================================*/
/**
 * @swagger
 * /ventas/{id}/anular:
 *   patch:
 *     summary: Anular venta
 *     description: Cambia una venta a estado ANULADA.
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la venta.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Venta anulada correctamente.
 *
 *       400:
 *         description: La venta ya está anulada.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para anular ventas.
 *
 *       404:
 *         description: Venta no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch('/:id/anular', (0, authorize_middleware_1.authorize)('Ventas', 'Anular'), venta_controller_1.ventaController.anular);
exports.default = router;
