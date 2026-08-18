"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const dashboard_dto_1 = require("../dto/dashboard.dto");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Panel principal y estadísticas de la empresa
 */
/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Obtener resumen del dashboard
 *     tags: [Dashboard]
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
 *         name: sucursalId
 *         schema:
 *           type: string
 *       - in: query
 *         name: bodegaId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resumen obtenido correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Dashboard', 'Ver'), (0, validate_middleware_1.validate)(dashboard_dto_1.DashboardFiltroSchema), dashboard_controller_1.dashboardController.obtenerResumen);
/**
 * @swagger
 * /dashboard/ventas:
 *   get:
 *     summary: Obtener ventas por periodo
 *     tags: [Dashboard]
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
 *     responses:
 *       200:
 *         description: Ventas obtenidas correctamente.
 */
router.get('/ventas', (0, authorize_middleware_1.authorize)('Dashboard', 'Ver'), (0, validate_middleware_1.validate)(dashboard_dto_1.DashboardFiltroSchema), dashboard_controller_1.dashboardController.obtenerVentasPorPeriodo);
/**
 * @swagger
 * /dashboard/bajo-stock:
 *   get:
 *     summary: Obtener productos con bajo stock
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: bodegaId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos con bajo stock obtenidos correctamente.
 */
router.get('/bajo-stock', (0, authorize_middleware_1.authorize)('Dashboard', 'Ver'), (0, validate_middleware_1.validate)(dashboard_dto_1.DashboardFiltroSchema), dashboard_controller_1.dashboardController.obtenerProductosBajoStock);
exports.default = router;
