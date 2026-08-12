// ============================================================
//  Catálogo dinámico de tarjetas de producto.
//  productos.js es la única fuente de verdad: cada producto define su
//  `titulo` (título de la tarjeta), su `seccion` (o su `categoria` por
//  defecto) y el resto de datos. Aquí solo se agrupan y se pintan.
// ============================================================

// Secciones del catálogo, en orden. Cada una define su título (con emoji).
// Para añadir una categoría nueva basta con: crear productos con esa `categoria`
// (o `seccion`) y añadir aquí una línea con su clave y título; la sección se
// genera automáticamente si no existe en index.html.
const SECCIONES = [
    { seccion: "pescados",         titulo: "\ud83d\udc1f PESCADOS" },
    { seccion: "mariscos",         titulo: "\ud83e\udd90 MARISCOS" },
    { seccion: "carnes",           titulo: "\ud83e\udd69 CARNES" },
    { seccion: "elaborados",       titulo: "\ud83d\udc20 ELABORADOS" },
    { seccion: "langostinoCocido", titulo: "\ud83e\udd90 LANGOSTINO COCIDO" },
    { seccion: "pulpoCocido",      titulo: "\ud83d\udc19 PULPO COCIDO" },
    { seccion: "piscifactoria",    titulo: "\ud83d\udc1f PISCIFACTOR\u00cdA" },
    { seccion: "congelados",       titulo: "\u2744\ufe0f CONGELADOS" }
];

function seccionDe(p){
    return (p && (p.seccion || p.categoria)) || null;
}

function textoPrecioCard(p){
    if(!p) return "Precio pendiente";
    if(p.precios && p.precios.length){
        const min = p.precios.reduce(function(m,x){ return x.precio < m ? x.precio : m; }, p.precios[0].precio);
        return "Desde " + Number(min).toFixed(2) + " \u20ac/kg";
    }
    if(p.tipo === "unidad" && p.precio != null){
        return "Precio " + Number(p.precio).toFixed(2) + " \u20ac/ud";
    }
    if(p.precio != null){
        return "Precio " + Number(p.precio).toFixed(2) + " \u20ac/kg";
    }
    return "Precio pendiente";
}

function escaparAttr(t){
    return String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

const TEXTO_BOTON_CARD = "\ud83d\uded2 A\u00f1adir al carrito";

function crearCardHTML(id){
    const p = productos[id];
    if(!p) return "";
    const src = "imagenes/" + (p.imagen || "logo.png");
    const titulo = escaparAttr(p.titulo || p.nombre || "");
    return '' +
        '<div class="card" data-id="' + id + '">' +
            '<img src="' + src + '" alt="' + titulo + '" onerror="this.onerror=null;this.src=\'imagenes/logo.png\'">' +
            '<div class="card-content">' +
                '<h3>' + titulo + '</h3>' +
                '<p>' + textoPrecioCard(p) + '</p>' +
                '<button onclick="abrirProducto(\'' + id + '\')" class="btn-producto">' + TEXTO_BOTON_CARD + '</button>' +
            '</div>' +
        '</div>';
}

// Agrupa los productos por sección respetando el orden de definición en productos.js.
function agruparPorSeccion(){
    const grupos = {};
    SECCIONES.forEach(function(s){ grupos[s.seccion] = []; });
    for(const id in productos){
        const p = productos[id];
        if(!p || p.catalogo === false) continue;
        const s = seccionDe(p);
        if(grupos[s]) grupos[s].push(id);
    }
    return grupos;
}

function renderCatalogo(){
    const grupos = agruparPorSeccion();
    let anteriorEl = null; // último contenedor de sección ya colocado en el DOM

    SECCIONES.forEach(function(item){
        const ids = grupos[item.seccion] || [];
        let grid = document.querySelector('[data-seccion="' + item.seccion + '"]');

        // Si la sección no existe en el HTML pero tiene productos, se genera sola.
        if(!grid){
            if(ids.length === 0) return;
            const seccionEl = document.createElement("section");
            seccionEl.id = item.seccion;
            seccionEl.innerHTML =
                '<h3 class="categoria-productos">' + item.titulo + '</h3>' +
                '<div class="productos" data-seccion="' + item.seccion + '"></div>';
            const referencia = anteriorEl || document.getElementById("productos");
            if(referencia && referencia.parentNode){
                referencia.parentNode.insertBefore(seccionEl, referencia.nextSibling);
            }
            grid = seccionEl.querySelector('[data-seccion]');
        }

        grid.innerHTML = ids.map(crearCardHTML).join("");
        anteriorEl = grid.closest("section") || grid;
    });
}

function refrescarPreciosCatalogo(){
    if(typeof productos === "undefined") return;
    document.querySelectorAll(".card[data-id]").forEach(function(card){
        const p = productos[card.dataset.id];
        const pElem = card.querySelector(".card-content p");
        if(pElem) pElem.textContent = textoPrecioCard(p);
    });
}

renderCatalogo();
refrescarPreciosCatalogo();
window.addEventListener("precios:actualizados", refrescarPreciosCatalogo);
