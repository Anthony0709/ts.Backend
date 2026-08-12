-- CreateEnum
CREATE TYPE "public"."EstadoCuentaCobrar" AS ENUM ('PENDIENTE', 'PARCIAL', 'PAGADA', 'VENCIDA');

-- CreateTable
CREATE TABLE "public"."CuentaCobrar" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3),
    "clienteId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "ventaId" TEXT NOT NULL,
    "estado" "public"."EstadoCuentaCobrar" NOT NULL DEFAULT 'PENDIENTE',
    "total" DECIMAL(10,2) NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL,
    "observacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuentaCobrar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AbonoCuentaCobrar" (
    "id" TEXT NOT NULL,
    "cuentaCobrarId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(10,2) NOT NULL,
    "observacion" TEXT,

    CONSTRAINT "AbonoCuentaCobrar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CuentaCobrar_numero_key" ON "public"."CuentaCobrar"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaCobrar_ventaId_key" ON "public"."CuentaCobrar"("ventaId");

-- AddForeignKey
ALTER TABLE "public"."CuentaCobrar" ADD CONSTRAINT "CuentaCobrar_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CuentaCobrar" ADD CONSTRAINT "CuentaCobrar_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CuentaCobrar" ADD CONSTRAINT "CuentaCobrar_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "public"."Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AbonoCuentaCobrar" ADD CONSTRAINT "AbonoCuentaCobrar_cuentaCobrarId_fkey" FOREIGN KEY ("cuentaCobrarId") REFERENCES "public"."CuentaCobrar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
