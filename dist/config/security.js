"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSecurity = configureSecurity;
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
function configureSecurity(app) {
    // Helmet
    app.use((0, helmet_1.default)());
    // CORS
    app.use((0, cors_1.default)({
        origin: process.env.FRONTEND_URL || 'http://localhost:4200',
        credentials: true
    }));
    // Rate Limit
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Demasiadas solicitudes. Intente nuevamente en unos minutos.'
        }
    }));
}
