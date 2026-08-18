"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import cors from 'cors';
//import helmet from 'helmet';
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const error_middleware_1 = require("./middlewares/error.middleware");
const security_1 = require("./config/security");
const app = (0, express_1.default)();
(0, security_1.configureSecurity)(app);
//app.use(cors());
//app.use(helmet());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '5mb' }));
app.use(express_1.default.urlencoded({ limit: '5mb', extended: true }));
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use('/api/v1', routes_1.default);
app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'EnterpriseFlow ERP API funcionando 🚀',
        version: '1.0.0'
    });
});
// 👇 Siempre al final
app.use(error_middleware_1.errorHandler);
exports.default = app;
