/*
  Warnings:

  - You are about to drop the column `estado` on the `Empresa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `precioMensual` to the `Suscripcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoFacturacion` to the `Suscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TipoFacturacion" AS ENUM ('MENSUAL', 'ANUAL');

-- AlterTable
ALTER TABLE "public"."Empresa" DROP COLUMN "estado",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "moneda" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "nombreComercial" TEXT,
ADD COLUMN     "pais" TEXT,
ADD COLUMN     "sitioWeb" TEXT,
ADD COLUMN     "zonaHoraria" TEXT NOT NULL DEFAULT 'America/Guayaquil';

-- AlterTable
ALTER TABLE "public"."Plan" ADD COLUMN     "codigo" TEXT;

-- AlterTable
ALTER TABLE "public"."Suscripcion" ADD COLUMN     "fechaCancelacion" TIMESTAMP(3),
ADD COLUMN     "fechaRenovacion" TIMESTAMP(3),
ADD COLUMN     "motivoCancelacion" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "precioAnual" DECIMAL(10,2),
ADD COLUMN     "precioMensual" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tipoFacturacion" "public"."TipoFacturacion" NOT NULL;

-- CreateIndex
CREATE INDEX "Empresa_activo_idx" ON "public"."Empresa"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_nombre_key" ON "public"."Plan"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_codigo_key" ON "public"."Plan"("codigo");

-- CreateIndex
CREATE INDEX "Suscripcion_empresaId_idx" ON "public"."Suscripcion"("empresaId");

-- CreateIndex
CREATE INDEX "Suscripcion_planId_idx" ON "public"."Suscripcion"("planId");

-- CreateIndex
CREATE INDEX "Suscripcion_estado_idx" ON "public"."Suscripcion"("estado");
