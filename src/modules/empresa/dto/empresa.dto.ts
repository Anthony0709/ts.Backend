export interface CrearEmpresaDto {
    nombre: string;
    nombreComercial?: string;
    ruc: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    pais?: string;
    sitioWeb?: string;
}

export interface ActualizarEmpresaDto {
    nombre?: string;
    nombreComercial?: string;
    ruc?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    pais?: string;
    sitioWeb?: string;
    activo?: boolean;
}