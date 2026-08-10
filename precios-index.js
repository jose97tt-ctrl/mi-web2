// Capa dinámica para index.html: hace que todos los precios (tarjetas, modales,
// selects y cálculos) provengan de `productos` (con los ajustes de precios-store
// ya aplicados), sin alterar el resto de la funcionalidad existente.
(function () {

    if (typeof productos === "undefined") return;

    // tipo: 's' = precio simple por peso, 'u' = por unidad, 'a' = array de precios (con select)
    const CATALOGO = [
        { id: "aguja", suf: "Aguja", tipo: "s" },
        { id: "atun-envasado", suf: "AtunEnvasado", tipo: "s" },
        { id: "atun-fresco", suf: "AtunFresco", tipo: "s" },
        { id: "boqueron", suf: "Boqueron", tipo: "a", sel: "procedenciaBoqueron" },
        { id: "bacaladilla", suf: "Bacaladilla", tipo: "s" },
        { id: "brotola-roca", suf: "BrotolaRoca", tipo: "s" },
        { id: "brotola", suf: "Brotola", tipo: "s" },
        { id: "cazon", suf: "Cazon", tipo: "s" },
        { id: "corvina", suf: "Corvina", tipo: "s" },
        { id: "jurel", suf: "Jurel", tipo: "s" },
        { id: "jurela", suf: "Jurela", tipo: "s" },
        { id: "pijota", suf: "Pijota", tipo: "s" },
        { id: "salmonete-roca", suf: "SalmoneteRoca", tipo: "s" },
        { id: "salmonete", suf: "Salmonete", tipo: "s" },
        { id: "almeja-italiana", suf: "AlmejaItaliana", tipo: "s" },
        { id: "almeja-chirla", suf: "AlmejaChirla", tipo: "s" },
        { id: "almeja-japonica-gallega", suf: "AlmejaJaponicaGallega", tipo: "s" },
        { id: "berberecho", suf: "Berberecho", tipo: "s" },
        { id: "escupina-gallega", suf: "EscupinaGallega", tipo: "s" },
        { id: "canaillas-busanos", suf: "CanaillasBusanos", tipo: "s" },
        { id: "calamar", suf: "Calamar", tipo: "s" },
        { id: "cangrejo-arena", suf: "CangrejoArena", tipo: "s" },
        { id: "cangrejo-azul", suf: "CangrejoAzul", tipo: "s" },
        { id: "carabinero", suf: "Carabinero", tipo: "s", skip: true },
        { id: "carabinero-congelado", suf: "CarabineroCongelado", tipo: "a" },
        { id: "cigala", suf: "Cigala", tipo: "s" },
        { id: "concha-fina", suf: "ConchaFina", tipo: "s" },
        { id: "coquina", suf: "Coquina", tipo: "s" },
        { id: "chopito", suf: "Chopito", tipo: "s" },
        { id: "galera", suf: "Galera", tipo: "s" },
        { id: "gambablanca", suf: "GambaBlanca", tipo: "s" },
        { id: "gambacristal", suf: "GambaCristal", tipo: "s" },
        { id: "gambaroja", suf: "GambaRoja", tipo: "s" },
        { id: "jibia", suf: "Jibia", tipo: "s" },
        { id: "langostinotigre", suf: "LangostinoTigre", tipo: "s" },
        { id: "longueron", suf: "Longueron", tipo: "s" },
        { id: "mejillonroca", suf: "MejillonRoca", tipo: "s" },
        { id: "mejillon", suf: "Mejillon", tipo: "s" },
        { id: "navaja", suf: "Navaja", tipo: "s" },
        { id: "ostra", suf: "Ostra", tipo: "u", sel: "cantidadOstra" },
        { id: "potablanca", suf: "PotaBlanca", tipo: "s" },
        { id: "potanegra", suf: "PotaNegra", tipo: "s" },
        { id: "pulpoblanco", suf: "PulpoBlanco", tipo: "s" },
        { id: "pulporoca", suf: "PulpoRoca", tipo: "s" },
        { id: "puntillitas", suf: "Puntillitas", tipo: "s" },
        { id: "quisquilla", suf: "Quisquilla", tipo: "s" },
        { id: "vieira", suf: "Vieira", tipo: "u", sel: "cantidadVieira" },
        { id: "zamburina", suf: "Zamburina", tipo: "u", sel: "cantidadZamburina" },
        { id: "anillas", suf: "Anillas", tipo: "s" },
        { id: "chocotiras", suf: "ChocoTiras", tipo: "s" },
        { id: "choco", suf: "Choco", tipo: "a", sel: "tamanoChoco" },
        { id: "bacalao", suf: "Bacalao", tipo: "a", sel: "tamanoBacalao" },
        { id: "gallineta", suf: "Gallineta", tipo: "s" },
        { id: "rosada", suf: "Rosada", tipo: "s" },
        { id: "rejospota", suf: "RejosPota", tipo: "s" },
        { id: "langostinococido", suf: "LangostinoCocido", tipo: "a", sel: "calibreLangostinoCocido" },
        { id: "pulpoentero", suf: "PulpoEntero", tipo: "a", sel: "tamanoPulpoEntero" },
        { id: "pataspulpo", suf: "PatasPulpo", tipo: "a", sel: "tamanoPatasPulpo" },
        { id: "abadejopuntosal", suf: "AbadejoPuntoSal", tipo: "s" },
        { id: "dorada", suf: "Dorada", tipo: "a", sel: "procedenciaDorada" },
        { id: "lubina", suf: "Lubina", tipo: "a", sel: "procedenciaLubina" },
        { id: "pargo", suf: "Pargo", tipo: "a", sel: "procedenciaPargo" },
        { id: "perca", suf: "Perca", tipo: "a", sel: "procedenciaPerca" },
        { id: "rodaballo", suf: "Rodaballo", tipo: "a", sel: "procedenciaRodaballo" },
        { id: "salmon", suf: "Salmon", tipo: "a", sel: "procedenciaSalmon" }
    ];

    function fmt(n) {
        return Number(n).toFixed(2);
    }

    function precioMinimo(precios) {
        return precios.reduce(function (min, x) {
            return x.precio < min ? x.precio : min;
        }, precios[0].precio);
    }

    function actualizarTarjeta(e, producto) {
        const img = document.querySelector('.card img[src="imagenes/' + producto.imagen + '"]');
        if (!img) return;
        const card = img.closest(".card");
        const pElem = card ? card.querySelector(".card-content p") : null;
        if (!pElem) return;

        if (Array.isArray(producto.precios)) {
            pElem.textContent = "Desde " + fmt(precioMinimo(producto.precios)) + " €/kg";
        } else if (e.tipo === "u") {
            pElem.textContent = "Precio " + fmt(producto.precio) + " €/ud";
        } else {
            pElem.textContent = "Precio " + fmt(producto.precio) + " €/kg";
        }
    }

    function actualizarModal(e, producto) {
        // Productos con array de precios: refrescar los value de las opciones (mantiene las etiquetas)
        if (e.tipo === "a" && e.sel && Array.isArray(producto.precios)) {
            const sel = document.getElementById(e.sel);
            if (sel) {
                for (let i = 0; i < sel.options.length && i < producto.precios.length; i++) {
                    sel.options[i].value = producto.precios[i].precio;
                }
            }
            return;
        }

        // Productos simples / por unidad: refrescar la línea "Precio:" del modal
        const modal = document.getElementById("modal" + e.suf);
        if (!modal) return;
        const info = modal.querySelector(".producto-info");
        if (!info) return;
        const parrafos = info.querySelectorAll("p");
        for (let i = 0; i < parrafos.length; i++) {
            if (/precio\s*:/i.test(parrafos[i].textContent)) {
                const unidad = e.tipo === "u" ? "€/unidad" : "€/kg";
                parrafos[i].innerHTML = "<strong>Precio:</strong> " + fmt(producto.precio) + " " + unidad;
                break;
            }
        }
    }

    // Redefine el cálculo de productos simples / por unidad para leer el precio de `productos`.
    function redefinirCalculo(e) {
        const producto = productos[e.id];
        const getElem = function (baseId) {
            if (document.getElementById(baseId)) return document.getElementById(baseId);
            if (e.id === "carabinero") {
                if (baseId === "tipoCarabinero") return document.getElementById("tipoCarabineroCongelado");
                if (baseId === "pesoCarabinero") return document.getElementById("pesoCarabineroCongelado");
                if (baseId === "pesoPersonalizadoCarabinero") return document.getElementById("pesoPersonalizadoCarabineroCongelado");
                if (baseId === "precioCarabinero") return document.getElementById("precioCarabineroCongelado");
                if (baseId === "preparacionCarabinero") return document.getElementById("preparacionCarabineroCongelado");
            }
            return null;
        };

        const recalcular = function () {
            const totalEl = getElem("precio" + e.suf);
            if (!totalEl) return;

            let precio;
            if (Array.isArray(producto && producto.precios)) {
                const tipoEl = getElem("tipo" + e.suf);
                precio = tipoEl ? parseFloat(tipoEl.value) : NaN;
            } else {
                precio = producto ? producto.precio : NaN;
            }

            if (e.tipo === "u") {
                const selEl = document.getElementById(e.sel);
                const cantidad = selEl ? parseInt(selEl.value) : NaN;
                if (isNaN(cantidad) || isNaN(precio)) return;
                totalEl.innerText = "Total: " + fmt(precio * cantidad) + "€";
                return;
            }

            const pesoEl = getElem("peso" + e.suf);
            const persoEl = getElem("pesoPersonalizado" + e.suf);
            let peso = pesoEl ? parseFloat(pesoEl.value) : NaN;
            const perso = persoEl ? parseFloat(persoEl.value) : NaN;
            if (!isNaN(perso) && perso > 0) peso = perso;
            if (isNaN(peso) || isNaN(precio)) return;
            totalEl.innerText = "Total: " + fmt(precio * peso) + "€";
        };

        const agregar = function () {
            let precio;
            if (Array.isArray(producto && producto.precios)) {
                const tipoEl = getElem("tipo" + e.suf);
                precio = tipoEl ? parseFloat(tipoEl.value) : NaN;
            } else {
                precio = producto ? producto.precio : NaN;
            }

            const modal = e.id === "carabinero"
                ? document.getElementById("modalCarabineroCongelado")
                : document.getElementById("modal" + e.suf);
            const h2 = modal ? modal.querySelector(".producto-info h2") : null;
            const nombre = h2 ? h2.textContent.trim() : producto ? producto.nombre : "Producto";
            const prepEl = getElem("preparacion" + e.suf);
            const preparacion = prepEl ? prepEl.value : "";

            let cantidadTexto;
            let precioFinal;

            if (e.tipo === "u") {
                const selEl = document.getElementById(e.sel);
                const cantidad = selEl ? parseInt(selEl.value) : NaN;
                if (isNaN(cantidad) || isNaN(precio)) return;
                cantidadTexto = cantidad + " unidades";
                precioFinal = precio * cantidad;
            } else {
                const pesoEl = getElem("peso" + e.suf);
                const persoEl = getElem("pesoPersonalizado" + e.suf);
                let peso = pesoEl ? parseFloat(pesoEl.value) : NaN;
                const perso = persoEl ? parseFloat(persoEl.value) : NaN;
                if (!isNaN(perso) && perso > 0) peso = perso;
                if (isNaN(peso) || isNaN(precio)) return;
                cantidadTexto = peso + " kg";
                precioFinal = precio * peso;
            }

            carrito.push({
                nombre: nombre,
                peso: cantidadTexto,
                preparacion: preparacion,
                precio: precioFinal
            });

            const contador = document.getElementById("contadorCarrito");
            if (contador) contador.innerText = carrito.length;
            if (typeof actualizarCarrito === "function") actualizarCarrito();
            if (modal) modal.style.display = "none";
        };

        // Reasigna las funciones globales que invocan los onclick/onchange existentes.
        if (typeof window["actualizarPrecio" + e.suf] === "function") {
            window["actualizarPrecio" + e.suf] = recalcular;
        } else if (typeof window["actualizar" + e.suf] === "function") {
            window["actualizar" + e.suf] = recalcular;
        }
        if (typeof window["agregar" + e.suf] === "function") {
            window["agregar" + e.suf] = agregar;
        }
    }

    CATALOGO.forEach(function (e) {
        const producto = productos[e.id];
        if (!producto) return;
        if (e.skip) return;

        actualizarTarjeta(e, producto);
        actualizarModal(e, producto);

        if (e.tipo === "s" || e.tipo === "u") {
            redefinirCalculo(e);
        }
    });

})();
