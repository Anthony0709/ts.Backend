export interface CrearUsuarioDto {
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    empresaId: string;
    rolId: string;
    activo?: boolean;
}

export interface ActualizarUsuarioDto {
    nombres?: string;
    apellidos?: string;
    email?: string;
    password?: string;
    empresaId?: string;
    rolId?: string;
    activo?: boolean;
}