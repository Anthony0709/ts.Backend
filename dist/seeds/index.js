"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permisos_seed_1 = require("./permisos.seed");
async function main() {
    console.log('======================================');
    console.log(' Iniciando Seeds EnterpriseFlow');
    console.log('======================================');
    await (0, permisos_seed_1.permisosSeed)();
    console.log('');
    console.log('======================================');
    console.log(' Seeds completados correctamente');
    console.log('======================================');
}
main()
    .catch(console.error);
