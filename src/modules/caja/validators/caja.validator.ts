import {
    CrearCajaSchema,
    ActualizarCajaSchema,
    AbrirCajaSchema,
    CerrarCajaSchema,
    ConsultarCajasSchema,
    ConsultarMovimientosCajaSchema
} from '../dto/caja.dto';


/*=====================================================
======================= CREAR =========================
=====================================================*/

export const validarCrearCaja =
    CrearCajaSchema;


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

export const validarActualizarCaja =
    ActualizarCajaSchema;


/*=====================================================
======================= ABRIR =========================
=====================================================*/

export const validarAbrirCaja =
    AbrirCajaSchema;


/*=====================================================
======================= CERRAR ========================
=====================================================*/

export const validarCerrarCaja =
    CerrarCajaSchema;


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const validarConsultarCajas =
    ConsultarCajasSchema;


/*=====================================================
==================== MOVIMIENTOS ======================
=====================================================*/

export const validarConsultarMovimientosCaja =
    ConsultarMovimientosCajaSchema;