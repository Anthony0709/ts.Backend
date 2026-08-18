"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empresa_controller_1 = require("../controllers/empresa.controller");
const empresa_validator_1 = require("../validators/empresa.validator");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
const controller = new empresa_controller_1.EmpresaController();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * tags:
 *   - name: Empresas
 *     description: Gestión de empresas
 */
/**
 * @swagger
 * /empresas:
 *   get:
 *     summary: Obtener empresas
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de registros por página.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por nombre, nombre comercial, RUC o email.
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtra empresas activas o inactivas.
 *       - in: query
 *         name: ciudad
 *         schema:
 *           type: string
 *       - in: query
 *         name: pais
 *         schema:
 *           type: string
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [nombre, nombreComercial, ruc, email, ciudad, pais, activo, createdAt, updatedAt]
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Empresas obtenidas correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Empresas', 'Ver'), controller.obtenerTodos);
/**
 * @swagger
 * /empresas/{id}:
 *   get:
 *     summary: Obtener empresa por ID
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa.
 *     responses:
 *       200:
 *         description: Empresa obtenida correctamente.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Empresa no encontrada.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Empresas', 'Ver'), controller.obtenerPorId);
/**
 * @swagger
 * /empresas:
 *   post:
 *     summary: Crear empresa
 *     tags: [Empresas]
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
 *               - ruc
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 150
 *                 example: Empresa Demo S.A.
 *               nombreComercial:
 *                 type: string
 *                 maxLength: 150
 *                 example: Empresa Demo
 *               ruc:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 20
 *                 example: "1799999999001"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: contacto@empresa.com
 *               telefono:
 *                 type: string
 *                 maxLength: 20
 *                 example: "0999999999"
 *               direccion:
 *                 type: string
 *                 maxLength: 255
 *                 example: Av. Principal 123
 *               ciudad:
 *                 type: string
 *                 maxLength: 100
 *                 example: Quito
 *               pais:
 *                 type: string
 *                 maxLength: 100
 *                 example: Ecuador
 *               sitioWeb:
 *                 type: string
 *                 format: uri
 *                 example: https://empresa.com
 *     responses:
 *       201:
 *         description: Empresa creada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       409:
 *         description: La empresa, RUC o email ya existe.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Empresas', 'Crear'), (0, validate_middleware_1.validate)(empresa_validator_1.crearEmpresaSchema), controller.crear);
/**
 * @swagger
 * /empresas/{id}:
 *   put:
 *     summary: Actualizar empresa
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 150
 *               nombreComercial:
 *                 type: string
 *                 maxLength: 150
 *               ruc:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 20
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *                 maxLength: 20
 *               direccion:
 *                 type: string
 *                 maxLength: 255
 *               ciudad:
 *                 type: string
 *                 maxLength: 100
 *               pais:
 *                 type: string
 *                 maxLength: 100
 *               sitioWeb:
 *                 type: string
 *                 format: uri
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Empresa actualizada correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Empresa no encontrada.
 *       409:
 *         description: RUC, nombre o email ya registrado.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Empresas', 'Editar'), (0, validate_middleware_1.validate)(empresa_validator_1.actualizarEmpresaSchema), controller.actualizar);
/**
 * @swagger
 * /empresas/{id}:
 *   delete:
 *     summary: Desactivar empresa
 *     tags: [Empresas]
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
 *         description: Empresa desactivada correctamente.
 *       400:
 *         description: La empresa ya está desactivada.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Empresa no encontrada.
 */
router.delete('/:id', (0, authorize_middleware_1.authorize)('Empresas', 'Eliminar'), controller.eliminar);
/**
 * @swagger
 * /empresas/{id}/reactivar:
 *   patch:
 *     summary: Reactivar empresa
 *     tags: [Empresas]
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
 *         description: Empresa reactivada correctamente.
 *       400:
 *         description: La empresa ya se encuentra activa.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Sin permisos.
 *       404:
 *         description: Empresa no encontrada.
 */
router.patch('/:id/reactivar', (0, authorize_middleware_1.authorize)('Empresas', 'Editar'), controller.reactivar);
exports.default = router;
