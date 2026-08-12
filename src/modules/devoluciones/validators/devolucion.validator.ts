import {
    CrearDevolucionSchema,
    ActualizarDevolucionSchema,
    ConsultarDevolucionesSchema
} from '../dto/devolucion.dto';


/*=====================================================
==================== CREAR ============================
=====================================================*/

export const validarCrearDevolucion =
    CrearDevolucionSchema;


/*=====================================================
================== ACTUALIZAR =========================
=====================================================*/

export const validarActualizarDevolucion =
    ActualizarDevolucionSchema;


/*=====================================================
==================== CONSULTAR ========================
=====================================================*/

export const validarConsultarDevoluciones =
    ConsultarDevolucionesSchema;