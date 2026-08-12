import { Router } from 'express';
import { productoController } from '../controllers/producto.controller';
import {
    CrearProductoSchema,
    ActualizarProductoSchema
} from '../dto/producto.dto';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener productos
 *     tags: [Productos]
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
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: string
 *       - in: query
 *         name: marcaId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get(
    '/',
    authorize('Productos', 'Ver'),
    productoController.obtenerTodos
);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Productos]
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
 *         description: Producto obtenido correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Producto no encontrado.
 */
router.get(
    '/:id',
    authorize('Productos', 'Ver'),
    productoController.obtenerPorId
);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear producto
 *     description: El código, SKU y código de barras se generan automáticamente en el backend.
 *     tags: [Productos]
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
 *               - precioCompra
 *               - precioVenta
 *               - categoriaId
 *               - marcaId
 *               - empresaId
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Laptop Lenovo ThinkPad
 *               descripcion:
 *                 type: string
 *                 example: Laptop empresarial
 *               imagen:
 *                 type: string
 *                 format: uri
 *               precioCompra:
 *                 type: number
 *                 format: double
 *                 example: 650.00
 *               precioVenta:
 *                 type: number
 *                 format: double
 *                 example: 850.00
 *               stockMinimo:
 *                 type: integer
 *                 example: 5
 *               stockMaximo:
 *                 type: integer
 *                 example: 50
 *               estado:
 *                 type: boolean
 *                 example: true
 *               categoriaId:
 *                 type: string
 *               marcaId:
 *                 type: string
 *               empresaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.post(
    '/',
    authorize('Productos', 'Crear'),
    validate(CrearProductoSchema),
    productoController.crear
);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Productos]
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
 *               imagen:
 *                 type: string
 *                 format: uri
 *               precioCompra:
 *                 type: number
 *               precioVenta:
 *                 type: number
 *               stockMinimo:
 *                 type: integer
 *               stockMaximo:
 *                 type: integer
 *               estado:
 *                 type: boolean
 *               categoriaId:
 *                 type: string
 *               marcaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Producto no encontrado.
 */
router.put(
    '/:id',
    authorize('Productos', 'Editar'),
    validate(ActualizarProductoSchema),
    productoController.actualizar
);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Desactivar producto
 *     tags: [Productos]
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
 *         description: Producto desactivado correctamente.
 *       400:
 *         description: El producto ya está desactivado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Producto no encontrado.
 */
router.delete(
    '/:id',
    authorize('Productos', 'Eliminar'),
    productoController.eliminar
);

/**
 * @swagger
 * /productos/{id}/reactivar:
 *   patch:
 *     summary: Reactivar producto
 *     tags: [Productos]
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
 *         description: Producto reactivado correctamente.
 *       400:
 *         description: El producto ya está activo.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Producto no encontrado.
 */
router.patch(
    '/:id/reactivar',
    authorize('Productos', 'Editar'),
    productoController.reactivar
);

export default router;