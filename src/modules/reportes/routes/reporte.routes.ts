import { Router } from 'express';
import { reporteController } from '../controllers/reporte.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
    ReporteVentasSchema,
    ReporteComprasSchema,
    ReporteInventarioSchema,
    ReporteClientesSchema,
    ReporteCuentasCobrarSchema,
    ReporteCuentasPagarSchema,
    ReporteGastosSchema
} from '../dto/reporte.dto';
const router = Router();
router.use(authenticate);
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
router.get('/ventas', authorize('Reportes', 'Ver'), validate(ReporteVentasSchema), reporteController.ventas);
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
router.get('/compras', authorize('Reportes', 'Ver'), validate(ReporteComprasSchema), reporteController.compras);
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
router.get('/inventario', authorize('Reportes', 'Ver'), validate(ReporteInventarioSchema), reporteController.inventario);
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
router.get('/clientes', authorize('Reportes', 'Ver'), validate(ReporteClientesSchema), reporteController.clientes);
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
router.get('/cuentas-cobrar', authorize('Reportes', 'Ver'), validate(ReporteCuentasCobrarSchema), reporteController.cuentasCobrar);
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
router.get('/cuentas-pagar', authorize('Reportes', 'Ver'), validate(ReporteCuentasPagarSchema), reporteController.cuentasPagar);
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
router.get('/gastos', authorize('Reportes', 'Ver'), validate(ReporteGastosSchema), reporteController.gastos);
export default router;