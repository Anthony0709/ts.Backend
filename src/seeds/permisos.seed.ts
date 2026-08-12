import prisma from '../config/prisma';
import { permisos } from './permisos.data';

export async function permisosSeed() {

    console.log('Creando permisos...');

    let creados = 0;

    for (const modulo of permisos) {

        for (const accion of modulo.acciones) {

            const existe = await prisma.permiso.findFirst({

                where: {

                    modulo: modulo.modulo,

                    accion

                }

            });

            if (!existe) {

                await prisma.permiso.create({

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