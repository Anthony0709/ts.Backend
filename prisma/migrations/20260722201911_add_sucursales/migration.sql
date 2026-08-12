/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,nombre]` on the table `Sucursal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,codigo]` on the table `Sucursal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Sucursal_codigo_key";

-- AlterTable
ALTER TABLE "public"."Sucursal" ADD COLUMN     "ciudad" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sucursal_empresaId_nombre_key" ON "public"."Sucursal"("empresaId", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Sucursal_empresaId_codigo_key" ON "public"."Sucursal"("empresaId", "codigo");
