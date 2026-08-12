/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nombre_key" ON "public"."Empresa"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_email_key" ON "public"."Empresa"("email");
