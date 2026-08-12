import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { DashboardFiltroSchema } from '../dto/dashboard.dto';

const router = Router();
router.use(authenticate);

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
router.get(
    '/',
    authorize('Dashboard', 'Ver'),
    validate(DashboardFiltroSchema),
    dashboardController.obtenerResumen
);

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
router.get(
    '/ventas',
    authorize('Dashboard', 'Ver'),
    validate(DashboardFiltroSchema),
    dashboardController.obtenerVentasPorPeriodo
);

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
router.get(
    '/bajo-stock',
    authorize('Dashboard', 'Ver'),
    validate(DashboardFiltroSchema),
    dashboardController.obtenerProductosBajoStock
);

export default router;