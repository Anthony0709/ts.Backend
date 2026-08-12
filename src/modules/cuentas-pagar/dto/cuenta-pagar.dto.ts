import { z } from 'zod';


/*=====================================================
==================== CREAR CUENTA =====================
=====================================================*/

export const CrearCuentaPagarSchema = z.object({

    compraId: z
        .string()
        .cuid('Compra inválida.'),

    fechaVencimiento: z
        .string()
        .datetime({
            message:
                'La fecha de vencimiento no es válida.'
        })
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
=================== ACTUALIZAR CUENTA =================
=====================================================*/

export const ActualizarCuentaPagarSchema =
    z.object({

        fechaVencimiento: z
            .string()
            .datetime({
                message:
                    'La fecha de vencimiento no es válida.'
            })
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
==================== CONSULTAR ========================
=====================================================*/

export const ConsultarCuentasPagarSchema =
    z.object({

        proveedorId: z
            .string()
            .cuid('Proveedor inválido.')
            .optional(),

        estado: z
            .enum([
                'PENDIENTE',
                'PARCIAL',
                'PAGADA',
                'VENCIDA'
            ], {
                message:
                    'Estado de cuenta por pagar inválido.'
            })
            .optional(),

        compraId: z
            .string()
            .cuid('Compra inválida.')
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

        vencimientoDesde: z
            .string()
            .datetime({
                message:
                    'La fecha de vencimiento inicial no es válida.'
            })
            .optional(),

        vencimientoHasta: z
            .string()
            .datetime({
                message:
                    'La fecha de vencimiento final no es válida.'
            })
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
        ----------- VALIDAR RANGO DE FECHAS -----------
        ---------------------------------------------*/

        if (
            data.fechaDesde &&
            data.fechaHasta
        ) {

            const desde =
                new Date(data.fechaDesde);

            const hasta =
                new Date(data.fechaHasta);

            if (desde > hasta) {

                ctx.addIssue({

                    code: 'custom',

                    path: ['fechaHasta'],

                    message:
                        'La fecha final no puede ser menor que la fecha inicial.'

                });
            }
        }


        /*---------------------------------------------
        ------ VALIDAR RANGO DE VENCIMIENTO -----------
        ---------------------------------------------*/

        if (
            data.vencimientoDesde &&
            data.vencimientoHasta
        ) {

            const desde =
                new Date(
                    data.vencimientoDesde
                );

            const hasta =
                new Date(
                    data.vencimientoHasta
                );

            if (desde > hasta) {

                ctx.addIssue({

                    code: 'custom',

                    path: ['vencimientoHasta'],

                    message:
                        'La fecha de vencimiento final no puede ser menor que la inicial.'

                });
            }
        }

    });


/*=====================================================
====================== REGISTRAR PAGO =================
=====================================================*/

export const RegistrarPagoCuentaPagarSchema =
    z.object({

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
===================== CONSULTAR PAGOS =================
=====================================================*/

export const ConsultarPagosCuentaPagarSchema =
    z.object({

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

        if (
            !data.fechaDesde ||
            !data.fechaHasta
        ) {
            return;
        }

        const desde =
            new Date(data.fechaDesde);

        const hasta =
            new Date(data.fechaHasta);

        if (desde > hasta) {

            ctx.addIssue({

                code: 'custom',

                path: ['fechaHasta'],

                message:
                    'La fecha final no puede ser menor que la fecha inicial.'

            });
        }

    });


/*=====================================================
======================== TYPES ========================
=====================================================*/

export type CrearCuentaPagarDto =
    z.infer<typeof CrearCuentaPagarSchema>;

export type ActualizarCuentaPagarDto =
    z.infer<typeof ActualizarCuentaPagarSchema>;

export type ConsultarCuentasPagarDto =
    z.infer<typeof ConsultarCuentasPagarSchema>;

export type RegistrarPagoCuentaPagarDto =
    z.infer<typeof RegistrarPagoCuentaPagarSchema>;

export type ConsultarPagosCuentaPagarDto =
    z.infer<typeof ConsultarPagosCuentaPagarSchema>;