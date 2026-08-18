"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data = null, message = 'Operación realizada correctamente.', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    static error(res, message = 'Ha ocurrido un error.', statusCode = 500, errors = []) {
        return res.status(statusCode).json({
            success: false,
            message,
            ...(errors.length > 0 ? { errors } : {})
        });
    }
}
exports.ApiResponse = ApiResponse;
