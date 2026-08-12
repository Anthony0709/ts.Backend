import {
    CrearTransferenciaSchema,
    ConsultarTransferenciasSchema
} from '../dto/transferencia.dto';


export const validarCrearTransferencia =
    CrearTransferenciaSchema;


export const validarConsultarTransferencias =
    ConsultarTransferenciasSchema;