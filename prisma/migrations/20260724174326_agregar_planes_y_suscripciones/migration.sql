-- CreateEnum
CREATE TYPE "public"."EstadoSuscripcion" AS ENUM ('ACTIVA', 'VENCIDA', 'SUSPENDIDA', 'CANCELADA');

-- AlterTable
ALTER TABLE "public"."Auditoria" ADD COLUMN     "empresaId" TEXT,
ADD COLUMN     "registroId" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioMensual" DECIMAL(65,30) NOT NULL,
    "precioAnual" DECIMAL(65,30),
    "maxUsuarios" INTEGER,
    "maxSucursales" INTEGER,
    "maxBodegas" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Suscripcion" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "estado" "public"."EstadoSuscripcion" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Auditoria_empresaId_idx" ON "public"."Auditoria"("empresaId");

-- CreateIndex
CREATE INDEX "Auditoria_usuarioId_idx" ON "public"."Auditoria"("usuarioId");

-- CreateIndex
CREATE INDEX "Auditoria_modulo_idx" ON "public"."Auditoria"("modulo");

-- CreateIndex
CREATE INDEX "Auditoria_createdAt_idx" ON "public"."Auditoria"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Auditoria" ADD CONSTRAINT "Auditoria_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Suscripcion" ADD CONSTRAINT "Suscripcion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Suscripcion" ADD CONSTRAINT "Suscripcion_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
