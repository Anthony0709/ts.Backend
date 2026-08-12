-- CreateTable
CREATE TABLE "public"."ProductoBodega" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "bodegaId" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductoBodega_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductoBodega_productoId_bodegaId_key" ON "public"."ProductoBodega"("productoId", "bodegaId");

-- AddForeignKey
ALTER TABLE "public"."ProductoBodega" ADD CONSTRAINT "ProductoBodega_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductoBodega" ADD CONSTRAINT "ProductoBodega_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "public"."Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
