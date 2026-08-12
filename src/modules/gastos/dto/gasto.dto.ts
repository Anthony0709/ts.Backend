import { z } from 'zod';


/*=====================================================
======================= CREAR =========================
=====================================================*/

export const CrearGastoSchema = z.object({

    concepto: z
        .string()
        .trim()
        .min(
            1,
            'El concepto es obligatorio.'
        )
        .max(
            200,
            'El concepto no puede superar los 200 caracteres.'
        ),

    descripcion: z
        .string()
        .trim()
        .max(
            500,
            'La descripción no puede superar los 500 caracteres.'
        )
        .optional(),

    proveedorId: z
        .string()
        .cuid(
            'Proveedor inválido.'
        )
        .optional(),

    categoria: z
        .string()
        .trim()
        .min(
            1,
            'La categoría es obligatoria.'
        )
        .max(
            100,
            'La categoría no puede superar los 100 caracteres.'
        ),

    monto: z
        .number()
        .finite(
            'El monto debe ser un número válido.'
        )
        .positive(
            'El monto debe ser mayor que cero.'
        ),

    metodoPago: z
        .enum([
            'EFECTIVO',
            'TARJETA',
            'TRANSFERENCIA',
            'CHEQUE',
            'CREDITO',
            'OTRO'
        ], {
            message:
                'Método de pago inválido.'
        })
        .optional(),

    referencia: z
        .string()
        .trim()
        .max(
            150,
            'La referencia no puede superar los 150 caracteres.'
        )
        .optional()

}).strict();


/*=====================================================
====================== ACTUALIZAR =====================
=====================================================*/

export const ActualizarGastoSchema =
    z.object({

        concepto: z
            .string()
            .trim()
            .min(
                1,
                'El concepto es obligatorio.'
            )
            .max(
                200,
                'El concepto no puede superar los 200 caracteres.'
            )
            .optional(),

        descripcion: z
            .string()
            .trim()
            .max(
                500,
                'La descripción no puede superar los 500 caracteres.'
            )
            .optional(),

        proveedorId: z
            .string()
            .cuid(
                'Proveedor inválido.'
            )
            .nullable()
            .optional(),

        categoria: z
            .string()
            .trim()
            .min(
                1,
                'La categoría es obligatoria.'
            )
            .max(
                100,
                'La categoría no puede superar los 100 caracteres.'
            )
            .optional(),

        monto: z
            .number()
            .finite(
                'El monto debe ser un número válido.'
            )
            .positive(
                'El monto debe ser mayor que cero.'
            )
            .optional(),

        metodoPago: z
            .enum([
                'EFECTIVO',
                'TARJETA',
                'TRANSFERENCIA',
                'CHEQUE',
                'CREDITO',
                'OTRO'
            ], {
                message:
                    'Método de pago inválido.'
            })
            .nullable()
            .optional(),

        referencia: z
            .string()
            .trim()
            .max(
                150,
                'La referencia no puede superar los 150 caracteres.'
            )
            .nullable()
            .optional()

    }).strict();


/*=====================================================
======================= CONSULTAR =====================
=====================================================*/

export const ConsultarGastosSchema =
    z.object({

        proveedorId: z
            .string()
            .cuid(
                'Proveedor inválido.'
            )
            .optional(),

        estado: z
            .enum([
                'PENDIENTE',
                'PAGADO',
                'ANULADO'
            ], {
                message:
                    'Estado de gasto inválido.'
            })
            .optional(),

        categoria: z
            .string()
            .trim()
            .max(
                100,
                'La categoría no puede superar los 100 caracteres.'
            )
            .optional(),

        metodoPago: z
            .enum([
                'EFECTIVO',
                'TARJETA',
                'TRANSFERENCIA',
                'CHEQUE',
                'CREDITO',
                'OTRO'
            ], {
                message:
                    'Método de pago inválido.'
            })
            .optional(),

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

        montoMinimo: z
            .coerce
            .number()
            .finite(
                'El monto mínimo no es válido.'
            )
            .nonnegative(
                'El monto mínimo no puede ser negativo.'
            )
            .optional(),

        montoMaximo: z
            .coerce
            .number()
            .finite(
                'El monto máximo no es válido.'
            )
            .nonnegative(
                'El monto máximo no puede ser negativo.'
            )
            .optional(),

        page: z
            .coerce
            .number()
            .int()
            .min(1)
            .optional(),

        limit: z
            .coerce
            .number()
            .int()
            .min(1)
            .max(100)
            .optional()

    }).strict().superRefine((data, ctx) => {

        /*---------------------------------------------
        ------------- RANGO DE FECHAS -----------------
        ---------------------------------------------*/

        if (
            data.fechaDesde &&
            data.fechaHasta
        ) {

            const desde =
                new Date(
                    data.fechaDesde
                );

            const hasta =
                new Date(
                    data.fechaHasta
                );

            if (desde > hasta) {

                ctx.addIssue({

                    code: 'custom',

                    path: [
                        'fechaHasta'
                    ],

                    message:
                        'La fecha final no puede ser menor que la fecha inicial.'

                });
            }
        }


        /*---------------------------------------------
        ------------- RANGO DE MONTOS -----------------
        ---------------------------------------------*/

        if (
            data.montoMinimo !== undefined &&
            data.montoMaximo !== undefined
        ) {

            if (
                data.montoMinimo >
                data.montoMaximo
            ) {

                ctx.addIssue({

                    code: 'custom',

                    path: [
                        'montoMaximo'
                    ],

                    message:
                        'El monto máximo no puede ser menor que el monto mínimo.'

                });
            }
        }

    });


/*=====================================================
========================= TYPES ========================
=====================================================*/

export type CrearGastoDto =
    z.infer<
        typeof CrearGastoSchema
    >;

export type ActualizarGastoDto =
    z.infer<
        typeof ActualizarGastoSchema
    >;

export type ConsultarGastosDto =
    z.infer<
        typeof ConsultarGastosSchema
    >;