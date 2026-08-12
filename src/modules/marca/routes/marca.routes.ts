import { Router } from 'express';
import { marcaController } from '../controllers/marca.controller';
import {
    CrearMarcaSchema,
    ActualizarMarcaSchema
} from '../dto/dto.marca';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Marcas
 *   description: Gestión de marcas de productos
 */

/**
 * @swagger
 * /marcas:
 *   get:
 *     summary: Obtener marcas
 *     tags: [Marcas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Marcas obtenidas correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get(
    '/',
    authorize('Marcas', 'Ver'),
    marcaController.obtenerTodos
);

/**
 * @swagger
 * /marcas/{id}:
 *   get:
 *     summary: Obtener marca por ID
 *     tags: [Marcas]
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
 *         description: Marca obtenida correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Marca no encontrada.
 */
router.get(
    '/:id',
    authorize('Marcas', 'Ver'),
    marcaController.obtenerPorId
);

/**
 * @swagger
 * /marcas:
 *   post:
 *     summary: Crear marca
 *     tags: [Marcas]
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
 *               - empresaId
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Samsung
 *               descripcion:
 *                 type: string
 *                 example: Marca de productos electrónicos
 *               estado:
 *                 type: boolean
 *                 example: true
 *               empresaId:
 *                 type: string
 *                 example: clxxxxxxxxxxxxxxxxxxxxxxxx
 *     responses:
 *       201:
 *         description: Marca creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.post(
    '/',
    authorize('Marcas', 'Crear'),
    validate(CrearMarcaSchema),
    marcaController.crear
);

/**
 * @swagger
 * /marcas/{id}:
 *   put:
 *     summary: Actualizar marca
 *     tags: [Marcas]
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
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Marca actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Marca no encontrada.
 */
router.put(
    '/:id',
    authorize('Marcas', 'Editar'),
    validate(ActualizarMarcaSchema),
    marcaController.actualizar
);

/**
 * @swagger
 * /marcas/{id}:
 *   delete:
 *     summary: Desactivar marca
 *     tags: [Marcas]
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
 *         description: Marca desactivada correctamente.
 *       400:
 *         description: La marca ya está desactivada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Marca no encontrada.
 */
router.delete(
    '/:id',
    authorize('Marcas', 'Eliminar'),
    marcaController.eliminar
);

/**
 * @swagger
 * /marcas/{id}/reactivar:
 *   patch:
 *     summary: Reactivar marca
 *     tags: [Marcas]
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
 *         description: Marca reactivada correctamente.
 *       400:
 *         description: La marca ya está activa.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Marca no encontrada.
 */
router.patch(
    '/:id/reactivar',
    authorize('Marcas', 'Editar'),
    marcaController.reactivar
);

export default router;