"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarConsultaAuditoria = void 0;
const zod_1 = require("zod");
const auditoria_dto_1 = require("../dto/auditoria.dto");
const api_response_1 = require("../../../utils/api-response");
const validarConsultaAuditoria = (req, res, next) => {
    try {
        auditoria_dto_1.AuditoriaQuerySchema.parse(req.query);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return api_response_1.ApiResponse.error(res, 'Parámetros de consulta inválidos.', 400, error.issues.map(issue => ({
                campo: issue.path.join('.'),
                mensaje: issue.message
            })));
        }
        next(error);
    }
};
exports.validarConsultaAuditoria = validarConsultaAuditoria;
