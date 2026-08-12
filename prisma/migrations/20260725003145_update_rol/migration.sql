/*
  Warnings:

  - You are about to drop the column `estado` on the `Rol` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empresaId,codigo]` on the table `Rol` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Rol" DROP COLUMN "estado",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "codigo" TEXT;

-- CreateIndex
CREATE INDEX "Rol_empresaId_idx" ON "public"."Rol"("empresaId");

-- CreateIndex
CREATE INDEX "Rol_activo_idx" ON "public"."Rol"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_empresaId_codigo_key" ON "public"."Rol"("empresaId", "codigo");
