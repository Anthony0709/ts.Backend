import { Router } from 'express';
import { planController } from '../controllers/plan.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import {
    CrearPlanSchema,
    ActualizarPlanSchema,
    ConsultarPlanesSchema
} from '../dto/plan.dto';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Planes
 *   description: Gestión de planes comerciales del ERP
 */

/**
 * @swagger
 * /planes:
 *   get:
 *     summary: Obtener planes
 *     tags: [Planes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: activo
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: nombre
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Planes obtenidos correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get(
    '/',
    authorize('Planes', 'Ver'),
    validate(ConsultarPlanesSchema),
    planController.obtenerTodos
);

/**
 * @swagger
 * /planes:
 *   post:
 *     summary: Crear plan
 *     tags: [Planes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precioMensual
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Empresarial
 *               codigo:
 *                 type: string
 *                 example: EMPRESARIAL
 *               descripcion:
 *                 type: string
 *                 example: Plan empresarial completo.
 *               precioMensual:
 *                 type: number
 *                 format: double
 *                 example: 99.99
 *               precioAnual:
 *                 type: number
 *                 format: double
 *                 example: 999.99
 *               maxUsuarios:
 *                 type: integer
 *                 example: 50
 *               maxSucursales:
 *                 type: integer
 *                 example: 10
 *               maxBodegas:
 *                 type: integer
 *                 example: 20
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Plan creado correctamente.
 *       400:
 *         description: Ya existe un plan con ese nombre o código.
 */
router.post(
    '/',
    authorize('Planes', 'Crear'),
    validate(CrearPlanSchema),
    planController.crear
);

/**
 * @swagger
 * /planes/{id}:
 *   get:
 *     summary: Obtener plan por ID
 *     tags: [Planes]
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
 *         description: Plan obtenido correctamente.
 *       404:
 *         description: Plan no encontrado.
 */
router.get(
    '/:id',
    authorize('Planes', 'Ver'),
    planController.obtenerPorId
);

/**
 * @swagger
 * /planes/{id}:
 *   put:
 *     summary: Actualizar plan
 *     tags: [Planes]
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
 *             properties:
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *                 nullable: true
 *               descripcion:
 *                 type: string
 *                 nullable: true
 *               precioMensual:
 *                 type: number
 *               precioAnual:
 *                 type: number
 *                 nullable: true
 *               maxUsuarios:
 *                 type: integer
 *                 nullable: true
 *               maxSucursales:
 *                 type: integer
 *                 nullable: true
 *               maxBodegas:
 *                 type: integer
 *                 nullable: true
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Plan actualizado correctamente.
 *       404:
 *         description: Plan no encontrado.
 */
router.put(
    '/:id',
    authorize('Planes', 'Editar'),
    validate(ActualizarPlanSchema),
    planController.actualizar
);

/**
 * @swagger
 * /planes/{id}/activar:
 *   patch:
 *     summary: Activar plan
 *     tags: [Planes]
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
 *         description: Plan activado correctamente.
 *       404:
 *         description: Plan no encontrado.
 */
router.patch(
    '/:id/activar',
    authorize('Planes', 'Editar'),
    planController.activar
);

/**
 * @swagger
 * /planes/{id}/desactivar:
 *   patch:
 *     summary: Desactivar plan
 *     tags: [Planes]
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
 *         description: Plan desactivado correctamente.
 *       400:
 *         description: No se puede desactivar el plan porque tiene empresas activas.
 *       404:
 *         description: Plan no encontrado.
 */
router.patch(
    '/:id/desactivar',
    authorize('Planes', 'Editar'),
    planController.desactivar
);

/**
 * @swagger
 * /planes/{id}:
 *   delete:
 *     summary: Eliminar plan
 *     tags: [Planes]
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
 *         description: Plan eliminado correctamente.
 *       400:
 *         description: No se puede eliminar porque existen empresas asociadas.
 *       404:
 *         description: Plan no encontrado.
 */
router.delete(
    '/:id',
    authorize('Planes', 'Eliminar'),
    planController.eliminar
);

export default router;