"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bodega_controller_1 = require("../controllers/bodega.controller");
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
 *   name: Bodegas
 *   description: Gestión de bodegas e inventario físico
 */
/*=====================================================
======================= LISTAR ========================
=====================================================*/
/**
 * @swagger
 * /bodegas:
 *   get:
 *     summary: Obtener bodegas
 *     description: Obtiene las bodegas pertenecientes a la empresa autenticada.
 *     tags: [Bodegas]
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
 *           example: Central
 *
 *       - in: query
 *         name: codigo
 *         description: Buscar por código.
 *         schema:
 *           type: string
 *           example: BOD-001
 *
 *       - in: query
 *         name: sucursalId
 *         description: Filtrar por sucursal.
 *         schema:
 *           type: string
 *           example: cm123456789abcdefghijkl
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
 *         description: Bodegas obtenidas correctamente.
 *
 *       401:
 *         description: No autenticado.
 *
 *       403:
 *         description: Sin permisos.
 *
 *       500:
 *         description: Error interno.
 */
router.get('/', (0, authorize_middleware_1.authorize)('Bodegas', 'Ver'), bodega_controller_1.bodegaController.obtenerTodos);
/*=====================================================
====================== OBTENER ========================
=====================================================*/
/**
 * @swagger
 * /bodegas/{id}:
 *   get:
 *     summary: Obtener bodega por ID
 *     tags: [Bodegas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la bodega.
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Bodega obtenida correctamente.
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
router.get('/:id', (0, authorize_middleware_1.authorize)('Bodegas', 'Ver'), bodega_controller_1.bodegaController.obtenerPorId);
/*=====================================================
======================= CREAR =========================
=====================================================*/
/**
 * @swagger
 * /bodegas:
 *   post:
 *     summary: Crear bodega
 *     description: Crea una nueva bodega y opcionalmente la asigna a una sucursal.
 *     tags: [Bodegas]
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
 *                 example: Bodega Central
 *
 *               codigo:
 *                 type: string
 *                 example: BOD-001
 *
 *               direccion:
 *                 type: string
 *                 example: Av. 10 de Agosto
 *
 *               responsable:
 *                 type: string
 *                 example: Juan Pérez
 *
 *               telefono:
 *                 type: string
 *                 example: 0999999999
 *
 *               sucursalId:
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
 *         description: Bodega creada correctamente.
 *
 *       400:
 *         description: Bodega duplicada o datos inválidos.
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
router.post('/', (0, authorize_middleware_1.authorize)('Bodegas', 'Crear'), bodega_controller_1.bodegaController.crear);
/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/
/**
 * @swagger
 * /bodegas/{id}:
 *   put:
 *     summary: Actualizar bodega
 *     description: Actualiza una bodega y permite cambiar o quitar su sucursal.
 *     tags: [Bodegas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la bodega.
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
 *                 example: Bodega Quito
 *
 *               codigo:
 *                 type: string
 *                 example: BOD-002
 *
 *               direccion:
 *                 type: string
 *
 *               responsable:
 *                 type: string
 *
 *               telefono:
 *                 type: string
 *
 *               sucursalId:
 *                 type: string
 *                 nullable: true
 *
 *               estado:
 *                 type: boolean
 *
 *     responses:
 *
 *       200:
 *         description: Bodega actualizada correctamente.
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
 *         description: Bodega o sucursal no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.put('/:id', (0, authorize_middleware_1.authorize)('Bodegas', 'Editar'), bodega_controller_1.bodegaController.actualizar);
/*=====================================================
================== ACTIVAR / DESACTIVAR ===============
=====================================================*/
/**
 * @swagger
 * /bodegas/{id}/estado:
 *   patch:
 *     summary: Cambiar estado de bodega
 *     description: Activa o desactiva una bodega.
 *     tags: [Bodegas]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la bodega.
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
 *         description: Estado de la bodega actualizado correctamente.
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
 *         description: Bodega no encontrada.
 *
 *       500:
 *         description: Error interno.
 */
router.patch('/:id/estado', (0, authorize_middleware_1.authorize)('Bodegas', 'Editar'), bodega_controller_1.bodegaController.cambiarEstado);
exports.default = router;
