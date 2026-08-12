-- CreateEnum
CREATE TYPE "public"."EstadoTransferencia" AS ENUM ('BORRADOR', 'APROBADA', 'ANULADA');

-- CreateTable
CREATE TABLE "public"."Transferencia" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bodegaOrigenId" TEXT NOT NULL,
    "bodegaDestinoId" TEXT NOT NULL,
    "estado" "public"."EstadoTransferencia" NOT NULL DEFAULT 'BORRADOR',
    "observacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transferencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TransferenciaDetalle" (
    "id" TEXT NOT NULL,
    "transferenciaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "TransferenciaDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transferencia_numero_key" ON "public"."Transferencia"("numero");

-- AddForeignKey
ALTER TABLE "public"."Transferencia" ADD CONSTRAINT "Transferencia_bodegaOrigenId_fkey" FOREIGN KEY ("bodegaOrigenId") REFERENCES "public"."Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transferencia" ADD CONSTRAINT "Transferencia_bodegaDestinoId_fkey" FOREIGN KEY ("bodegaDestinoId") REFERENCES "public"."Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransferenciaDetalle" ADD CONSTRAINT "TransferenciaDetalle_transferenciaId_fkey" FOREIGN KEY ("transferenciaId") REFERENCES "public"."Transferencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransferenciaDetalle" ADD CONSTRAINT "TransferenciaDetalle_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
