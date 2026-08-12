import { Prisma, TipoAuditoria } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearEmpresaDto, ActualizarEmpresaDto } from '../dto/empresa.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { buildSearch } from '../../../utils/search';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class EmpresaService {
    private async obtenerEmpresa(id: string) {
        const empresa = await prisma.empresa.findUnique({
            where: { id }
        });

        if (!empresa) {
            throw new AppError('Empresa no encontrada.', 404);
        }

        return empresa;
    }

    private normalizarEmail(email?: string) {
        return email?.trim().toLowerCase();
    }

    private async validarNombre(nombre: string, id?: string) {
        const existe = await prisma.empresa.findFirst({
            where: {
                nombre: {
                    equals: nombre.trim(),
                    mode: 'insensitive'
                },
                ...(id ? { NOT: { id } } : {})
            }
        });

        if (existe) {
            throw new AppError(
                'Ya existe una empresa con ese nombre.',
                409
            );
        }
    }

    private async validarRuc(ruc: string, id?: string) {
        const existe = await prisma.empresa.findFirst({
            where: {
                ruc: ruc.trim(),
                ...(id ? { NOT: { id } } : {})
            }
        });

        if (existe) {
            throw new AppError(
                'El RUC ya está registrado.',
                409
            );
        }
    }

    private async validarEmail(
        email?: string,
        id?: string
    ) {
        if (!email) return;

        const emailNormalizado =
            this.normalizarEmail(email);

        const existe = await prisma.empresa.findFirst({
            where: {
                email: {
                    equals: emailNormalizado,
                    mode: 'insensitive'
                },
                ...(id ? { NOT: { id } } : {})
            }
        });

        if (existe) {
            throw new AppError(
                'El correo electrónico ya está registrado.',
                409
            );
        }
    }

    private obtenerOrderBy(
        orderBy?: string,
        order?: 'asc' | 'desc'
    ): Prisma.EmpresaOrderByWithRelationInput {
        const camposPermitidos = [
            'nombre',
            'nombreComercial',
            'ruc',
            'email',
            'ciudad',
            'pais',
            'activo',
            'createdAt',
            'updatedAt'
        ];

        const campo =
            orderBy && camposPermitidos.includes(orderBy)
                ? orderBy
                : 'createdAt';

        return {
            [campo]:
                order === 'asc'
                    ? 'asc'
                    : 'desc'
        };
    }

    async obtenerTodos(query: any) {
        const {
            page,
            limit,
            search,
            skip,
            take
        } = buildQuery(query);

        const where: Prisma.EmpresaWhereInput = {
            ...(query.activo !== undefined && {
                activo:
                    query.activo === true ||
                    query.activo === 'true'
            }),
            ...(query.pais && {
                pais: query.pais
            }),
            ...(query.ciudad && {
                ciudad: query.ciudad
            }),
            ...buildSearch(search, [
                'nombre',
                'nombreComercial',
                'ruc',
                'email'
            ])
        };

        const orderBy = this.obtenerOrderBy(
            query.orderBy,
            query.order
        );

        const [empresas, total] =
            await prisma.$transaction([
                prisma.empresa.findMany({
                    where,
                    skip,
                    take,
                    orderBy,
                    include: {
                        configuracion: true
                    }
                }),
                prisma.empresa.count({
                    where
                })
            ]);

        return paginatedResponse(
            empresas,
            total,
            page,
            limit
        );
    }

    async obtenerPorId(id: string) {
        const empresa =
            await prisma.empresa.findUnique({
                where: { id },
                include: {
                    configuracion: true
                }
            });

        if (!empresa) {
            throw new AppError(
                'Empresa no encontrada.',
                404
            );
        }

        return empresa;
    }

    async crear(
        data: CrearEmpresaDto,
        usuario: Express.UserPayload
    ) {
        const nombre = data.nombre.trim();
        const ruc = data.ruc.trim();
        const email =
            this.normalizarEmail(data.email);

        await this.validarNombre(nombre);
        await this.validarRuc(ruc);
        await this.validarEmail(email);

        return await prisma.$transaction(
            async tx => {
                const empresa =
                    await tx.empresa.create({
                        data: {
                            nombre,
                            nombreComercial:
                                data.nombreComercial?.trim(),
                            ruc,
                            email,
                            telefono:
                                data.telefono?.trim(),
                            direccion:
                                data.direccion?.trim(),
                            ciudad:
                                data.ciudad?.trim(),
                            pais:
                                data.pais?.trim(),
                            sitioWeb:
                                data.sitioWeb?.trim()
                        }
                    });

                await tx.configuracion.create({
                    data: {
                        empresaId: empresa.id
                    }
                });

                await tx.auditoria.create({
                    data: {
                        empresaId: empresa.id,
                        usuarioId: usuario.id,
                        modulo: 'EMPRESA',
                        accion: TipoAuditoria.CREATE,
                        descripcion:
                            `Empresa "${empresa.nombre}" creada.`,
                        registroId: empresa.id
                    }
                });

                return tx.empresa.findUnique({
                    where: {
                        id: empresa.id
                    },
                    include: {
                        configuracion: true
                    }
                });
            }
        );
    }

    async actualizar(
        id: string,
        data: ActualizarEmpresaDto,
        usuario: Express.UserPayload
    ) {
        const empresa =
            await this.obtenerEmpresa(id);

        if (data.nombre) {
            await this.validarNombre(
                data.nombre,
                id
            );
        }

        if (data.ruc) {
            await this.validarRuc(
                data.ruc,
                id
            );
        }

        if (data.email) {
            await this.validarEmail(
                data.email,
                id
            );
        }

        const actualizada =
            await prisma.$transaction(
                async tx => {
                    const resultado =
                        await tx.empresa.update({
                            where: { id },
                            data: {
                                ...(data.nombre !== undefined && {
                                    nombre:
                                        data.nombre.trim()
                                }),
                                ...(data.nombreComercial !== undefined && {
                                    nombreComercial:
                                        data.nombreComercial.trim()
                                }),
                                ...(data.ruc !== undefined && {
                                    ruc:
                                        data.ruc.trim()
                                }),
                                ...(data.email !== undefined && {
                                    email:
                                        this.normalizarEmail(
                                            data.email
                                        )
                                }),
                                ...(data.telefono !== undefined && {
                                    telefono:
                                        data.telefono.trim()
                                }),
                                ...(data.direccion !== undefined && {
                                    direccion:
                                        data.direccion.trim()
                                }),
                                ...(data.ciudad !== undefined && {
                                    ciudad:
                                        data.ciudad.trim()
                                }),
                                ...(data.pais !== undefined && {
                                    pais:
                                        data.pais.trim()
                                }),
                                ...(data.sitioWeb !== undefined && {
                                    sitioWeb:
                                        data.sitioWeb.trim()
                                }),
                                ...(data.activo !== undefined && {
                                    activo:
                                        data.activo
                                })
                            },
                            include: {
                                configuracion: true
                            }
                        });

                    await tx.auditoria.create({
                        data: {
                            empresaId: empresa.id,
                            usuarioId: usuario.id,
                            modulo: 'EMPRESA',
                            accion: TipoAuditoria.UPDATE,
                            descripcion:
                                `Empresa "${resultado.nombre}" actualizada.`,
                            registroId: empresa.id
                        }
                    });

                    return resultado;
                }
            );

        return actualizada;
    }

    async eliminar(
        id: string,
        usuario: Express.UserPayload
    ) {
        const empresa =
            await this.obtenerEmpresa(id);

        if (!empresa.activo) {
            throw new AppError(
                'La empresa ya está desactivada.',
                400
            );
        }

        const resultado =
            await prisma.$transaction(
                async tx => {
                    const actualizada =
                        await tx.empresa.update({
                            where: { id },
                            data: {
                                activo: false
                            },
                            include: {
                                configuracion: true
                            }
                        });

                    await tx.auditoria.create({
                        data: {
                            empresaId: empresa.id,
                            usuarioId: usuario.id,
                            modulo: 'EMPRESA',
                            accion: TipoAuditoria.DELETE,
                            descripcion:
                                `Empresa "${empresa.nombre}" desactivada.`,
                            registroId: empresa.id
                        }
                    });

                    return actualizada;
                }
            );

        return resultado;
    }

    async reactivar(
        id: string,
        usuario: Express.UserPayload
    ) {
        const empresa =
            await this.obtenerEmpresa(id);

        if (empresa.activo) {
            throw new AppError(
                'La empresa ya se encuentra activa.',
                400
            );
        }

        const resultado =
            await prisma.$transaction(
                async tx => {
                    const actualizada =
                        await tx.empresa.update({
                            where: { id },
                            data: {
                                activo: true
                            },
                            include: {
                                configuracion: true
                            }
                        });

                    await tx.auditoria.create({
                        data: {
                            empresaId: empresa.id,
                            usuarioId: usuario.id,
                            modulo: 'EMPRESA',
                            accion: TipoAuditoria.UPDATE,
                            descripcion:
                                `Empresa "${empresa.nombre}" reactivada.`,
                            registroId: empresa.id
                        }
                    });

                    return actualizada;
                }
            );

        return resultado;
    }
}