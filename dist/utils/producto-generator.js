"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarSku = generarSku;
exports.generarCodigoBarras = generarCodigoBarras;
function generarSku() {
    return `SKU-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;
}
function generarCodigoBarras() {
    const numero = Date.now().toString();
    return numero.substring(numero.length - 13).padStart(13, '7');
}
