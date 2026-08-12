import {
    CrearSucursalSchema,
    ActualizarSucursalSchema,
    ConsultarSucursalesSchema
} from '../dto/sucursal.dto';


/*=====================================================
======================= CREAR =========================
=====================================================*/

export const validarCrearSucursal =
    CrearSucursalSchema;


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

export const validarActualizarSucursal =
    ActualizarSucursalSchema;


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const validarConsultarSucursales =
    ConsultarSucursalesSchema;