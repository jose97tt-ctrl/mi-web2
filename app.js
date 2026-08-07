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

    const contenedor =
        document.createElement("div");

    contenedor.className =
        "catalogo-grid";

    categorias[idCategoria].forEach(producto=>{

        const card = crearTarjeta(producto);

contenedor.appendChild(card);

        contenedor.appendChild(card);

    });

    catalogo.appendChild(contenedor);

}

function crearTarjeta(producto){

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `

    <div class="card-imagen">

        <img src="imagenes/${producto.imagen}" alt="${producto.nombre}">

    </div>

    <div class="card-info">

        <h3>${producto.nombre}</h3>

        <p class="descripcion">

            ${producto.descripcion}

        </p>

        <p class="precio">

            ${producto.precio} €/kg

        </p>

        <div class="botones-card">

            <button class="btn-ver"
            onclick="verProducto('${producto.id}')">

                Ver producto

            </button>

        </div>

    </div>

    `;

    return card;

}
function verProducto(id){

    location.href=
    "producto.html?producto="+id;

}