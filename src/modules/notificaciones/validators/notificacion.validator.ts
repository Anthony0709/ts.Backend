import {
    CrearNotificacionSchema,
    ActualizarNotificacionSchema,
    ConsultarNotificacionesSchema,
    ObtenerNotificacionSchema,
    MarcarNotificacionSchema
} from '../dto/notificacion.dto';

export const validarCrearNotificacion = CrearNotificacionSchema;
export const validarActualizarNotificacion = ActualizarNotificacionSchema;
export const validarConsultarNotificaciones = ConsultarNotificacionesSchema;
export const validarObtenerNotificacion = ObtenerNotificacionSchema;
export const validarMarcarNotificacion = MarcarNotificacionSchema;