"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reporte_controller_1 = require("../controllers/reporte.controller");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const reporte_dto_1 = require("../dto/reporte.dto");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Reportes generales del sistema
 */
/**
 * @swagger
 * /reportes/ventas:
 *   get:
 *     summary: Reporte de ventas
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: clienteId
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [BORRADOR, APROBADA, ANULADA]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get('/ventas', (0, authorize_middleware_1.authorize)('Reportes', 'Ver'), (0, validate_middleware_1.validate)(reporte_dto_1.ReporteVentasSchema), reporte_controller_1.reporteController.ventas);
/**
 * @swagger
 * /reportes/compras:
 *   get:
 *     summary: Reporte de compras
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: proveedorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [BORRADOR, APROBADA, ANULADA]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get('/compras', (0, authorize_middleware_1.authorize)('Reportes', 'Ver'), (0, validate_middleware_1.validate)(reporte_dto_1.ReporteComprasSchema), reporte_controller_1.reporteController.compras);
/**
 * @swagger
 * /reportes/inventario:
 *   get:
 *     summary: Reporte de inventario
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: bodegaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: productoId
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get('/inventario', (0, authorize_middleware_1.authorize)('Reportes', 'Ver'), (0, validate_middleware_1.validate)(reporte_dto_1.ReporteInventarioSchema), reporte_controller_1.reporteController.inventario);
/**
 * @swagger
 * /reportes/clientes:
 *   get:
 *     summary: Reporte de clientes
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: estado
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get('/clientes', (0, authorize_middleware_1.authorize)('Reportes', 'Ver'), (0, validate_middleware_1.validate)(reporte_dto_1.ReporteClientesSchema), reporte_controller_1.reporteController.clientes);
/**
 * @swagger
 * /reportes/cuentas-cobrar:
 *   get:
 *     summary: Reporte de cuentas por cobrar
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clienteId
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [PENDIENTE, PARCIAL, PAGADA, VENCIDA]
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
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get('/cuentas-cobrar', (0, authorize_middleware_1.authorize)('Reportes', 'Ver'), (0, validate_middleware_1.validate)(reporte_dto_1.ReporteCuentasCobrarSchema), reporte_controller_1.reporteController.cuentasCobrar);
/**
 * @swagger
 * /reportes/cuentas-pagar:
 *   get:
 *     summary: Reporte de cuentas por pagar
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: proveedorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [PENDIENTE, PARCIAL, PAGADA, VENCIDA]
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
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get('/cuentas-pagar', (0, authorize_middleware_1.authorize)('Reportes', 'Ver'), (0, validate_middleware_1.validate)(reporte_dto_1.ReporteCuentasPagarSchema), reporte_controller_1.reporteController.cuentasPagar);
/**
 * @swagger
 * /reportes/gastos:
 *   get:
 *     summary: Reporte de gastos
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: proveedorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [PENDIENTE, PAGADO, ANULADO]
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
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 */
router.get('/gastos', (0, authorize_middleware_1.authorize)('Reportes', 'Ver'), (0, validate_middleware_1.validate)(reporte_dto_1.ReporteGastosSchema), reporte_controller_1.reporteController.gastos);
exports.default = router;
