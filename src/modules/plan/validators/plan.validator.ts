import {
    CrearPlanSchema,
    ActualizarPlanSchema,
    ConsultarPlanesSchema,
    ObtenerPlanSchema
} from '../dto/plan.dto';
export const validarCrearPlan = CrearPlanSchema;
export const validarActualizarPlan = ActualizarPlanSchema;
export const validarConsultarPlanes = ConsultarPlanesSchema;
export const validarObtenerPlan = ObtenerPlanSchema;