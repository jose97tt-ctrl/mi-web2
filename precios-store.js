// Capa de persistencia de precios: guarda ajustes en localStorage y los aplica
// sobre el objeto `productos`, soportando precio simple y array de precios.
(function () {

    const CLAVE = "preciosOverrides";

    function cargar() {
        try {
            return JSON.parse(localStorage.getItem(CLAVE)) || {};
        } catch (e) {
            return {};
        }
    }

    function guardar(overrides) {
        localStorage.setItem(CLAVE, JSON.stringify(overrides));
    }

    function limpiar() {
        localStorage.removeItem(CLAVE);
    }

    function aplicar(datos, overrides) {

        for (const id in overrides) {

            const producto = datos[id];
            if (!producto) continue;

            const ajuste = overrides[id];

            // Productos con array de precios por tamaño.
            if (Array.isArray(producto.precios) && ajuste.precios) {

                for (const indice in ajuste.precios) {

                    const valor = ajuste.precios[indice];

                    if (producto.precios[indice] && !isNaN(valor)) {
                        producto.precios[indice].precio = valor;
                    }
                }
            }

            // Productos con precio simple (incluye tipo "unidad").
            if (ajuste.precio != null && !isNaN(ajuste.precio) && producto.precio != null) {
                producto.precio = ajuste.precio;
            }
        }
    }

    // Aplica los ajustes guardados en cuanto se carga el catálogo.
    if (typeof productos !== "undefined") {
        aplicar(productos, cargar());
    }

    window.PreciosStore = { cargar, guardar, limpiar, aplicar };

})();
