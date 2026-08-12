/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,nombre]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Categoria" ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "color" TEXT DEFAULT '#2563EB',
ADD COLUMN     "icono" TEXT,
ADD COLUMN     "orden" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Categoria_empresaId_idx" ON "public"."Categoria"("empresaId");

-- CreateIndex
CREATE INDEX "Categoria_nombre_idx" ON "public"."Categoria"("nombre");

-- CreateIndex
CREATE INDEX "Categoria_estado_idx" ON "public"."Categoria"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_empresaId_nombre_key" ON "public"."Categoria"("empresaId", "nombre");
