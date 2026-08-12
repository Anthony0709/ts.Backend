import {
    CrearSuscripcionSchema,
    ActualizarSuscripcionSchema,
    ConsultarSuscripcionesSchema,
    ObtenerSuscripcionSchema,
    CambiarEstadoSuscripcionSchema
} from '../dto/suscripcion.dto';

export const validarCrearSuscripcion = CrearSuscripcionSchema;
export const validarActualizarSuscripcion = ActualizarSuscripcionSchema;
export const validarConsultarSuscripciones = ConsultarSuscripcionesSchema;
export const validarObtenerSuscripcion = ObtenerSuscripcionSchema;
export const validarCambiarEstadoSuscripcion = CambiarEstadoSuscripcionSchema;