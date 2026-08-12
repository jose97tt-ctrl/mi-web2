const categorias = {};

// Crear todas las categorías definidas en CONFIG
for (const id in CONFIG.categorias) {
    categorias[id] = [];
}

// Repartir los productos en su categoría
for (const id in productos) {

    const producto = productos[id];

    if (producto.categoria && categorias[producto.categoria]) {

        categorias[producto.categoria].push({

            id,

            ...producto

        });

    }

}

for(const idCategoria in CONFIG.categorias){

    const titulo =
        document.createElement("h2");

    titulo.textContent =
    CONFIG.categorias[idCategoria].nombre;

    catalogo.appendChild(titulo);

    const contenedor = document.createElement("div");
    contenedor.className = "catalogo-grid";

    categorias[idCategoria].forEach(producto => {
        const card = crearTarjeta(producto);
        contenedor.appendChild(card);
    });

    catalogo.appendChild(contenedor);

}

function crearTarjeta(producto){

    const card = document.createElement("div");

    card.className = "card";

    const imagenSrc = producto.imagen ? `imagenes/${producto.imagen}` : 'imagenes/logo.png';
    card.innerHTML = `
    <div class="card-imagen">
        <img src="${imagenSrc}" alt="${producto.nombre}" onerror="this.onerror=null;this.src='imagenes/logo.png'">
    </div>
    <div class="card-info">
        <h3>${producto.nombre}</h3>
        <p class="descripcion">${producto.descripcion || ''}</p>
        <p class="precio">${(producto.precio != null) ? producto.precio + ' €/kg' : 'Precio pendiente'}</p>
        <div class="botones-card">
            <button class="btn-ver btn-producto" onclick="verProducto('${producto.id}')">Ver producto</button>
        </div>
    </div>
    `;

    return card;

}
function verProducto(id){

    location.href=
    "producto.html?producto="+id;

}

// Si la página contiene un grid estático `.productos`, reemplazar su contenido por el catálogo dinámico
document.addEventListener('DOMContentLoaded', function(){
    const grid = document.querySelector('.productos');
    if (!grid) return;
    // Limpiar contenido estático
    grid.innerHTML = '';
    // Añadir por categorías
    for (const idCategoria in CONFIG.categorias) {
        const titulo = document.createElement('h3');
        titulo.className = 'categoria-productos';
        titulo.innerText = CONFIG.categorias[idCategoria].nombre || idCategoria;
        grid.appendChild(titulo);
        const frag = document.createElement('div');
        frag.className = 'grid-catalogo';
        categorias[idCategoria].forEach(p => {
            const tarjeta = crearTarjeta(p);
            frag.appendChild(tarjeta);
        });
        grid.appendChild(frag);
    }
    // Después de generar, actualizar precios visibles
    if (typeof updateCatalogPrices === 'function') updateCatalogPrices();
});