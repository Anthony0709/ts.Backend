import {
    CrearCompraSchema,
    ActualizarCompraSchema,
    ConsultarComprasSchema
} from '../dto/compra.dto';


/*=====================================================
======================= CREAR =========================
=====================================================*/

export const validarCrearCompra =
    CrearCompraSchema;


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

export const validarActualizarCompra =
    ActualizarCompraSchema;


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const validarConsultarCompras =
    ConsultarComprasSchema;