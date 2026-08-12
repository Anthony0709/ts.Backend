import {
    CrearCuentaCobrarSchema,
    RegistrarAbonoCuentaCobrarSchema,
    ConsultarCuentasCobrarSchema,
    ObtenerCuentaCobrarSchema
} from '../dto/cuenta-cobrar.dto';

export const validarCrearCuentaCobrar = CrearCuentaCobrarSchema;
export const validarRegistrarAbonoCuentaCobrar = RegistrarAbonoCuentaCobrarSchema;
export const validarConsultarCuentasCobrar = ConsultarCuentasCobrarSchema;
export const validarObtenerCuentaCobrar = ObtenerCuentaCobrarSchema;