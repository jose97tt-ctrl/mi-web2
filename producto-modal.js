/* ============================================================
   Ficha de producto reutilizable (modal en PC, página en móvil)
   Genera dinámicamente el contenido a partir de `productos`
   (definido en productos.js). Sustituye a las antiguas funciones
   escritas a mano para cada producto.
   ============================================================ */

let productoActual = null;

function abrirProducto(id){
    const p = productos[id];
    if(!p) return;

    // En móvil se abre la página dedicada; en PC, la modal.
    if(window.innerWidth <= 768){
        window.location.href = "producto.html?producto=" + encodeURIComponent(id);
        return;
    }

    productoActual = id;
    renderModalProducto(p);
    document.getElementById("modalProducto").style.display = "flex";
}

function cerrarProducto(){
    document.getElementById("modalProducto").style.display = "none";
}

function renderModalProducto(p){
    const esUnidad = p.tipo === "unidad";
    const unidadEtiqueta = esUnidad ? "€/unidad" : "€/kg";

    document.getElementById("modalImagen").src = encodeURI("imagenes/" + p.imagen);
    document.getElementById("modalImagen").alt = p.nombre;
    document.getElementById("modalNombre").innerText = p.nombre;
    document.getElementById("modalDescripcion").innerText = p.descripcion || "";

    // Bloque de formatos/tamaños (solo si el producto tiene varios precios)
    const bloqueTamano = document.getElementById("modalBloqueTamano");
    const selectorTamano = document.getElementById("modalTamano");
    selectorTamano.innerHTML = "";
    if(p.precios && p.precios.length){
        bloqueTamano.style.display = "block";
        p.precios.forEach(function(item){
            const opcion = document.createElement("option");
            opcion.value = item.precio;
            opcion.textContent = item.nombre + " - " + item.precio.toFixed(2) + " €/kg";
            selectorTamano.appendChild(opcion);
        });
    }else{
        bloqueTamano.style.display = "none";
    }

    // Precio de referencia mostrado
    const precioBase = (p.precios && p.precios.length) ? p.precios[0].precio : p.precio;
    document.getElementById("modalPrecioTexto").innerHTML =
        "<strong>Precio:</strong> " + Number(precioBase).toFixed(2) + " " + unidadEtiqueta;

    // Peso (kg) o Cantidad (unidades)
    const selectorPeso = document.getElementById("modalPeso");
    const bloquePesoPersonalizado = document.getElementById("modalBloquePesoPersonalizado");
    selectorPeso.innerHTML = "";
    if(esUnidad){
        document.getElementById("modalLabelCantidad").innerText = "Cantidad:";
        (p.cantidades || []).forEach(function(cantidad){
            const opcion = document.createElement("option");
            opcion.value = cantidad;
            opcion.textContent = cantidad + " unidades";
            selectorPeso.appendChild(opcion);
        });
        bloquePesoPersonalizado.style.display = "none";
    }else{
        document.getElementById("modalLabelCantidad").innerText = "Peso:";
        [1,2,3,4].forEach(function(kg){
            const opcion = document.createElement("option");
            opcion.value = kg;
            opcion.textContent = kg + " kg";
            selectorPeso.appendChild(opcion);
        });
        bloquePesoPersonalizado.style.display = "block";
        document.getElementById("modalPesoPersonalizado").value = "";
    }

    // Preparaciones
    const selectorPreparacion = document.getElementById("modalPreparacion");
    const labelPreparacion = document.getElementById("modalLabelPreparacion");
    selectorPreparacion.innerHTML = "";
    if(p.preparaciones && p.preparaciones.length){
        p.preparaciones.forEach(function(preparacion){
            const opcion = document.createElement("option");
            opcion.value = preparacion;
            opcion.textContent = preparacion;
            selectorPreparacion.appendChild(opcion);
        });
        selectorPreparacion.style.display = "block";
        if(labelPreparacion) labelPreparacion.style.display = "block";
    }else{
        selectorPreparacion.style.display = "none";
        if(labelPreparacion) labelPreparacion.style.display = "none";
    }

    actualizarPrecioModal();
}

function precioUnitarioActual(p){
    if(p.precios && p.precios.length){
        return parseFloat(document.getElementById("modalTamano").value);
    }
    return p.precio;
}

function cantidadActual(p){
    if(p.tipo === "unidad"){
        return parseInt(document.getElementById("modalPeso").value, 10);
    }
    const pesoSeleccionado = parseFloat(document.getElementById("modalPeso").value);
    const pesoPersonalizado = parseFloat(document.getElementById("modalPesoPersonalizado").value);
    return (!isNaN(pesoPersonalizado) && pesoPersonalizado > 0) ? pesoPersonalizado : pesoSeleccionado;
}

function actualizarPrecioModal(){
    const p = productos[productoActual];
    if(!p) return;

    const precioBase = precioUnitarioActual(p);

    if(p.precios && p.precios.length){
        document.getElementById("modalPrecioTexto").innerHTML =
            "<strong>Precio:</strong> " + Number(precioBase).toFixed(2) + " €/kg";
    }

    const total = precioBase * cantidadActual(p);
    document.getElementById("modalTotal").innerText = "Total: " + total.toFixed(2) + "€";
}

function agregarProductoModal(){
    const p = productos[productoActual];
    if(!p) return;

    const esUnidad = p.tipo === "unidad";
    const cantidad = cantidadActual(p);

    let nombreProducto = p.nombre;
    let precioBase;

    if(!esUnidad && p.precios && p.precios.length){
        const selector = document.getElementById("modalTamano");
        const indice = selector.selectedIndex >= 0 ? selector.selectedIndex : 0;
        nombreProducto = p.precios[indice].nombre || nombreProducto;
        precioBase = p.precios[indice].precio;
    }else{
        precioBase = p.precio;
    }

    const preparacion = document.getElementById("modalPreparacion").value || "";
    const cantidadTexto = esUnidad ? (cantidad + " unidades") : (cantidad + " kg");

    carrito.push({
        nombre: nombreProducto,
        peso: cantidadTexto,
        preparacion: preparacion,
        precio: precioBase * cantidad
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));
    document.getElementById("contadorCarrito").innerText = carrito.length;
    actualizarCarrito();
    cerrarProducto();
}
