/*
  Warnings:

  - A unique constraint covering the columns `[codigoBarras]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - Made the column `codigoBarras` on table `Producto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Producto" ALTER COLUMN "codigoBarras" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigoBarras_key" ON "public"."Producto"("codigoBarras");
