-- CreateEnum
CREATE TYPE "public"."TipoAuditoria" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'APROBAR', 'ANULAR');

-- CreateTable
CREATE TABLE "public"."Auditoria" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "modulo" TEXT NOT NULL,
    "accion" "public"."TipoAuditoria" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Auditoria" ADD CONSTRAINT "Auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
