import { TipoAuditoria } from '@prisma/client';
import { AuditoriaService } from '../modules/auditoria/services/auditoria.service';

const auditoriaService = new AuditoriaService();

export interface AuditoriaData {
    empresaId?: string;
    usuarioId?: string;
    modulo: string;
    accion: TipoAuditoria;
    descripcion: string;
    registroId?: string;
    ip?: string;
    userAgent?: string;
}

export async function registrarAuditoria(
    data: AuditoriaData
): Promise<void> {
    try {
        await auditoriaService.registrar(data);
    } catch (error) {
        console.error(
            'ERROR AL REGISTRAR AUDITORÍA:',
            error
        );
    }
}