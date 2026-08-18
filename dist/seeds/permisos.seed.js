"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permisosSeed = permisosSeed;
const prisma_1 = __importDefault(require("../config/prisma"));
const permisos_data_1 = require("./permisos.data");
async function permisosSeed() {
    console.log('Creando permisos...');
    let creados = 0;
    for (const modulo of permisos_data_1.permisos) {
        for (const accion of modulo.acciones) {
            const existe = await prisma_1.default.permiso.findFirst({
                where: {
                    modulo: modulo.modulo,
                    accion
                }
            });
            if (!existe) {
                await prisma_1.default.permiso.create({
                    data: {
                        modulo: modulo.modulo,
                        accion,
                        nombre: `${modulo.modulo} - ${accion}`,
                        descripcion: `${accion} en ${modulo.modulo}`
                    }
                });
                creados++;
            }
        }
    }
    console.log(`✅ ${creados} permisos creados.`);
}
