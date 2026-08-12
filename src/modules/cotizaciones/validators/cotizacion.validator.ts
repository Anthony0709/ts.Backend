import {
    CrearCotizacionSchema,
    ActualizarCotizacionSchema,
    ConsultarCotizacionesSchema
} from '../dto/cotizacion.dto';


/*=====================================================
======================= CREAR =========================
=====================================================*/

export const validarCrearCotizacion =
    CrearCotizacionSchema;


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

export const validarActualizarCotizacion =
    ActualizarCotizacionSchema;


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const validarConsultarCotizaciones =
    ConsultarCotizacionesSchema;