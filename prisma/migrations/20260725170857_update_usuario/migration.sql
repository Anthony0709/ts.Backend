/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Usuario_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_empresaId_email_key" ON "public"."Usuario"("empresaId", "email");
