"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const api_response_1 = require("../utils/api-response");
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map(issue => ({
            campo: issue.path.join('.'),
            mensaje: issue.message,
            codigo: issue.code
        }));
        return api_response_1.ApiResponse.error(res, 'Datos inválidos.', 400, errors);
    }
    req.body = result.data;
    next();
};
exports.validate = validate;
