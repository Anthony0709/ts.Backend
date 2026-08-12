import { z } from 'zod';


/*=====================================================
====================== CREAR CAJA =====================
=====================================================*/

export const CrearCajaSchema = z.object({

    nombre: z
        .string()
        .trim()
        .min(
            2,
            'El nombre debe tener al menos 2 caracteres.'
        )
        .max(
            100,
            'El nombre no puede superar los 100 caracteres.'
        ),

    sucursalId: z
        .string()
        .cuid(
            'La sucursal no es válida.'
        ),

    saldoInicial: z
        .number()
        .finite(
            'El saldo inicial debe ser un número válido.'
        )
        .min(
            0,
            'El saldo inicial no puede ser negativo.'
        ),

    observacion: z
        .string()
        .trim()
        .max(
            500,
            'La observación no puede superar los 500 caracteres.'
        )
        .optional()

}).strict();


/*=====================================================
==================== ACTUALIZAR CAJA ==================
=====================================================*/

export const ActualizarCajaSchema = z.object({

    nombre: z
        .string()
        .trim()
        .min(
            2,
            'El nombre debe tener al menos 2 caracteres.'
        )
        .max(
            100,
            'El nombre no puede superar los 100 caracteres.'
        )
        .optional(),

    sucursalId: z
        .string()
        .cuid(
            'La sucursal no es válida.'
        )
        .optional(),

    observacion: z
        .string()
        .trim()
        .max(
            500,
            'La observación no puede superar los 500 caracteres.'
        )
        .optional()

}).strict();


/*=====================================================
===================== ABRIR CAJA ======================
=====================================================*/

export const AbrirCajaSchema = z.object({

    saldoInicial: z
        .number()
        .finite(
            'El saldo inicial debe ser un número válido.'
        )
        .min(
            0,
            'El saldo inicial no puede ser negativo.'
        ),

    observacion: z
        .string()
        .trim()
        .max(
            500,
            'La observación no puede superar los 500 caracteres.'
        )
        .optional()

}).strict();


/*=====================================================
===================== CERRAR CAJA =====================
=====================================================*/

export const CerrarCajaSchema = z.object({

    saldoContado: z
        .number()
        .finite(
            'El saldo contado debe ser un número válido.'
        )
        .min(
            0,
            'El saldo contado no puede ser negativo.'
        ),

    observacion: z
        .string()
        .trim()
        .max(
            500,
            'La observación no puede superar los 500 caracteres.'
        )
        .optional()

}).strict();


/*=====================================================
====================== CONSULTAR ======================
=====================================================*/

export const ConsultarCajasSchema = z.object({

    sucursalId: z
        .string()
        .cuid(
            'La sucursal no es válida.'
        )
        .optional(),

    estado: z
        .enum([
            'ABIERTA',
            'CERRADA'
        ], {
            message:
                'El estado de la caja no es válido.'
        })
        .optional(),

    nombre: z
        .string()
        .trim()
        .optional(),

    page: z
        .coerce
        .number()
        .int()
        .min(
            1,
            'La página debe ser mayor que cero.'
        )
        .optional(),

    limit: z
        .coerce
        .number()
        .int()
        .min(
            1,
            'El límite debe ser mayor que cero.'
        )
        .max(
            100,
            'El límite máximo es 100.'
        )
        .optional()

}).strict();


/*=====================================================
================ CONSULTAR MOVIMIENTOS ================
=====================================================*/

export const ConsultarMovimientosCajaSchema = z.object({

    cajaId: z
        .string()
        .cuid(
            'La caja no es válida.'
        ),

    fechaDesde: z
        .string()
        .datetime({
            message:
                'La fecha inicial no es válida.'
        })
        .optional(),

    fechaHasta: z
        .string()
        .datetime({
            message:
                'La fecha final no es válida.'
        })
        .optional(),

    page: z
        .coerce
        .number()
        .int()
        .min(
            1,
            'La página debe ser mayor que cero.'
        )
        .optional(),

    limit: z
        .coerce
        .number()
        .int()
        .min(
            1,
            'El límite debe ser mayor que cero.'
        )
        .max(
            100,
            'El límite máximo es 100.'
        )
        .optional()

}).strict().superRefine((data, ctx) => {

    if (
        !data.fechaDesde ||
        !data.fechaHasta
    ) {
        return;
    }

    const desde =
        new Date(
            data.fechaDesde
        );

    const hasta =
        new Date(
            data.fechaHasta
        );

    if (
        desde > hasta
    ) {

        ctx.addIssue({

            code: 'custom',

            path: [
                'fechaHasta'
            ],

            message:
                'La fecha final no puede ser menor que la fecha inicial.'

        });

    }

});


/*=====================================================
======================== TYPES ========================
=====================================================*/

export type CrearCajaDto =
    z.infer<
        typeof CrearCajaSchema
    >;

export type ActualizarCajaDto =
    z.infer<
        typeof ActualizarCajaSchema
    >;

export type AbrirCajaDto =
    z.infer<
        typeof AbrirCajaSchema
    >;

export type CerrarCajaDto =
    z.infer<
        typeof CerrarCajaSchema
    >;

export type ConsultarCajasDto =
    z.infer<
        typeof ConsultarCajasSchema
    >;

export type ConsultarMovimientosCajaDto =
    z.infer<
        typeof ConsultarMovimientosCajaSchema
    >;