-- CreateEnum
CREATE TYPE "public"."EstadoCuentaPagar" AS ENUM ('PENDIENTE', 'PARCIAL', 'PAGADA', 'VENCIDA');

-- CreateTable
CREATE TABLE "public"."CuentaPagar" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3),
    "proveedorId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "compraId" TEXT NOT NULL,
    "estado" "public"."EstadoCuentaPagar" NOT NULL DEFAULT 'PENDIENTE',
    "total" DECIMAL(10,2) NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL,
    "observacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuentaPagar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AbonoCuentaPagar" (
    "id" TEXT NOT NULL,
    "cuentaPagarId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(10,2) NOT NULL,
    "observacion" TEXT,

    CONSTRAINT "AbonoCuentaPagar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CuentaPagar_numero_key" ON "public"."CuentaPagar"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaPagar_compraId_key" ON "public"."CuentaPagar"("compraId");

-- AddForeignKey
ALTER TABLE "public"."CuentaPagar" ADD CONSTRAINT "CuentaPagar_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "public"."Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CuentaPagar" ADD CONSTRAINT "CuentaPagar_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CuentaPagar" ADD CONSTRAINT "CuentaPagar_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "public"."Compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AbonoCuentaPagar" ADD CONSTRAINT "AbonoCuentaPagar_cuentaPagarId_fkey" FOREIGN KEY ("cuentaPagarId") REFERENCES "public"."CuentaPagar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
