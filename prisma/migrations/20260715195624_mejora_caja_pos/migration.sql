/*
  Warnings:

  - The `metodoPago` column on the `Gasto` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CHEQUE', 'CREDITO', 'OTRO');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."TipoMovimientoCaja" ADD VALUE 'VENTA';
ALTER TYPE "public"."TipoMovimientoCaja" ADD VALUE 'DEVOLUCION';
ALTER TYPE "public"."TipoMovimientoCaja" ADD VALUE 'GASTO';

-- AlterTable
ALTER TABLE "public"."AbonoCuentaCobrar" ADD COLUMN     "metodoPago" "public"."MetodoPago",
ADD COLUMN     "referencia" TEXT;

-- AlterTable
ALTER TABLE "public"."AbonoCuentaPagar" ADD COLUMN     "metodoPago" "public"."MetodoPago",
ADD COLUMN     "referencia" TEXT;

-- AlterTable
ALTER TABLE "public"."Caja" ADD COLUMN     "diferencia" DECIMAL(10,2),
ADD COLUMN     "saldoContado" DECIMAL(10,2),
ADD COLUMN     "saldoEsperado" DECIMAL(10,2),
ADD COLUMN     "usuarioAperturaId" TEXT,
ADD COLUMN     "usuarioCierreId" TEXT;

-- AlterTable
ALTER TABLE "public"."Gasto" DROP COLUMN "metodoPago",
ADD COLUMN     "metodoPago" "public"."MetodoPago";

-- AlterTable
ALTER TABLE "public"."MovimientoCaja" ADD COLUMN     "metodoPago" "public"."MetodoPago",
ADD COLUMN     "referencia" TEXT,
ADD COLUMN     "usuarioId" TEXT,
ADD COLUMN     "ventaId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Caja" ADD CONSTRAINT "Caja_usuarioAperturaId_fkey" FOREIGN KEY ("usuarioAperturaId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Caja" ADD CONSTRAINT "Caja_usuarioCierreId_fkey" FOREIGN KEY ("usuarioCierreId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "public"."Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovimientoCaja" ADD CONSTRAINT "MovimientoCaja_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
