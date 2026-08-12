/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,ruc]` on the table `Proveedor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Proveedor_ruc_key";

-- AlterTable
ALTER TABLE "public"."Proveedor" ADD COLUMN     "cargoContacto" TEXT,
ADD COLUMN     "celular" TEXT,
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "contacto" TEXT,
ADD COLUMN     "diasCredito" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "limiteCredito" DECIMAL(12,2),
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "pais" TEXT DEFAULT 'Ecuador',
ADD COLUMN     "provincia" TEXT;

-- CreateIndex
CREATE INDEX "Proveedor_empresaId_idx" ON "public"."Proveedor"("empresaId");

-- CreateIndex
CREATE INDEX "Proveedor_nombreComercial_idx" ON "public"."Proveedor"("nombreComercial");

-- CreateIndex
CREATE INDEX "Proveedor_razonSocial_idx" ON "public"."Proveedor"("razonSocial");

-- CreateIndex
CREATE INDEX "Proveedor_estado_idx" ON "public"."Proveedor"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_empresaId_ruc_key" ON "public"."Proveedor"("empresaId", "ruc");
