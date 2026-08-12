-- CreateTable
CREATE TABLE "public"."Configuracion" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "iva" DECIMAL(5,2) NOT NULL DEFAULT 15,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "simboloMoneda" TEXT NOT NULL DEFAULT '$',
    "zonaHoraria" TEXT NOT NULL DEFAULT 'America/Guayaquil',
    "formatoFecha" TEXT NOT NULL DEFAULT 'dd/MM/yyyy',
    "logo" TEXT,
    "prefijoCompra" TEXT NOT NULL DEFAULT 'COM',
    "prefijoVenta" TEXT NOT NULL DEFAULT 'VEN',
    "prefijoCotizacion" TEXT NOT NULL DEFAULT 'COT',
    "prefijoGasto" TEXT NOT NULL DEFAULT 'GAS',
    "prefijoDevolucion" TEXT NOT NULL DEFAULT 'DEV',
    "prefijoTransferencia" TEXT NOT NULL DEFAULT 'TRF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Configuracion_empresaId_key" ON "public"."Configuracion"("empresaId");

-- AddForeignKey
ALTER TABLE "public"."Configuracion" ADD CONSTRAINT "Configuracion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
