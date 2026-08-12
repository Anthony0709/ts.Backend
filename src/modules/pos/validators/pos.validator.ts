import {
    ProcesarVentaPOSSchema,
    BuscarProductosPOSSchema,
    BuscarClientesPOSSchema,
    ConsultarCajaPOSSchema,
    ConsultarResumenCajaPOSSchema
} from '../dto/pos.dto';

export const validarProcesarVentaPOS = ProcesarVentaPOSSchema;
export const validarBuscarProductosPOS = BuscarProductosPOSSchema;
export const validarBuscarClientesPOS = BuscarClientesPOSSchema;
export const validarConsultarCajaPOS = ConsultarCajaPOSSchema;
export const validarConsultarResumenCajaPOS = ConsultarResumenCajaPOSSchema;