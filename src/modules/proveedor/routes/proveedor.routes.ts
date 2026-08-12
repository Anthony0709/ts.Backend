import { Router } from 'express';

import { proveedorController } from '../controllers/proveedor.controller';

import {
    CrearProveedorSchema,
    ActualizarProveedorSchema
} from '../dto/proveedor.dto';

import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/authorize.middleware';
import { validate } from '../../../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Proveedores
 *   description: Gestión de proveedores
 */

/**
 * @swagger
 * /proveedores:
 *   get:
 *     summary: Obtener proveedores
 *     tags: [Proveedores]
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
 *         description: Proveedores obtenidos correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get(
    '/',
    authorize('Proveedores', 'Ver'),
    proveedorController.obtenerTodos
);

/**
 * @swagger
 * /proveedores/{id}:
 *   get:
 *     summary: Obtener proveedor por ID
 *     tags: [Proveedores]
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
 *         description: Proveedor obtenido correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Proveedor no encontrado.
 */
router.get(
    '/:id',
    authorize('Proveedores', 'Ver'),
    proveedorController.obtenerPorId
);

/**
 * @swagger
 * /proveedores:
 *   post:
 *     summary: Crear proveedor
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreComercial
 *               - razonSocial
 *               - ruc
 *               - empresaId
 *             properties:
 *               nombreComercial:
 *                 type: string
 *                 example: Distribuidora ABC
 *               razonSocial:
 *                 type: string
 *                 example: Distribuidora ABC S.A.
 *               ruc:
 *                 type: string
 *                 example: 1791234567001
 *               contacto:
 *                 type: string
 *                 example: Juan Pérez
 *               cargoContacto:
 *                 type: string
 *                 example: Gerente Comercial
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ventas@proveedor.com
 *               telefono:
 *                 type: string
 *                 example: 022345678
 *               celular:
 *                 type: string
 *                 example: 0991234567
 *               direccion:
 *                 type: string
 *                 example: Av. Amazonas N34-120
 *               ciudad:
 *                 type: string
 *                 example: Quito
 *               provincia:
 *                 type: string
 *                 example: Pichincha
 *               pais:
 *                 type: string
 *                 example: Ecuador
 *               observaciones:
 *                 type: string
 *               diasCredito:
 *                 type: integer
 *                 example: 30
 *               limiteCredito:
 *                 type: number
 *                 format: double
 *                 example: 5000.00
 *               estado:
 *                 type: boolean
 *                 example: true
 *               empresaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proveedor creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.post(
    '/',
    authorize('Proveedores', 'Crear'),
    validate(CrearProveedorSchema),
    proveedorController.crear
);

/**
 * @swagger
 * /proveedores/{id}:
 *   put:
 *     summary: Actualizar proveedor
 *     tags: [Proveedores]
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
 *               nombreComercial:
 *                 type: string
 *               razonSocial:
 *                 type: string
 *               ruc:
 *                 type: string
 *               contacto:
 *                 type: string
 *               cargoContacto:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *               celular:
 *                 type: string
 *               direccion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               provincia:
 *                 type: string
 *               pais:
 *                 type: string
 *               observaciones:
 *                 type: string
 *               diasCredito:
 *                 type: integer
 *               limiteCredito:
 *                 type: number
 *                 format: double
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Proveedor no encontrado.
 */
router.put(
    '/:id',
    authorize('Proveedores', 'Editar'),
    validate(ActualizarProveedorSchema),
    proveedorController.actualizar
);

/**
 * @swagger
 * /proveedores/{id}:
 *   delete:
 *     summary: Desactivar proveedor
 *     tags: [Proveedores]
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
 *         description: Proveedor desactivado correctamente.
 *       400:
 *         description: El proveedor ya está desactivado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Proveedor no encontrado.
 */
router.delete(
    '/:id',
    authorize('Proveedores', 'Eliminar'),
    proveedorController.eliminar
);

/**
 * @swagger
 * /proveedores/{id}/reactivar:
 *   patch:
 *     summary: Reactivar proveedor
 *     tags: [Proveedores]
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
 *         description: Proveedor reactivado correctamente.
 *       400:
 *         description: El proveedor ya está activo.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Proveedor no encontrado.
 */
router.patch(
    '/:id/reactivar',
    authorize('Proveedores', 'Editar'),
    proveedorController.reactivar
);

export default router;