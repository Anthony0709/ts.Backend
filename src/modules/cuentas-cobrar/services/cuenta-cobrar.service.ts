import { Prisma, EstadoCuentaCobrar, MetodoPago } from '@prisma/client';
import prisma from '../../../config/prisma';
import { CrearCuentaCobrarDto, RegistrarAbonoCuentaCobrarDto, ConsultarCuentasCobrarDto } from '../dto/cuenta-cobrar.dto';
import { AppError } from '../../../utils/AppError';
import { buildQuery } from '../../../utils/query';
import { paginatedResponse } from '../../../utils/paginatedResponse';

export class CuentaCobrarService {
    async crear(empresaId: string, data: CrearCuentaCobrarDto) {
        if (!data.ventaId) {
            throw new AppError('La cuenta por cobrar debe estar asociada a una venta.', 400);
        }
        const cliente = await prisma.cliente.findFirst({
            where: {
                id: data.clienteId,
                empresaId,
                estado: true
            }
        });
        if (!cliente) {
            throw new AppError('El cliente no existe, está inactivo o no pertenece a la empresa.', 404);
        }
        const venta = await prisma.venta.findFirst({
            where: {
                id: data.ventaId,
                empresaId
            }
        });
        if (!venta) {
            throw new AppError('La venta no existe o no pertenece a la empresa.', 404);
        }
        const cuentaExistente = await prisma.cuentaCobrar.findUnique({
            where: {
                ventaId: data.ventaId
            }
        });
        if (cuentaExistente) {
            throw new AppError('La venta ya tiene una cuenta por cobrar asociada.', 400);
        }
        const numeroExistente = await prisma.cuentaCobrar.findFirst({
            where: {
                empresaId,
                numero: data.numeroDocumento
            }
        });
        if (numeroExistente) {
            throw new AppError('Ya existe una cuenta por cobrar con ese número de documento.', 400);
        }
        const total = new Prisma.Decimal(data.monto);
        const cuenta = await prisma.cuentaCobrar.create({
            data: {
                numero: data.numeroDocumento,
                fecha: data.fechaEmision,
                fechaVencimiento: data.fechaVencimiento,
                clienteId: data.clienteId,
                empresaId,
                ventaId: data.ventaId,
                estado: EstadoCuentaCobrar.PENDIENTE,
                total,
                saldo: total,
                observacion: data.observacion?.trim()
            },
            include: {
                cliente: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        identificacion: true,
                        razonSocial: true,
                        nombreComercial: true
                    }
                },
                venta: {
                    select: {
                        id: true,
                        numero: true,
                        fecha: true,
                        total: true,
                        estado: true
                    }
                },
                abonos: true
            }
        });
        return cuenta;
    }
    async obtenerPorId(id: string, empresaId: string) {
        const cuenta = await prisma.cuentaCobrar.findFirst({
            where: {
                id,
                empresaId
            },
            include: {
                cliente: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        identificacion: true,
                        tipoCliente: true,
                        razonSocial: true,
                        nombreComercial: true,
                        email: true,
                        telefono: true
                    }
                },
                venta: {
                    select: {
                        id: true,
                        numero: true,
                        fecha: true,
                        subtotal: true,
                        impuesto: true,
                        total: true,
                        estado: true
                    }
                },
                abonos: {
                    orderBy: {
                        fecha: 'desc'
                    }
                }
            }
        });
        if (!cuenta) {
            throw new AppError('La cuenta por cobrar no existe.', 404);
        }
        return cuenta;
    }
    async obtenerTodos(empresaId: string, query: ConsultarCuentasCobrarDto) {
        const { page, limit, skip, take, orderBy } = buildQuery(query);
        const where: Prisma.CuentaCobrarWhereInput = {
            empresaId,
            ...(query.clienteId ? {
                clienteId: query.clienteId
            } : {}),
            ...(query.ventaId ? {
                ventaId: query.ventaId
            } : {}),
            ...(query.estado ? {
                estado: query.estado as EstadoCuentaCobrar
            } : {}),
            ...(query.numeroDocumento ? {
                numero: {
                    contains: query.numeroDocumento,
                    mode: 'insensitive'
                }
            } : {}),
            ...(query.fechaDesde || query.fechaHasta ? {
                fecha: {
                    ...(query.fechaDesde ? {
                        gte: query.fechaDesde
                    } : {}),
                    ...(query.fechaHasta ? {
                        lte: query.fechaHasta
                    } : {})
                }
            } : {}),
            ...(query.vencidas ? {
                fechaVencimiento: {
                    lt: new Date()
                },
                estado: {
                    in: [
                        EstadoCuentaCobrar.PENDIENTE,
                        EstadoCuentaCobrar.PARCIAL
                    ]
                }
            } : {})
        };
        const [cuentas, total] = await prisma.$transaction([
            prisma.cuentaCobrar.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    cliente: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            identificacion: true,
                            razonSocial: true,
                            nombreComercial: true
                        }
                    },
                    venta: {
                        select: {
                            id: true,
                            numero: true,
                            fecha: true,
                            total: true,
                            estado: true
                        }
                    }
                }
            }),
            prisma.cuentaCobrar.count({
                where
            })
        ]);
        return paginatedResponse(cuentas, total, page, limit);
    }
    async registrarAbono(id: string, empresaId: string, data: RegistrarAbonoCuentaCobrarDto) {
        const cuenta = await prisma.cuentaCobrar.findFirst({
            where: {
                id,
                empresaId
            }
        });
        if (!cuenta) {
            throw new AppError('La cuenta por cobrar no existe.', 404);
        }
        if (cuenta.estado === EstadoCuentaCobrar.PAGADA) {
            throw new AppError('La cuenta por cobrar ya está pagada.', 400);
        }
        if (cuenta.estado === EstadoCuentaCobrar.VENCIDA) {
            throw new AppError('La cuenta está vencida. Debe regularizarse antes de registrar el abono.', 400);
        }
        const monto = new Prisma.Decimal(data.monto);
        if (monto.greaterThan(cuenta.saldo)) {
            throw new AppError('El monto del abono no puede ser mayor al saldo pendiente.', 400);
        }
        const saldoNuevo = cuenta.saldo.sub(monto);
        const estadoNuevo = saldoNuevo.lessThanOrEqualTo(0) ? EstadoCuentaCobrar.PAGADA : EstadoCuentaCobrar.PARCIAL;
        const resultado = await prisma.$transaction(async tx => {
            const abono = await tx.abonoCuentaCobrar.create({
                data: {
                    cuentaCobrarId: cuenta.id,
                    monto,
                    metodoPago: data.metodoPago as MetodoPago,
                    referencia: data.referencia?.trim(),
                    observacion: data.observacion?.trim()
                }
            });
            const cuentaActualizada = await tx.cuentaCobrar.update({
                where: {
                    id: cuenta.id
                },
                data: {
                    saldo: saldoNuevo,
                    estado: estadoNuevo
                },
                include: {
                    cliente: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true,
                            identificacion: true,
                            razonSocial: true,
                            nombreComercial: true
                        }
                    },
                    venta: {
                        select: {
                            id: true,
                            numero: true,
                            total: true
                        }
                    },
                    abonos: {
                        orderBy: {
                            fecha: 'desc'
                        }
                    }
                }
            });
            return {
                abono,
                cuenta: cuentaActualizada
            };
        });
        return resultado;
    }
    async obtenerAbonos(id: string, empresaId: string) {
        const cuenta = await prisma.cuentaCobrar.findFirst({
            where: {
                id,
                empresaId
            },
            select: {
                id: true
            }
        });
        if (!cuenta) {
            throw new AppError('La cuenta por cobrar no existe.', 404);
        }
        return prisma.abonoCuentaCobrar.findMany({
            where: {
                cuentaCobrarId: id
            },
            orderBy: {
                fecha: 'desc'
            }
        });
    }
    async actualizarVencidas(empresaId: string) {
        const resultado = await prisma.cuentaCobrar.updateMany({
            where: {
                empresaId,
                estado: {
                    in: [
                        EstadoCuentaCobrar.PENDIENTE,
                        EstadoCuentaCobrar.PARCIAL
                    ]
                },
                fechaVencimiento: {
                    lt: new Date()
                },
                saldo: {
                    gt: 0
                }
            },
            data: {
                estado: EstadoCuentaCobrar.VENCIDA
            }
        });
        return {
            actualizadas: resultado.count
        };
    }
}
export const cuentaCobrarService = new CuentaCobrarService();