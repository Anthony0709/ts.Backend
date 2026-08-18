"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sucursal_controller_1 = require("../controllers/sucursal.controller");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const authorize_middleware_1 = require("../../../middlewares/authorize.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/*=====================================================
======================= SWAGGER =======================
=====================================================*/
/**
 * @swagger
 * tags:
 *   name: Sucursales
 *   description: Gestión de sucursales de la empresa
 */
/*=====================================================
======================= LISTAR ========================
=====================================================*/
/**
 * @swagger
 * /sucursales:
 *   get:
 *     summary: Obtener sucursales
 *     description: Obtiene las sucursales de la empresa autenticada.
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: nombre
 *         description: Buscar por nombre.
 *         schema:
 *           type: string
 *           example: Quito
 *
 *       - in: query
 *         name: codigo
 *         description: Buscar por código.
 *         schema:
 *           type: string
 *           example: SUC-001
 *
 *       - in: query
 *         name: ciudad
 *         description: Filtrar por ciudad.
 *         schema:
 *           type: string
 *           example: Quito
 *
 *       - in: query
 *         name: estado
 *         description: Filtrar por estado.
 *         schema:
 *           type: boolean
 *           example: true
 *
 *       - in: query
 *         name: page
 *         description: Número de página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *         description: Cantidad de registros por página.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *
 *     responses:
 *
 *       200:
 *         description: Sucursales obtenidas correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: No tiene permisos.
 *
 *       500:
 *         description: Error interno.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Sucursales', 'Ver'), sucursal_controller_1.sucursalController.obtenerTodos);
/*=====================================================
====================== OBTENER ========================
=====================================================*/
/**
 * @swagger
 * /sucursales/{id}:
 *   get:
 *     summary: Obtener sucursal por ID
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sucursal.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Sucursal obtenida correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Sucursal no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.get('/:id', (0, authorize_middleware_1.authorize)('Sucursales', 'Ver'), sucursal_controller_1.sucursalController.obtenerPorId);
/*=====================================================
======================= CREAR =========================
=====================================================*/
/**
 * @swagger
 * /sucursales:
 *   post:
 *     summary: Crear sucursal
 *     description: Crea una nueva sucursal y opcionalmente asigna una bodega principal.
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             type: object
 *
 *             required:
 *               - nombre
 *               - codigo
 *
 *             properties:
 *
 *               nombre:
 *                 type: string
 *                 example: Sucursal Quito
 *
 *               codigo:
 *                 type: string
 *                 example: SUC-001
 *
 *               direccion:
 *                 type: string
 *                 example: Av. Amazonas y Naciones Unidas
 *
 *               telefono:
 *                 type: string
 *                 example: 0999999999
 *
 *               email:
 *                 type: string
 *                 example: quito@empresa.com
 *
 *               ciudad:
 *                 type: string
 *                 example: Quito
 *
 *               bodegaPrincipalId:
 *                 type: string
 *                 nullable: true
 *                 example: cm123456789abcdefghijkl
 *
 *               estado:
 *                 type: boolean
 *                 default: true
 *
 *     responses:
 *
 *       201:
 *         description: Sucursal creada correctamente.
 *
 *       400:
 *         description: Datos inválidos o sucursal duplicada.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Bodega no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.post('/', (0, authorize_middleware_1.authorize)('Sucursales', 'Crear'), sucursal_controller_1.sucursalController.crear);
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
/**
 * @swagger
 * /sucursales/{id}:
 *   put:
 *     summary: Actualizar sucursal
 *     description: Actualiza los datos de una sucursal y permite cambiar su bodega principal.
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sucursal.
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             type: object
 *
 *             properties:
 *
 *               nombre:
 *                 type: string
 *                 example: Sucursal Quito Norte
 *
 *               codigo:
 *                 type: string
 *                 example: SUC-001
 *
 *               direccion:
 *                 type: string
 *
 *               telefono:
 *                 type: string
 *
 *               email:
 *                 type: string
 *
 *               ciudad:
 *                 type: string
 *
 *               bodegaPrincipalId:
 *                 type: string
 *                 nullable: true
 *
 *               estado:
 *                 type: boolean
 *
 *     responses:
 *
 *       200:
 *         description: Sucursal actualizada correctamente.
 *
 *       400:
 *         description: Datos inválidos o bodega ocupada.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Sucursal o bodega no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Sucursales', 'Editar'), sucursal_controller_1.sucursalController.actualizar);
/*=====================================================
================== ACTIVAR / DESACTIVAR ===============
=====================================================*/
/**
 * @swagger
 * /sucursales/{id}/estado:
 *   patch:
 *     summary: Cambiar estado de sucursal
 *     description: Activa o desactiva una sucursal.
 *     tags: [Sucursales]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sucursal.
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             type: object
 *
 *             required:
 *               - estado
 *
 *             properties:
 *
 *               estado:
 *                 type: boolean
 *                 example: false
 *
 *     responses:
 *
 *       200:
 *         description: Estado actualizado correctamente.
 *
 *       400:
 *         description: Datos inválidos.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       404:
 *         description: Sucursal no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch('/:id/estado', (0, authorize_middleware_1.authorize)('Sucursales', 'Editar'), sucursal_controller_1.sucursalController.cambiarEstado);
exports.default = router;
