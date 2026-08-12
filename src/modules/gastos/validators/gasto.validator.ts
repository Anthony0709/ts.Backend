import {
    CrearGastoSchema,
    ActualizarGastoSchema,
    ConsultarGastosSchema
} from '../dto/gasto.dto';


/*=====================================================
======================= CREAR =========================
=====================================================*/

export const validarCrearGasto =
    CrearGastoSchema;


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

export const validarActualizarGasto =
    ActualizarGastoSchema;


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const validarConsultarGastos =
    ConsultarGastosSchema;