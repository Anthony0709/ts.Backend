import {
    CrearInventarioSchema,
    AjustarInventarioSchema,
    ActualizarInventarioSchema,
    ConsultarInventarioSchema
} from '../dto/inventario.dto';


export const validarCrearInventario =
    CrearInventarioSchema;


export const validarAjustarInventario =
    AjustarInventarioSchema;


export const validarActualizarInventario =
    ActualizarInventarioSchema;


export const validarConsultarInventario =
    ConsultarInventarioSchema;