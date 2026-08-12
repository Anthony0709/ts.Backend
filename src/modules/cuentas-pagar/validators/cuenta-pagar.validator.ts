import {
    CrearCuentaPagarSchema,
    ActualizarCuentaPagarSchema,
    ConsultarCuentasPagarSchema,
    RegistrarPagoCuentaPagarSchema,
    ConsultarPagosCuentaPagarSchema
} from '../dto/cuenta-pagar.dto';


/*=====================================================
======================= CREAR =========================
=====================================================*/

export const validarCrearCuentaPagar =
    CrearCuentaPagarSchema;


/*=====================================================
===================== ACTUALIZAR ======================
=====================================================*/

export const validarActualizarCuentaPagar =
    ActualizarCuentaPagarSchema;


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const validarConsultarCuentasPagar =
    ConsultarCuentasPagarSchema;


/*=====================================================
==================== REGISTRAR PAGO ===================
=====================================================*/

export const validarRegistrarPagoCuentaPagar =
    RegistrarPagoCuentaPagarSchema;


/*=====================================================
==================== CONSULTAR PAGOS ==================
=====================================================*/

export const validarConsultarPagosCuentaPagar =
    ConsultarPagosCuentaPagarSchema;