/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,nombre]` on the table `Rol` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rol_empresaId_nombre_key" ON "public"."Rol"("empresaId", "nombre");
