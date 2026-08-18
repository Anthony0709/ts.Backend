"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarObtenerPlan = exports.validarConsultarPlanes = exports.validarActualizarPlan = exports.validarCrearPlan = void 0;
const plan_dto_1 = require("../dto/plan.dto");
exports.validarCrearPlan = plan_dto_1.CrearPlanSchema;
exports.validarActualizarPlan = plan_dto_1.ActualizarPlanSchema;
exports.validarConsultarPlanes = plan_dto_1.ConsultarPlanesSchema;
exports.validarObtenerPlan = plan_dto_1.ObtenerPlanSchema;
