/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,codigo]` on the table `Bodega` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,codigo]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,numero]` on the table `Compra` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,numero]` on the table `Cotizacion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,numero]` on the table `CuentaCobrar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,numero]` on the table `CuentaPagar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,numero]` on the table `Devolucion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,numero]` on the table `Gasto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,nombre]` on the table `Marca` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,numero]` on the table `OrdenCompra` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,codigo]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,sku]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,codigoBarras]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,numero]` on the table `Transferencia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,numero]` on the table `Venta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `empresaId` to the `Caja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Devolucion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Transferencia` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Bodega_codigo_key";

-- DropIndex
DROP INDEX "public"."Compra_numero_key";

-- DropIndex
DROP INDEX "public"."Cotizacion_numero_key";

-- DropIndex
DROP INDEX "public"."CuentaCobrar_numero_key";

-- DropIndex
DROP INDEX "public"."CuentaPagar_numero_key";

-- DropIndex
DROP INDEX "public"."Devolucion_numero_key";

-- DropIndex
DROP INDEX "public"."Gasto_numero_key";

-- DropIndex
DROP INDEX "public"."OrdenCompra_numero_key";

-- DropIndex
DROP INDEX "public"."Producto_codigoBarras_key";

-- DropIndex
DROP INDEX "public"."Producto_codigo_key";

-- DropIndex
DROP INDEX "public"."Producto_sku_key";

-- DropIndex
DROP INDEX "public"."Transferencia_numero_key";

-- DropIndex
DROP INDEX "public"."Venta_numero_key";

-- AlterTable
ALTER TABLE "public"."Caja" ADD COLUMN     "empresaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Devolucion" ADD COLUMN     "empresaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Transferencia" ADD COLUMN     "empresaId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "AbonoCuentaCobrar_cuentaCobrarId_fecha_idx" ON "public"."AbonoCuentaCobrar"("cuentaCobrarId", "fecha");

-- CreateIndex
CREATE INDEX "AbonoCuentaPagar_cuentaPagarId_fecha_idx" ON "public"."AbonoCuentaPagar"("cuentaPagarId", "fecha");

-- CreateIndex
CREATE INDEX "Auditoria_empresaId_modulo_createdAt_idx" ON "public"."Auditoria"("empresaId", "modulo", "createdAt");

-- CreateIndex
CREATE INDEX "Auditoria_empresaId_accion_createdAt_idx" ON "public"."Auditoria"("empresaId", "accion", "createdAt");

-- CreateIndex
CREATE INDEX "Bodega_empresaId_idx" ON "public"."Bodega"("empresaId");

-- CreateIndex
CREATE INDEX "Bodega_empresaId_estado_idx" ON "public"."Bodega"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Bodega_empresaId_createdAt_idx" ON "public"."Bodega"("empresaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Bodega_empresaId_codigo_key" ON "public"."Bodega"("empresaId", "codigo");

-- CreateIndex
CREATE INDEX "Caja_empresaId_idx" ON "public"."Caja"("empresaId");

-- CreateIndex
CREATE INDEX "Caja_empresaId_estado_idx" ON "public"."Caja"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Caja_empresaId_createdAt_idx" ON "public"."Caja"("empresaId", "createdAt");

-- CreateIndex
CREATE INDEX "Categoria_empresaId_estado_idx" ON "public"."Categoria"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Categoria_empresaId_createdAt_idx" ON "public"."Categoria"("empresaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_empresaId_codigo_key" ON "public"."Categoria"("empresaId", "codigo");

-- CreateIndex
CREATE INDEX "Cliente_empresaId_createdAt_idx" ON "public"."Cliente"("empresaId", "createdAt");

-- CreateIndex
CREATE INDEX "Compra_empresaId_idx" ON "public"."Compra"("empresaId");

-- CreateIndex
CREATE INDEX "Compra_empresaId_estado_idx" ON "public"."Compra"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Compra_empresaId_proveedorId_idx" ON "public"."Compra"("empresaId", "proveedorId");

