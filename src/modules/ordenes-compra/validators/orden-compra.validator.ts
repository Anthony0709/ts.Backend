import {
    CrearOrdenCompraSchema,
    ActualizarOrdenCompraSchema,
    ConsultarOrdenesCompraSchema
} from '../dto/orden-compra.dto';


/*=====================================================
======================= CREAR =========================
=====================================================*/

export const validarCrearOrdenCompra =
    CrearOrdenCompraSchema;


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

export const validarActualizarOrdenCompra =
    ActualizarOrdenCompraSchema;


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const validarConsultarOrdenesCompra =
    ConsultarOrdenesCompraSchema;