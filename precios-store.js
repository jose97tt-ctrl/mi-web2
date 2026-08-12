// Capa de persistencia de precios: guarda ajustes en una fuente compartida
// y los aplica sobre el objeto `productos`, soportando precio simple y array de precios.
(function () {

    const CLAVE = "preciosOverrides";
    const API_URL = "/api/precios";

    async function cargar() {
        try {
            const respuesta = await fetch(API_URL, { cache: "no-store" });
            if (!respuesta.ok) throw new Error("No se pudo leer");
            return await respuesta.json();
        } catch (e) {
            try {
                return JSON.parse(localStorage.getItem(CLAVE)) || {};
            } catch (err) {
                return {};
            }
        }
    }

    async function guardar(overrides) {
        try {
            const respuesta = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(overrides)
            });
            if (respuesta.ok) {
                localStorage.setItem(CLAVE, JSON.stringify(overrides));
                return;
            }
        } catch (e) {}

        localStorage.setItem(CLAVE, JSON.stringify(overrides));
    }

    async function limpiar() {
        try {
            await fetch(API_URL, { method: "DELETE", cache: "no-store" });
        } catch (e) {}
        localStorage.removeItem(CLAVE);
    }

    function notificarCambios() {
        if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new Event("precios:actualizados"));
        }
    }

    function aplicar(datos, overrides) {
        let huboCambios = false;

        for (const id in overrides) {

            const producto = datos[id];
            if (!producto) continue;

            const ajuste = overrides[id];

            // Productos con array de precios por tamaño.
            if (Array.isArray(producto.precios) && ajuste.precios) {

                for (const indice in ajuste.precios) {

                    const valor = ajuste.precios[indice];

                    if (producto.precios[indice] && !isNaN(valor)) {
                        if (producto.precios[indice].precio !== valor) {
                            producto.precios[indice].precio = valor;
                            huboCambios = true;
                        }
                    }
                }
            }

            // Productos con precio simple (incluye tipo "unidad").
            if (ajuste.precio != null && !isNaN(ajuste.precio) && producto.precio != null) {
                if (producto.precio !== ajuste.precio) {
                    producto.precio = ajuste.precio;
                    huboCambios = true;
                }
            }
        }

        notificarCambios();
    }

    async function aplicarDesdeStorage() {
        if (typeof productos === "undefined") return null;
        const overrides = await cargar();
        aplicar(productos, overrides);
        return overrides;
    }

    // Aplica los ajustes guardados en cuanto se carga el catálogo.
    aplicarDesdeStorage();

    window.PreciosStore = { cargar, guardar, limpiar, aplicar, aplicarDesdeStorage };

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
            aplicarDesdeStorage();
        }
    });

    window.addEventListener("pageshow", function () {
        aplicarDesdeStorage();
    });

    // Sincroniza los cambios de precio hechos desde otra pestaña (panel de admin).
    window.addEventListener("storage", function (evento) {
        if (evento.key === CLAVE || evento.key === null) {
            aplicarDesdeStorage();
        }
    });

})();