-- CreateIndex
CREATE INDEX "Compra_empresaId_createdAt_idx" ON "public"."Compra"("empresaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Compra_empresaId_numero_key" ON "public"."Compra"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "CompraDetalle_compraId_idx" ON "public"."CompraDetalle"("compraId");

-- CreateIndex
CREATE INDEX "CompraDetalle_productoId_idx" ON "public"."CompraDetalle"("productoId");

-- CreateIndex
CREATE INDEX "Cotizacion_empresaId_idx" ON "public"."Cotizacion"("empresaId");

-- CreateIndex
CREATE INDEX "Cotizacion_empresaId_estado_idx" ON "public"."Cotizacion"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Cotizacion_empresaId_clienteId_idx" ON "public"."Cotizacion"("empresaId", "clienteId");

-- CreateIndex
CREATE INDEX "Cotizacion_empresaId_createdAt_idx" ON "public"."Cotizacion"("empresaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Cotizacion_empresaId_numero_key" ON "public"."Cotizacion"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "CotizacionDetalle_cotizacionId_idx" ON "public"."CotizacionDetalle"("cotizacionId");

-- CreateIndex
CREATE INDEX "CotizacionDetalle_productoId_idx" ON "public"."CotizacionDetalle"("productoId");

-- CreateIndex
CREATE INDEX "CuentaCobrar_empresaId_idx" ON "public"."CuentaCobrar"("empresaId");

-- CreateIndex
CREATE INDEX "CuentaCobrar_empresaId_estado_idx" ON "public"."CuentaCobrar"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "CuentaCobrar_empresaId_clienteId_idx" ON "public"."CuentaCobrar"("empresaId", "clienteId");

-- CreateIndex
CREATE INDEX "CuentaCobrar_empresaId_fechaVencimiento_idx" ON "public"."CuentaCobrar"("empresaId", "fechaVencimiento");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaCobrar_empresaId_numero_key" ON "public"."CuentaCobrar"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "CuentaPagar_empresaId_idx" ON "public"."CuentaPagar"("empresaId");

-- CreateIndex
CREATE INDEX "CuentaPagar_empresaId_estado_idx" ON "public"."CuentaPagar"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "CuentaPagar_empresaId_proveedorId_idx" ON "public"."CuentaPagar"("empresaId", "proveedorId");

-- CreateIndex
CREATE INDEX "CuentaPagar_empresaId_fechaVencimiento_idx" ON "public"."CuentaPagar"("empresaId", "fechaVencimiento");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaPagar_empresaId_numero_key" ON "public"."CuentaPagar"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "Devolucion_empresaId_idx" ON "public"."Devolucion"("empresaId");

-- CreateIndex
CREATE INDEX "Devolucion_empresaId_estado_idx" ON "public"."Devolucion"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Devolucion_empresaId_createdAt_idx" ON "public"."Devolucion"("empresaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Devolucion_empresaId_numero_key" ON "public"."Devolucion"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "DevolucionDetalle_devolucionId_productoId_idx" ON "public"."DevolucionDetalle"("devolucionId", "productoId");

-- CreateIndex
CREATE INDEX "Empresa_ruc_idx" ON "public"."Empresa"("ruc");

-- CreateIndex
CREATE INDEX "Empresa_createdAt_idx" ON "public"."Empresa"("createdAt");

-- CreateIndex
CREATE INDEX "Gasto_empresaId_idx" ON "public"."Gasto"("empresaId");

-- CreateIndex
CREATE INDEX "Gasto_empresaId_estado_idx" ON "public"."Gasto"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Gasto_empresaId_fecha_idx" ON "public"."Gasto"("empresaId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Gasto_empresaId_numero_key" ON "public"."Gasto"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "Marca_empresaId_idx" ON "public"."Marca"("empresaId");

-- CreateIndex
CREATE INDEX "Marca_empresaId_estado_idx" ON "public"."Marca"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Marca_empresaId_createdAt_idx" ON "public"."Marca"("empresaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Marca_empresaId_nombre_key" ON "public"."Marca"("empresaId", "nombre");

-- CreateIndex
CREATE INDEX "MovimientoCaja_cajaId_createdAt_idx" ON "public"."MovimientoCaja"("cajaId", "createdAt");

-- CreateIndex
CREATE INDEX "MovimientoCaja_usuarioId_createdAt_idx" ON "public"."MovimientoCaja"("usuarioId", "createdAt");

-- CreateIndex
CREATE INDEX "MovimientoCaja_ventaId_idx" ON "public"."MovimientoCaja"("ventaId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_productoId_bodegaId_createdAt_idx" ON "public"."MovimientoInventario"("productoId", "bodegaId", "createdAt");

-- CreateIndex
CREATE INDEX "MovimientoInventario_bodegaId_createdAt_idx" ON "public"."MovimientoInventario"("bodegaId", "createdAt");

-- CreateIndex
CREATE INDEX "Notificacion_usuarioId_leida_createdAt_idx" ON "public"."Notificacion"("usuarioId", "leida", "createdAt");

-- CreateIndex
CREATE INDEX "OrdenCompra_empresaId_idx" ON "public"."OrdenCompra"("empresaId");

-- CreateIndex
CREATE INDEX "OrdenCompra_empresaId_estado_idx" ON "public"."OrdenCompra"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "OrdenCompra_empresaId_proveedorId_idx" ON "public"."OrdenCompra"("empresaId", "proveedorId");

-- CreateIndex
CREATE INDEX "OrdenCompra_empresaId_createdAt_idx" ON "public"."OrdenCompra"("empresaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenCompra_empresaId_numero_key" ON "public"."OrdenCompra"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "OrdenCompraDetalle_ordenCompraId_idx" ON "public"."OrdenCompraDetalle"("ordenCompraId");

-- CreateIndex
CREATE INDEX "OrdenCompraDetalle_productoId_idx" ON "public"."OrdenCompraDetalle"("productoId");

-- CreateIndex
CREATE INDEX "Producto_empresaId_idx" ON "public"."Producto"("empresaId");

-- CreateIndex
CREATE INDEX "Producto_empresaId_estado_idx" ON "public"."Producto"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Producto_empresaId_categoriaId_idx" ON "public"."Producto"("empresaId", "categoriaId");

-- CreateIndex
CREATE INDEX "Producto_empresaId_marcaId_idx" ON "public"."Producto"("empresaId", "marcaId");

-- CreateIndex
CREATE INDEX "Producto_empresaId_createdAt_idx" ON "public"."Producto"("empresaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_empresaId_codigo_key" ON "public"."Producto"("empresaId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_empresaId_sku_key" ON "public"."Producto"("empresaId", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_empresaId_codigoBarras_key" ON "public"."Producto"("empresaId", "codigoBarras");

-- CreateIndex
CREATE INDEX "ProductoBodega_productoId_idx" ON "public"."ProductoBodega"("productoId");

-- CreateIndex
CREATE INDEX "ProductoBodega_bodegaId_idx" ON "public"."ProductoBodega"("bodegaId");

-- CreateIndex
CREATE INDEX "Proveedor_empresaId_estado_idx" ON "public"."Proveedor"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Proveedor_empresaId_createdAt_idx" ON "public"."Proveedor"("empresaId", "createdAt");

-- CreateIndex
CREATE INDEX "Rol_empresaId_activo_idx" ON "public"."Rol"("empresaId", "activo");

-- CreateIndex
CREATE INDEX "Rol_empresaId_createdAt_idx" ON "public"."Rol"("empresaId", "createdAt");

-- CreateIndex
CREATE INDEX "RolPermiso_permisoId_idx" ON "public"."RolPermiso"("permisoId");

-- CreateIndex
CREATE INDEX "Sucursal_empresaId_estado_idx" ON "public"."Sucursal"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Sucursal_empresaId_createdAt_idx" ON "public"."Sucursal"("empresaId", "createdAt");

-- CreateIndex
CREATE INDEX "Suscripcion_empresaId_estado_idx" ON "public"."Suscripcion"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Suscripcion_empresaId_fechaFin_idx" ON "public"."Suscripcion"("empresaId", "fechaFin");

-- CreateIndex
CREATE INDEX "Transferencia_empresaId_idx" ON "public"."Transferencia"("empresaId");

-- CreateIndex
CREATE INDEX "Transferencia_empresaId_estado_idx" ON "public"."Transferencia"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Transferencia_empresaId_createdAt_idx" ON "public"."Transferencia"("empresaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transferencia_empresaId_numero_key" ON "public"."Transferencia"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "TransferenciaDetalle_transferenciaId_productoId_idx" ON "public"."TransferenciaDetalle"("transferenciaId", "productoId");

-- CreateIndex
CREATE INDEX "Usuario_empresaId_activo_idx" ON "public"."Usuario"("empresaId", "activo");

-- CreateIndex
CREATE INDEX "Usuario_empresaId_rolId_idx" ON "public"."Usuario"("empresaId", "rolId");

-- CreateIndex
CREATE INDEX "Venta_empresaId_idx" ON "public"."Venta"("empresaId");

-- CreateIndex
CREATE INDEX "Venta_empresaId_estado_idx" ON "public"."Venta"("empresaId", "estado");

-- CreateIndex
CREATE INDEX "Venta_empresaId_clienteId_idx" ON "public"."Venta"("empresaId", "clienteId");

-- CreateIndex
CREATE INDEX "Venta_empresaId_createdAt_idx" ON "public"."Venta"("empresaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Venta_empresaId_numero_key" ON "public"."Venta"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "VentaDetalle_ventaId_idx" ON "public"."VentaDetalle"("ventaId");

-- CreateIndex
CREATE INDEX "VentaDetalle_productoId_idx" ON "public"."VentaDetalle"("productoId");

-- AddForeignKey
ALTER TABLE "public"."Caja" ADD CONSTRAINT "Caja_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transferencia" ADD CONSTRAINT "Transferencia_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Devolucion" ADD CONSTRAINT "Devolucion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
