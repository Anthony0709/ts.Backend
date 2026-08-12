export function generarSku(): string {

    return `SKU-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

}

export function generarCodigoBarras(): string {

    const numero = Date.now().toString();

    return numero.substring(numero.length - 13).padStart(13, '7');

}