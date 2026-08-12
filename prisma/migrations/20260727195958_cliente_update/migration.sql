/*
  Warnings:

  - You are about to drop the column `apellidos` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `cedula` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `nombres` on the `Cliente` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empresaId,identificacion]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellido` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificacion` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoIdentificacion` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TipoIdentificacion" AS ENUM ('CEDULA', 'RUC', 'PASAPORTE', 'OTRO');

-- CreateEnum
CREATE TYPE "public"."TipoCliente" AS ENUM ('PERSONA', 'EMPRESA');

-- DropIndex
DROP INDEX "public"."Cliente_cedula_key";

-- AlterTable
ALTER TABLE "public"."Cliente" DROP COLUMN "apellidos",
DROP COLUMN "cedula",
DROP COLUMN "nombres",
ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "diasCredito" INTEGER,
ADD COLUMN     "identificacion" TEXT NOT NULL,
ADD COLUMN     "limiteCredito" DECIMAL(12,2),
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "nombreComercial" TEXT,
ADD COLUMN     "observacion" TEXT,
ADD COLUMN     "razonSocial" TEXT,
ADD COLUMN     "tipoCliente" "public"."TipoCliente" NOT NULL DEFAULT 'PERSONA',
ADD COLUMN     "tipoIdentificacion" "public"."TipoIdentificacion" NOT NULL;

-- CreateIndex
CREATE INDEX "Cliente_empresaId_idx" ON "public"."Cliente"("empresaId");

-- CreateIndex
CREATE INDEX "Cliente_empresaId_estado_idx" ON "public"."Cliente"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Cliente_nombre_idx" ON "public"."Cliente"("nombre");

-- CreateIndex
CREATE INDEX "Cliente_apellido_idx" ON "public"."Cliente"("apellido");

-- CreateIndex
CREATE INDEX "Cliente_identificacion_idx" ON "public"."Cliente"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_empresaId_identificacion_key" ON "public"."Cliente"("empresaId", "identificacion");
