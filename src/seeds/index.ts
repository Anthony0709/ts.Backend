import { permisosSeed } from "./permisos.seed";

async function main() {

  console.log('======================================');
  console.log(' Iniciando Seeds EnterpriseFlow');
  console.log('======================================');

  await permisosSeed();

  console.log('');
  console.log('======================================');
  console.log(' Seeds completados correctamente');
  console.log('======================================');

}

main()
  .catch(console.error);