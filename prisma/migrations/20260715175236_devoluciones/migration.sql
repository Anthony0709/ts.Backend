-- CreateEnum
CREATE TYPE "public"."TipoDevolucion" AS ENUM ('COMPRA', 'VENTA');

-- CreateEnum
CREATE TYPE "public"."EstadoDevolucion" AS ENUM ('BORRADOR', 'APROBADA', 'ANULADA');

-- CreateTable
CREATE TABLE "public"."Devolucion" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" "public"."TipoDevolucion" NOT NULL,
    "estado" "public"."EstadoDevolucion" NOT NULL DEFAULT 'BORRADOR',
    "ventaId" TEXT,
    "compraId" TEXT,
    "bodegaId" TEXT NOT NULL,
    "observacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Devolucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DevolucionDetalle" (
    "id" TEXT NOT NULL,
    "devolucionId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "DevolucionDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Devolucion_numero_key" ON "public"."Devolucion"("numero");

-- AddForeignKey
ALTER TABLE "public"."Devolucion" ADD CONSTRAINT "Devolucion_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "public"."Venta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Devolucion" ADD CONSTRAINT "Devolucion_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "public"."Compra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Devolucion" ADD CONSTRAINT "Devolucion_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "public"."Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DevolucionDetalle" ADD CONSTRAINT "DevolucionDetalle_devolucionId_fkey" FOREIGN KEY ("devolucionId") REFERENCES "public"."Devolucion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DevolucionDetalle" ADD CONSTRAINT "DevolucionDetalle_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
