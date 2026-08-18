"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cliente_controller_1 = require("../controllers/cliente.controller");
const cliente_dto_1 = require("../dto/cliente.dto");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de clientes
 */
/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtener clientes
 *     tags: [Clientes]
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
 *         name: tipoCliente
 *         schema:
 *           type: string
 *           enum:
 *             - PERSONA
 *             - EMPRESA
 *       - in: query
 *         name: tipoIdentificacion
 *         schema:
 *           type: string
 *           enum:
 *             - CEDULA
 *             - RUC
 *             - PASAPORTE
 *             - OTRO
 *     responses:
 *       200:
 *         description: Clientes obtenidos correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Clientes', 'Ver'), cliente_controller_1.clienteController.obtenerTodos);
/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Clientes]
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
 *         description: Cliente obtenido correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Cliente no encontrado.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Clientes', 'Ver'), cliente_controller_1.clienteController.obtenerPorId);
/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crear cliente
 *     tags: [Clientes]
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
 *               - apellido
 *               - tipoIdentificacion
 *               - identificacion
 *               - empresaId
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               tipoIdentificacion:
 *                 type: string
 *                 enum:
 *                   - CEDULA
 *                   - RUC
 *                   - PASAPORTE
 *                   - OTRO
 *                 example: CEDULA
 *               identificacion:
 *                 type: string
 *                 example: 0102030405
 *               tipoCliente:
 *                 type: string
 *                 enum:
 *                   - PERSONA
 *                   - EMPRESA
 *                 example: PERSONA
 *               razonSocial:
 *                 type: string
 *               nombreComercial:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               limiteCredito:
 *                 type: number
 *                 format: double
 *                 example: 1000.00
 *               diasCredito:
 *                 type: integer
 *                 example: 30
 *               observacion:
 *                 type: string
 *               estado:
 *                 type: boolean
 *                 example: true
 *               empresaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Clientes', 'Crear'), (0, validate_middleware_1.validate)(cliente_dto_1.CrearClienteSchema), cliente_controller_1.clienteController.crear);
/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualizar cliente
 *     tags: [Clientes]
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
 *               apellido:
 *                 type: string
 *               tipoIdentificacion:
 *                 type: string
 *                 enum:
 *                   - CEDULA
 *                   - RUC
 *                   - PASAPORTE
 *                   - OTRO
 *               identificacion:
 *                 type: string
 *               tipoCliente:
 *                 type: string
 *                 enum:
 *                   - PERSONA
 *                   - EMPRESA
 *               razonSocial:
 *                 type: string
 *               nombreComercial:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               limiteCredito:
 *                 type: number
 *                 format: double
 *               diasCredito:
 *                 type: integer
 *               observacion:
 *                 type: string
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Cliente no encontrado.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Clientes', 'Editar'), (0, validate_middleware_1.validate)(cliente_dto_1.ActualizarClienteSchema), cliente_controller_1.clienteController.actualizar);
/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Desactivar cliente
 *     tags: [Clientes]
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
 *         description: Cliente desactivado correctamente.
 *       400:
 *         description: El cliente ya está desactivado.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Cliente no encontrado.
 */
router.delete('/:id', (0, authorize_middleware_1.authorize)('Clientes', 'Eliminar'), cliente_controller_1.clienteController.eliminar);
/**
 * @swagger
 * /clientes/{id}/reactivar:
 *   patch:
 *     summary: Reactivar cliente
 *     tags: [Clientes]
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
 *         description: Cliente reactivado correctamente.
 *       400:
 *         description: El cliente ya está activo.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Cliente no encontrado.
 */
router.patch('/:id/reactivar', (0, authorize_middleware_1.authorize)('Clientes', 'Editar'), cliente_controller_1.clienteController.reactivar);
exports.default = router;
