import {
    CrearBodegaSchema,
    ActualizarBodegaSchema,
    ConsultarBodegasSchema
} from '../dto/bodega.dto';


/*=====================================================
======================= CREAR =========================
=====================================================*/

export const validarCrearBodega =
    CrearBodegaSchema;


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

export const validarActualizarBodega =
    ActualizarBodegaSchema;


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const validarConsultarBodegas =
    ConsultarBodegasSchema;