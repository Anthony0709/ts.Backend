"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarAuditoria = registrarAuditoria;
const auditoria_service_1 = require("../modules/auditoria/services/auditoria.service");
const auditoriaService = new auditoria_service_1.AuditoriaService();
async function registrarAuditoria(data) {
    try {
        await auditoriaService.registrar(data);
    }
    catch (error) {
        console.error('ERROR AL REGISTRAR AUDITORÍA:', error);
    }
}
