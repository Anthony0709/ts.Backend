-- CreateEnum
CREATE TYPE "public"."EstadoGasto" AS ENUM ('PENDIENTE', 'PAGADO', 'ANULADO');

-- CreateTable
CREATE TABLE "public"."Gasto" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "concepto" TEXT NOT NULL,
    "descripcion" TEXT,
    "proveedorId" TEXT,
    "empresaId" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "estado" "public"."EstadoGasto" NOT NULL DEFAULT 'PENDIENTE',
    "metodoPago" TEXT,
    "referencia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gasto_numero_key" ON "public"."Gasto"("numero");

-- AddForeignKey
ALTER TABLE "public"."Gasto" ADD CONSTRAINT "Gasto_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "public"."Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gasto" ADD CONSTRAINT "Gasto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
