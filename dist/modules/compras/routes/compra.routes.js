"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const compra_controller_1 = require("../controllers/compra.controller");
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
 *   name: Compras
 *   description: Gestión de compras y cuentas por pagar
 */
/*=====================================================
======================= LISTAR ========================
=====================================================*/
/**
 * @swagger
 * /compras:
 *   get:
 *     summary: Obtener compras
 *     description: Obtiene las compras de la empresa autenticada con filtros y paginación.
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: proveedorId
 *         description: Filtrar compras por proveedor.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *       - in: query
 *         name: estado
 *         description: Filtrar por estado de compra.
 *         schema:
 *           type: string
 *           enum:
 *             - BORRADOR
 *             - APROBADA
 *             - ANULADA
 *
 *       - in: query
 *         name: fechaDesde
 *         description: Fecha inicial del rango.
 *         schema:
 *           type: string
 *           format: date-time
 *
 *       - in: query
 *         name: fechaHasta
 *         description: Fecha final del rango.
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
 *         description: Cantidad de registros por página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *
 *     responses:
 *
 *       200:
 *         description: Compras obtenidas correctamente.
 *
 *       400:
 *         description: Parámetros inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para consultar compras.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Compras', 'Ver'), compra_controller_1.compraController.obtenerTodos);
/*=====================================================
====================== OBTENER ========================
=====================================================*/
/**
 * @swagger
 * /compras/{id}:
 *   get:
 *     summary: Obtener compra por ID
 *     description: Obtiene una compra completa con proveedor, detalles y cuenta por pagar.
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la compra.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Compra obtenida correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para consultar compras.
 *
 *       404:
 *         description: Compra no encontrada.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Compras', 'Ver'), compra_controller_1.compraController.obtenerPorId);
/*=====================================================
======================= CREAR =========================
=====================================================*/
/**
 * @swagger
 * /compras:
 *   post:
 *     summary: Crear compra
 *     description: Crea una compra en estado BORRADOR. El número, subtotal, impuesto y total son generados/calculados por el backend.
 *     tags: [Compras]
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
 *                 example: Compra de mercadería.
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
 *                       example: 20
 *
 *                     costo:
 *                       type: number
 *                       format: double
 *                       minimum: 0
 *                       example: 25.50
 *
 *           examples:
 *
 *             compra:
 *               summary: Compra con varios productos
 *               value:
 *                 proveedorId: cm123456789abcdefghijkl
 *                 observacion: Compra de inventario mensual.
 *                 detalles:
 *                   - productoId: cm987654321abcdefghijkl
 *                     cantidad: 20
 *                     costo: 25.50
 *                   - productoId: cm555555555abcdefghijkl
 *                     cantidad: 10
 *                     costo: 12.75
 *
 *     responses:
 *
 *       201:
 *         description: Compra creada correctamente.
 *
 *       400:
 *         description: Datos inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para crear compras.
 *
 *       404:
 *         description: Proveedor o producto no encontrado.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Compras', 'Crear'), compra_controller_1.compraController.crear);
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
/**
 * @swagger
 * /compras/{id}:
 *   put:
 *     summary: Actualizar compra
 *     description: Actualiza una compra mientras se encuentre en estado BORRADOR.
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la compra.
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
 *                       minimum: 0
 *
 *     responses:
 *
 *       200:
 *         description: Compra actualizada correctamente.
 *
 *       400:
 *         description: La compra no está en BORRADOR o los datos son inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para editar compras.
 *
 *       404:
 *         description: Compra, proveedor o producto no encontrado.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Compras', 'Editar'), compra_controller_1.compraController.actualizar);
/*=====================================================
======================= APROBAR =======================
=====================================================*/
/**
 * @swagger
 * /compras/{id}/aprobar:
 *   patch:
 *     summary: Aprobar compra
 *     description: Cambia una compra de BORRADOR a APROBADA y genera la cuenta por pagar asociada. La entrada física al inventario se realizará posteriormente mediante recepción.
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la compra.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Compra aprobada correctamente.
 *
 *       400:
 *         description: La compra no está en BORRADOR.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para aprobar compras.
 *
 *       404:
 *         description: Compra no encontrada.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.patch('/:id/aprobar', (0, authorize_middleware_1.authorize)('Compras', 'Aprobar'), compra_controller_1.compraController.aprobar);
/*=====================================================
======================== ANULAR =======================
=====================================================*/
/**
 * @swagger
 * /compras/{id}/anular:
 *   patch:
 *     summary: Anular compra
 *     description: Anula una compra que todavía se encuentre en BORRADOR. Una compra aprobada debe gestionarse mediante el proceso de devolución correspondiente.
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la compra.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
 *
 *     responses:
 *
 *       200:
 *         description: Compra anulada correctamente.
 *
 *       400:
 *         description: La compra ya está anulada o ya fue aprobada.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos para anular compras.
 *
 *       404:
 *         description: Compra no encontrada.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.patch('/:id/anular', (0, authorize_middleware_1.authorize)('Compras', 'Anular'), compra_controller_1.compraController.anular);
exports.default = router;
