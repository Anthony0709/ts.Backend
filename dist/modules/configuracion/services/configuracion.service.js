"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuracionService = exports.ConfiguracionService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const AppError_1 = require("../../../utils/AppError");
class ConfiguracionService {
    async obtener(empresaId) {
        let configuracion = await prisma_1.default.configuracion.findUnique({
            where: {
                empresaId
            }
        });
        if (!configuracion) {
            configuracion = await prisma_1.default.configuracion.create({
                data: {
                    empresaId
                }
            });
        }
        return configuracion;
    }
    async crear(empresaId, data) {
        const existente = await prisma_1.default.configuracion.findUnique({
            where: {
                empresaId
            }
        });
        if (existente) {
            throw new AppError_1.AppError('La configuración de la empresa ya existe.', 400);
        }
        return prisma_1.default.configuracion.create({
            data: {
                empresaId,
                ...(data.logo !== undefined && { logo: data.logo }),
                moneda: data.moneda,
                simboloMoneda: data.simboloMoneda,
                iva: new client_1.Prisma.Decimal(data.iva),
                zonaHoraria: data.zonaHoraria,
                formatoFecha: data.formatoFecha,
                idioma: data.idioma,
                prefijoCompra: data.prefijoCompra,
                prefijoVenta: data.prefijoVenta,
                prefijoCotizacion: data.prefijoCotizacion,
                prefijoFactura: data.prefijoFactura,
                prefijoGasto: data.prefijoGasto,
                prefijoTransferencia: data.prefijoTransferencia,
                prefijoDevolucion: data.prefijoDevolucion,
                permitirStockNegativo: data.permitirStockNegativo,
                controlarLotes: data.controlarLotes,
                controlarSeries: data.controlarSeries,
                actualizarCostoPromedio: data.actualizarCostoPromedio,
                aprobarCompras: data.aprobarCompras,
                aprobarVentas: data.aprobarVentas,
                permitirDescuento: data.permitirDescuento,
                porcentajeMaxDescuento: new client_1.Prisma.Decimal(data.porcentajeMaxDescuento),
                dobleFactor: data.dobleFactor,
                expiracionPassword: data.expiracionPassword,
                longitudMinimaPassword: data.longitudMinimaPassword,
                intentosLogin: data.intentosLogin,
                bloqueoMinutos: data.bloqueoMinutos,
                auditoriaActiva: data.auditoriaActiva,
                diasRetencionAuditoria: data.diasRetencionAuditoria,
                enviarCorreo: data.enviarCorreo,
                enviarNotificaciones: data.enviarNotificaciones,
                mantenimiento: data.mantenimiento
            }
        });
    }
    async actualizar(empresaId, data) {
        const configuracion = await prisma_1.default.configuracion.findUnique({
            where: {
                empresaId
            }
        });
        if (!configuracion) {
            throw new AppError_1.AppError('La configuración de la empresa no existe.', 404);
        }
        return prisma_1.default.configuracion.update({
            where: {
                empresaId
            },
            data: {
                ...(data.logo !== undefined && { logo: data.logo }),
                ...(data.moneda !== undefined && { moneda: data.moneda }),
                ...(data.simboloMoneda !== undefined && { simboloMoneda: data.simboloMoneda }),
                ...(data.iva !== undefined && { iva: new client_1.Prisma.Decimal(data.iva) }),
                ...(data.zonaHoraria !== undefined && { zonaHoraria: data.zonaHoraria }),
                ...(data.formatoFecha !== undefined && { formatoFecha: data.formatoFecha }),
                ...(data.idioma !== undefined && { idioma: data.idioma }),
                ...(data.prefijoCompra !== undefined && { prefijoCompra: data.prefijoCompra }),
                ...(data.prefijoVenta !== undefined && { prefijoVenta: data.prefijoVenta }),
                ...(data.prefijoCotizacion !== undefined && { prefijoCotizacion: data.prefijoCotizacion }),
                ...(data.prefijoFactura !== undefined && { prefijoFactura: data.prefijoFactura }),
                ...(data.prefijoGasto !== undefined && { prefijoGasto: data.prefijoGasto }),
                ...(data.prefijoTransferencia !== undefined && { prefijoTransferencia: data.prefijoTransferencia }),
                ...(data.prefijoDevolucion !== undefined && { prefijoDevolucion: data.prefijoDevolucion }),
                ...(data.permitirStockNegativo !== undefined && { permitirStockNegativo: data.permitirStockNegativo }),
                ...(data.controlarLotes !== undefined && { controlarLotes: data.controlarLotes }),
                ...(data.controlarSeries !== undefined && { controlarSeries: data.controlarSeries }),
                ...(data.actualizarCostoPromedio !== undefined && { actualizarCostoPromedio: data.actualizarCostoPromedio }),
                ...(data.aprobarCompras !== undefined && { aprobarCompras: data.aprobarCompras }),
                ...(data.aprobarVentas !== undefined && { aprobarVentas: data.aprobarVentas }),
                ...(data.permitirDescuento !== undefined && { permitirDescuento: data.permitirDescuento }),
                ...(data.porcentajeMaxDescuento !== undefined && { porcentajeMaxDescuento: new client_1.Prisma.Decimal(data.porcentajeMaxDescuento) }),
                ...(data.dobleFactor !== undefined && { dobleFactor: data.dobleFactor }),
                ...(data.expiracionPassword !== undefined && { expiracionPassword: data.expiracionPassword }),
                ...(data.longitudMinimaPassword !== undefined && { longitudMinimaPassword: data.longitudMinimaPassword }),
                ...(data.intentosLogin !== undefined && { intentosLogin: data.intentosLogin }),
                ...(data.bloqueoMinutos !== undefined && { bloqueoMinutos: data.bloqueoMinutos }),
                ...(data.auditoriaActiva !== undefined && { auditoriaActiva: data.auditoriaActiva }),
                ...(data.diasRetencionAuditoria !== undefined && { diasRetencionAuditoria: data.diasRetencionAuditoria }),
                ...(data.enviarCorreo !== undefined && { enviarCorreo: data.enviarCorreo }),
                ...(data.enviarNotificaciones !== undefined && { enviarNotificaciones: data.enviarNotificaciones }),
                ...(data.mantenimiento !== undefined && { mantenimiento: data.mantenimiento })
            }
        });
    }
    async restaurar(empresaId) {
        const configuracion = await prisma_1.default.configuracion.findUnique({
            where: {
                empresaId
            }
        });
        if (!configuracion) {
            throw new AppError_1.AppError('La configuración de la empresa no existe.', 404);
        }
        return prisma_1.default.configuracion.update({
            where: {
                empresaId
            },
            data: {
                moneda: 'USD',
                simboloMoneda: '$',
                iva: new client_1.Prisma.Decimal(15),
                zonaHoraria: 'America/Guayaquil',
                formatoFecha: 'dd/MM/yyyy',
                idioma: 'es',
                prefijoCompra: 'COM',
                prefijoVenta: 'VEN',
                prefijoCotizacion: 'COT',
                prefijoFactura: 'FAC',
                prefijoGasto: 'GAS',
                prefijoTransferencia: 'TRF',
                prefijoDevolucion: 'DEV',
                permitirStockNegativo: false,
                controlarLotes: false,
                controlarSeries: false,
                actualizarCostoPromedio: true,
                aprobarCompras: false,
                aprobarVentas: false,
                permitirDescuento: true,
                porcentajeMaxDescuento: new client_1.Prisma.Decimal(20),
                dobleFactor: false,
                expiracionPassword: 90,
                longitudMinimaPassword: 8,
                intentosLogin: 5,
                bloqueoMinutos: 30,
                auditoriaActiva: true,
                diasRetencionAuditoria: 365,
                enviarCorreo: true,
                enviarNotificaciones: true,
                mantenimiento: false
            }
        });
    }
}
exports.ConfiguracionService = ConfiguracionService;
exports.configuracionService = new ConfiguracionService();
