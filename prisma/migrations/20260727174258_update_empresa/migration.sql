/*
  Warnings:

  - You are about to drop the column `logo` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `moneda` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `zonaHoraria` on the `Empresa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Empresa" DROP COLUMN "logo",
DROP COLUMN "moneda",
DROP COLUMN "zonaHoraria";
