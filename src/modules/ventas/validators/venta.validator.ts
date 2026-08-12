import {
    CrearVentaSchema,
    ActualizarVentaSchema,
    ConsultarVentasSchema
} from '../dto/venta.dto';


/*=====================================================
======================= CREAR =========================
=====================================================*/

export const validarCrearVenta =
    CrearVentaSchema;


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

export const validarActualizarVenta =
    ActualizarVentaSchema;


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const validarConsultarVentas =
    ConsultarVentasSchema;