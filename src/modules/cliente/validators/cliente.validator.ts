import {
    CrearClienteSchema,
    ActualizarClienteSchema
} from '../dto/cliente.dto';

export const validarCrearCliente =
    CrearClienteSchema;

export const validarActualizarCliente =
    ActualizarClienteSchema;