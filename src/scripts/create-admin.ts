import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  //==========================
  // EMPRESA
  //==========================

  let empresa = await prisma.empresa.findFirst();

  if (!empresa) {

    empresa = await prisma.empresa.create({
      data: {
        nombre: 'Empresa Demo',
        ruc: '9999999999999',
        email: 'empresa@demo.com'
      }
    });

    console.log('✅ Empresa de prueba creada');
  }

  //==========================
  // ROL ADMIN
  //==========================

  let rol = await prisma.rol.findFirst({
    where: {
      nombre: 'ADMIN',
      empresaId: empresa.id
    }
  });

  if (!rol) {

    rol = await prisma.rol.create({
      data: {
        nombre: 'ADMIN',
        descripcion: 'Administrador del sistema',
        empresaId: empresa.id
      }
    });

    console.log('✅ Rol ADMIN creado');
  }

  //==========================
  // PASSWORD
  //==========================

  const password = await bcrypt.hash('123456', 10);

  //==========================
  // USUARIO
  //==========================

  const usuario = await prisma.usuario.findUnique({
    where: {
      empresaId_email: {
        empresaId: empresa.id,
        email: 'admin@erp.com'
      }
    }
  });

  if (!usuario) {

    await prisma.usuario.create({
      data: {
        nombres: 'Administrador',
        apellidos: 'Principal',
        email: 'admin@erp.com',
        password,
        empresaId: empresa.id,
        rolId: rol.id
      }
    });

    console.log('✅ Usuario administrador creado');

  } else {

    await prisma.usuario.update({
      where: {
        id: usuario.id
      },
      data: {
        password,
        empresaId: empresa.id,
        rolId: rol.id
      }
    });

    console.log('✅ Usuario administrador actualizado');
  }

  console.log('');
  console.log('==============================');
  console.log('Email: admin@erp.com');
  console.log('Password: 123456');
  console.log('==============================');

}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });