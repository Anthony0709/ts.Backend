-- CreateEnum
CREATE TYPE "public"."EstadoCaja" AS ENUM ('ABIERTA', 'CERRADA');

-- CreateEnum
CREATE TYPE "public"."TipoMovimientoCaja" AS ENUM ('INGRESO', 'EGRESO', 'AJUSTE');

-- CreateTable
CREATE TABLE "public"."Caja" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "saldoInicial" DECIMAL(10,2) NOT NULL,
    "saldoFinal" DECIMAL(10,2),
    "estado" "public"."EstadoCaja" NOT NULL DEFAULT 'CERRADA',
    "fechaApertura" TIMESTAMP(3),
    "fechaCierre" TIMESTAMP(3),
    "observacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MovimientoCaja" (
    "id" TEXT NOT NULL,
    "cajaId" TEXT NOT NULL,
    "tipo" "public"."TipoMovimientoCaja" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoCaja_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "public"."Caja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
