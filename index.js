
function abrirMenu(){
    document.getElementById("menuLateral").style.transform="translateX(0)";
    document.getElementById("fondoMenu").style.display="block";
}

function cerrarMenu(){
    document.getElementById("menuLateral").style.transform="translateX(-100%)";
    document.getElementById("fondoMenu").style.display="none";
}
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Inicializar contador y lista de carrito al cargar la página
document.addEventListener('DOMContentLoaded', function(){
    const contadorEl = document.getElementById("contadorCarrito");
    if (contadorEl) contadorEl.innerText = carrito.length;
    if (typeof actualizarCarrito === 'function') actualizarCarrito();
});

// Utilidades: slugify y formateo seguro de precio
function slugify(text) {
    if (!text) return "";
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-');
}

function formatPrecioVal(valor, unidadEtiqueta) {
    if (valor == null || isNaN(valor)) return 'Precio pendiente';
    return (parseFloat(valor)).toFixed(2) + (unidadEtiqueta ? ' ' + unidadEtiqueta : ' €/kg');
}

    // Actualizar los precios mostrados en las tarjetas del catálogo según `productos` y overrides aplicados
    function updateCatalogPrices() {
        if (typeof productos === 'undefined') return;
        document.querySelectorAll('.card').forEach(function(card){
            const h3 = card.querySelector('h3');
            if (!h3) return;
            const nombre = h3.innerText.trim();
            const id = slugify(nombre);
            const prod = productos[id];
            // busca el primer <p> que contenga la palabra Precio
            const precioP = Array.from(card.querySelectorAll('p')).find(p => /precio/i.test(p.innerText));
            if (precioP) {
                if (prod) {
                    if (prod.precios && Array.isArray(prod.precios) && prod.precios.length) {
                        precioP.innerText = formatPrecioVal(prod.precios[0].precio);
                    } else if (prod.precio != null && !isNaN(prod.precio)) {
                        precioP.innerText = formatPrecioVal(prod.precio);
                    } else {
                        precioP.innerText = 'Precio pendiente';
                    }
                } else {
                    precioP.innerText = 'Precio pendiente';
                }
            }
        });
    }

    window.addEventListener('precios:actualizados', function(){
        // reaplicar overrides y refrescar catálogo
        if (window.PreciosStore && typeof window.PreciosStore.aplicarDesdeStorage === 'function') {
            window.PreciosStore.aplicarDesdeStorage().then(()=>{
                updateCatalogPrices();
            }).catch(()=>{
                updateCatalogPrices();
            });
        } else {
            updateCatalogPrices();
        }
    });

    document.addEventListener('DOMContentLoaded', function(){
        updateCatalogPrices();
    });


function agregarCarrito(producto,precio,cantidad=1){
    carrito.push({
    nombre:producto,
    precio:precio,
    cantidad:cantidad
});
localStorage.setItem("carrito", JSON.stringify(carrito));


    document.getElementById("contadorCarrito").innerText =
    carrito.length;


    actualizarCarrito();
    


    let aviso =
    document.getElementById("avisoCarrito");


    aviso.style.display="block";


    setTimeout(()=>{

        aviso.style.display="none";

    },1500);

}



function actualizarCarrito(){

    let lista =
    document.getElementById("listaCarrito");

    lista.innerHTML="";

    let total=0;

    carrito.forEach((producto,index)=>{

        let item =
        document.createElement("li");

     const pesoText = producto.peso || '';
     const prepText = producto.preparacion || '';
     const precioVal = (producto.precio || 0);

     item.innerHTML =

 '<div class="linea-carrito">' +

 '<div>' +

 '<strong>' + producto.nombre + '</strong><br>' +

 '⚖️ ' + pesoText + '<br>' +

 '🔪 ' + prepText + '<br>' +

 '<strong>' + precioVal.toFixed(2) + '€</strong>' +

 '</div>' +

 '<span onclick="eliminarProducto(' + index + ')" class="papelera-carrito">🗑️</span>' +

 '</div>';

lista.appendChild(item);

total += producto.precio;
    });

    document.getElementById("totalCarrito").innerText =
    "Total: " + total.toFixed(2) + "€";

}



function abrirCarrito(){

    document.getElementById("carritoPanel").style.right="0";

    document.getElementById("fondoCarrito").style.display="block";

}

// Al abrir elementos, cerrar otros overlays para evitar solapamientos
function abrirMenu(){
    // cerrar carrito y buscador
    const fc = document.getElementById('fondoCarrito'); if (fc) fc.style.display='none';
    const cp = document.getElementById('carritoPanel'); if (cp) cp.style.right='-350px';
    const bf = document.getElementById('fondoMenu'); if (bf) bf.style.display='block';
    const ml = document.getElementById('menuLateral'); if (ml) ml.style.transform='translateX(0)';
}

function abrirCarrito(){
    // cerrar menu y buscador
    const fm = document.getElementById('fondoMenu'); if (fm) fm.style.display='none';
    const ml = document.getElementById('menuLateral'); if (ml) ml.style.transform='translateX(-100%)';
    const fc = document.getElementById('fondoCarrito'); if (fc) fc.style.display='block';
    const cp = document.getElementById('carritoPanel'); if (cp) cp.style.right='0';
}



function cerrarCarrito(){

    document.getElementById("carritoPanel").style.right="-350px";

    document.getElementById("fondoCarrito").style.display="none";

}



function vaciarCarrito(){

    carrito=[];
    localStorage.removeItem("carrito");

    actualizarCarrito();

    document.getElementById("contadorCarrito").innerText="0";

}
    function eliminarProducto(indice){

    carrito.splice(indice,1);
        
localStorage.setItem("carrito", JSON.stringify(carrito));
        
    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

}
let cantidades = {};

function sumarCantidad(id){

    if(!cantidades[id]){
        cantidades[id] = 1;
    }

    cantidades[id]++;

    document.getElementById("cantidad-"+id).innerText =
    cantidades[id];

}

function restarCantidad(id){

    if(!cantidades[id]){
        cantidades[id] = 1;
    }

    if(cantidades[id] > 1){

        cantidades[id]--;

        document.getElementById("cantidad-"+id).innerText =
        cantidades[id];

    }

}

function abrirProductoAguja(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=aguja";

    }else{

        document.getElementById("modalAguja").style.display = "flex";

        document.getElementById("pesoAguja").value = "1";

        actualizarPrecioAguja();

    }

}
function cerrarProductoAguja(){

    document.getElementById("modalAguja").style.display="none";

}
function actualizarPrecioAguja(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAguja").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAguja").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

const precioUnitario = productos && productos.aguja ? productos.aguja.precio : 0;
let total = precioUnitario * peso;

document.getElementById("precioAguja").innerText =
"Total: " + total.toFixed(2) + "€";

const modalPrecio = document.querySelector('#modalAguja .producto-info p strong');
if (modalPrecio && modalPrecio.parentElement) {
    modalPrecio.parentElement.innerHTML = '<strong>Precio:</strong> ' + (precioUnitario || 0).toFixed(2) + ' €/kg';
}

}
function agregarAguja(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAguja").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAguja").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionAguja").value;

let precioFinal = productos.aguja.precio * peso;

carrito.push({

    nombre:"Aguja",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoAguja();

}

function abrirProductoAtunEnvasado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=atun-envasado";

    }else{

        document.getElementById("modalAtunEnvasado").style.display = "flex";

        document.getElementById("pesoAtunEnvasado").value = "1";

        document.getElementById("pesoPersonalizadoAtunEnvasado").value = "";

        actualizarPrecioAtunEnvasado();

    }

}
function cerrarProductoAtunEnvasado(){

document.getElementById("modalAtunEnvasado").style.display="none";

}
function actualizarPrecioAtunEnvasado(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAtunEnvasado").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAtunEnvasado").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = productos["atun-envasado"].precio * peso;

document.getElementById("precioAtunEnvasado").innerText =
"Total: " + total.toFixed(2) + "€";

}
function agregarAtunEnvasado(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAtunEnvasado").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAtunEnvasado").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionAtunEnvasado").value;

let precioFinal = productos["atun-envasado"].precio * peso;

carrito.push({

    nombre:"Atún Envasado",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoAtunEnvasado();

}
function abrirProductoAtunFresco(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=atun-fresco";

    }else{

        document.getElementById("modalAtunFresco").style.display = "flex";

        document.getElementById("pesoAtunFresco").value = "1";

        actualizarPrecioAtunFresco();

    }

}

function cerrarProductoAtunFresco(){

document.getElementById("modalAtunFresco").style.display="none";

}

function actualizarPrecioAtunFresco(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAtunFresco").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAtunFresco").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = productos["atun-fresco"].precio * peso;

document.getElementById("precioAtunFresco").innerText =
"Total: " + total.toFixed(2) + "€";

}
function agregarAtunFresco(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAtunFresco").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAtunFresco").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionAtunFresco").value;

let precioFinal = productos["atun-fresco"].precio * peso;

carrito.push({

    nombre:"Atún Fresco",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoAtunFresco();

}
function abrirProductoBoqueron(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=boqueron";

    }else{

        document.getElementById("modalBoqueron").style.display = "flex";

        document.getElementById("pesoBoqueron").value = "1";

        actualizarPrecioBoqueron();

    }

}

function cerrarProductoBoqueron(){

document.getElementById("modalBoqueron").style.display="none";

}

function actualizarPrecioBoqueron(){

    let selector =
    document.getElementById("procedenciaBoqueron");

    let precio =
    parseFloat(selector.value);

    document.getElementById("precioTextoBoqueron").innerHTML =
    "<strong>Precio:</strong> " + precio.toFixed(2) + " €/kg";

    let peso =
    parseFloat(document.getElementById("pesoBoqueron").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoBoqueron").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioBoqueron").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarBoqueron(){

    let peso =
    parseFloat(document.getElementById("pesoBoqueron").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoBoqueron").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionBoqueron").value;

    let selector =
    document.getElementById("procedenciaBoqueron");

    let nombreProducto =
    "🐟 Boquerón - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoBoqueron();

}
function abrirProductoBacaladilla(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=bacaladilla";

    }else{

        document.getElementById("modalBacaladilla").style.display = "flex";

        document.getElementById("pesoBacaladilla").value = "1";

        if(document.getElementById("pesoPersonalizadoBacaladilla")){
            document.getElementById("pesoPersonalizadoBacaladilla").value = "";
        }

        actualizarPrecioBacaladilla();

    }

}

function cerrarProductoBacaladilla(){

document.getElementById("modalBacaladilla").style.display="none";

}

function actualizarPrecioBacaladilla(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoBacaladilla").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoBacaladilla").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let precioKilo = productos.bacaladilla.precio;
let total = precioKilo * peso;
let precioFinal = precioKilo * peso;

document.getElementById("precioBacaladilla").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarBacaladilla(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoBacaladilla").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoBacaladilla").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionBacaladilla").value;

let precioFinal = 18 * peso;

carrito.push({

    nombre:"Bacaladilla",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoBacaladilla();

}
function abrirProductoBrotolaRoca(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=brotola-roca";

    }else{

        document.getElementById("modalBrotolaRoca").style.display = "flex";

        document.getElementById("pesoBrotolaRoca").value = "1";

        if(document.getElementById("pesoPersonalizadoBrotolaRoca")){
            document.getElementById("pesoPersonalizadoBrotolaRoca").value = "";
        }

        actualizarPrecioBrotolaRoca();

    }

}

function cerrarProductoBrotolaRoca(){

document.getElementById("modalBrotolaRoca").style.display="none";

}

function actualizarPrecioBrotolaRoca(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoBrotolaRoca").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoBrotolaRoca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 15 * peso;

document.getElementById("precioBrotolaRoca").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarBrotolaRoca(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoBrotolaRoca").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoBrotolaRoca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionBrotolaRoca").value;

let precioFinal = 15 * peso;

carrito.push({

    nombre:"Brótola Roca",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoBrotolaRoca();

}
function abrirProductoBrotola(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=brotola";

    }else{

        document.getElementById("modalBrotola").style.display = "flex";

        document.getElementById("pesoBrotola").value = "1";

        if(document.getElementById("pesoPersonalizadoBrotola")){
            document.getElementById("pesoPersonalizadoBrotola").value = "";
        }

        actualizarPrecioBrotola();

    }

}

function cerrarProductoBrotola(){

document.getElementById("modalBrotola").style.display="none";

}

function actualizarPrecioBrotola(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoBrotola").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoBrotola").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 8 * peso;

document.getElementById("precioBrotola").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarBrotola(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoBrotola").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoBrotola").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionBrotola").value;

let precioFinal = 8 * peso;

carrito.push({

    nombre:"Brótola",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoBrotola();

}
function abrirProductoCazon(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=cazon";

    }else{

        document.getElementById("modalCazon").style.display = "flex";

        document.getElementById("pesoCazon").value = "1";

        if(document.getElementById("pesoPersonalizadoCazon")){
            document.getElementById("pesoPersonalizadoCazon").value = "";
        }

        actualizarPrecioCazon();

    }

}

function cerrarProductoCazon(){

document.getElementById("modalCazon").style.display="none";

}

function actualizarPrecioCazon(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCazon").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCazon").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 15.5 * peso;

document.getElementById("precioCazon").innerText =
"Total: " + total.toFixed(2) + "€";

}
function agregarCazon(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCazon").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCazon").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionCazon").value;

let precioFinal = 15.5 * peso;

carrito.push({

    nombre:"Cazón",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoCazon();

}
function abrirProductoCorvina(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=corvina";

    }else{

        document.getElementById("modalCorvina").style.display="flex";

        document.getElementById("pesoCorvina").value="1";

        if(document.getElementById("pesoPersonalizadoCorvina")){
            document.getElementById("pesoPersonalizadoCorvina").value="";
        }

        actualizarPrecioCorvina();

    }

}

function cerrarProductoCorvina(){

document.getElementById("modalCorvina").style.display="none";

}

function actualizarPrecioCorvina(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCorvina").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCorvina").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 6.5 * peso;

document.getElementById("precioCorvina").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarCorvina(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCorvina").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCorvina").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionCorvina").value;

let precioFinal = 6.5 * peso;

carrito.push({

nombre:"Corvina",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoCorvina();

}
function abrirProductoJurel(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=jurel";

    }else{

        document.getElementById("modalJurel").style.display="flex";

        document.getElementById("pesoJurel").value="1";

        if(document.getElementById("pesoPersonalizadoJurel")){
            document.getElementById("pesoPersonalizadoJurel").value="";
        }

        actualizarPrecioJurel();

    }

}

function cerrarProductoJurel(){

document.getElementById("modalJurel").style.display="none";

}

function actualizarPrecioJurel(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoJurel").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoJurel").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 3.5 * peso;

document.getElementById("precioJurel").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarJurel(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoJurel").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoJurel").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionJurel").value;

let precioFinal = 3.5 * peso;

carrito.push({

nombre:"Jurel",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoJurel();

}
function abrirProductoJurela(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=jurela";

    }else{

        document.getElementById("modalJurela").style.display="flex";

        document.getElementById("pesoJurela").value="1";

        if(document.getElementById("pesoPersonalizadoJurela")){
            document.getElementById("pesoPersonalizadoJurela").value="";
        }

        actualizarPrecioJurela();

    }

}

function cerrarProductoJurela(){

document.getElementById("modalJurela").style.display="none";

}

function actualizarPrecioJurela(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoJurela").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoJurela").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 6 * peso;

document.getElementById("precioJurela").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarJurela(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoJurela").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoJurela").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionJurela").value;

let precioFinal = 6 * peso;

carrito.push({

nombre:"Jurela",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoJurela();

}
function abrirProductoPijota(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=pijota";

    }else{

        document.getElementById("modalPijota").style.display="flex";

        document.getElementById("pesoPijota").value="1";

        if(document.getElementById("pesoPersonalizadoPijota")){
            document.getElementById("pesoPersonalizadoPijota").value="";
        }

        actualizarPrecioPijota();

    }

}

function cerrarProductoPijota(){

document.getElementById("modalPijota").style.display="none";

}

function actualizarPrecioPijota(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPijota").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPijota").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 14.5 * peso;

document.getElementById("precioPijota").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarPijota(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPijota").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPijota").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionPijota").value;

let precioFinal = 14.5 * peso;

carrito.push({

nombre:"Pijota",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoPijota();

}
function abrirProductoSalmoneteRoca(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=salmonete-roca";

    }else{

        document.getElementById("modalSalmoneteRoca").style.display="flex";

        document.getElementById("pesoSalmoneteRoca").value="1";

        if(document.getElementById("pesoPersonalizadoSalmoneteRoca")){
            document.getElementById("pesoPersonalizadoSalmoneteRoca").value="";
        }

        actualizarPrecioSalmoneteRoca();

    }

}

function cerrarProductoSalmoneteRoca(){

document.getElementById("modalSalmoneteRoca").style.display="none";

}

function actualizarPrecioSalmoneteRoca(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoSalmoneteRoca").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoSalmoneteRoca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 23 * peso;

document.getElementById("precioSalmoneteRoca").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarSalmoneteRoca(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoSalmoneteRoca").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoSalmoneteRoca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionSalmoneteRoca").value;

let precioFinal = 23 * peso;

carrito.push({

nombre:"Salmonete Roca",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoSalmoneteRoca();

}
function abrirProductoSalmonete(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=salmonete";

    }else{

        document.getElementById("modalSalmonete").style.display="flex";

        document.getElementById("pesoSalmonete").value="1";

        if(document.getElementById("pesoPersonalizadoSalmonete")){
            document.getElementById("pesoPersonalizadoSalmonete").value="";
        }

        actualizarPrecioSalmonete();

    }

}
function cerrarProductoSalmonete(){

document.getElementById("modalSalmonete").style.display="none";

}

function actualizarPrecioSalmonete(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoSalmonete").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoSalmonete").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 15 * peso;

document.getElementById("precioSalmonete").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarSalmonete(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoSalmonete").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoSalmonete").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionSalmonete").value;

let precioFinal = 15 * peso;

carrito.push({

nombre:"Salmonete",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoSalmonete();

}
function abrirProductoAlmejaItaliana(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=almeja-italiana";

    }else{

        document.getElementById("modalAlmejaItaliana").style.display = "flex";

        document.getElementById("pesoAlmejaItaliana").value = "1";

        actualizarPrecioAlmejaItaliana();

    }

}

function cerrarProductoAlmejaItaliana(){

document.getElementById("modalAlmejaItaliana").style.display="none";

}

function actualizarPrecioAlmejaItaliana(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAlmejaItaliana").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAlmejaItaliana").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 10 * peso;

document.getElementById("precioAlmejaItaliana").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarAlmejaItaliana(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAlmejaItaliana").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAlmejaItaliana").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionAlmejaItaliana").value;

let precioFinal = 10 * peso;

carrito.push({

nombre:"Almeja Italiana",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoAlmejaItaliana();

}
function abrirProductoAlmejaChirla(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=almeja-chirla";

    }else{

        document.getElementById("modalAlmejaChirla").style.display = "flex";

        document.getElementById("pesoAlmejaChirla").value = "1";

        actualizarPrecioAlmejaChirla();

    }

}

function cerrarProductoAlmejaChirla(){

document.getElementById("modalAlmejaChirla").style.display="none";

}

function actualizarPrecioAlmejaChirla(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAlmejaChirla").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAlmejaChirla").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 12 * peso;

document.getElementById("precioAlmejaChirla").innerText =
"Total: " + total.toFixed(2) + " €";

}
function agregarAlmejaChirla(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAlmejaChirla").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAlmejaChirla").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionAlmejaChirla").value;

let precioFinal = 12 * peso;

carrito.push({

nombre:"Almeja o Chirla",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoAlmejaChirla();

}
function abrirProductoAlmejaJaponicaGallega(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=almeja-japonica-gallega";

    }else{

        document.getElementById("modalAlmejaJaponicaGallega").style.display = "flex";

        document.getElementById("pesoAlmejaJaponicaGallega").value = "1";

        actualizarPrecioAlmejaJaponicaGallega();

    }

}

function cerrarProductoAlmejaJaponicaGallega(){

document.getElementById("modalAlmejaJaponicaGallega").style.display="none";

}

function actualizarPrecioAlmejaJaponicaGallega(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAlmejaJaponicaGallega").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAlmejaJaponicaGallega").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 26 * peso;

document.getElementById("precioAlmejaJaponicaGallega").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarAlmejaJaponicaGallega(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAlmejaJaponicaGallega").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAlmejaJaponicaGallega").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionAlmejaJaponicaGallega").value;

let precioFinal = 26 * peso;

carrito.push({

nombre:"Almeja Japónica Gallega",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoAlmejaJaponicaGallega();

}
function abrirProductoBerberecho(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=berberecho";

    }else{

        document.getElementById("modalBerberecho").style.display = "flex";

        document.getElementById("pesoBerberecho").value = "1";

        actualizarPrecioBerberecho();

    }

}

function cerrarProductoBerberecho(){

document.getElementById("modalBerberecho").style.display="none";

}

function actualizarPrecioBerberecho(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoBerberecho").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoBerberecho").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 18 * peso;

document.getElementById("precioBerberecho").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarBerberecho(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoBerberecho").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoBerberecho").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionBerberecho").value;

let precioFinal = 18 * peso;

carrito.push({

nombre:"Berberecho",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoBerberecho();

}
function abrirProductoEscupinaGallega(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=escupina-gallega";

    }else{

        document.getElementById("modalEscupinaGallega").style.display = "flex";

        document.getElementById("pesoEscupinaGallega").value = "1";

        actualizarPrecioEscupinaGallega();

    }

}
function cerrarProductoEscupinaGallega(){

document.getElementById("modalEscupinaGallega").style.display="none";

}

function actualizarPrecioEscupinaGallega(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoEscupinaGallega").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoEscupinaGallega").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 24 * peso;

document.getElementById("precioEscupinaGallega").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarEscupinaGallega(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoEscupinaGallega").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoEscupinaGallega").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionEscupinaGallega").value;

let precioFinal = 24 * peso;

carrito.push({

nombre:"Bolos o Escupiña Gallega",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoEscupinaGallega();

}
function abrirProductoCanaillasBusanos(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=canaillas-busanos";

    }else{

        document.getElementById("modalCanaillasBusanos").style.display = "flex";

        document.getElementById("pesoCanaillasBusanos").value = "1";

        actualizarPrecioCanaillasBusanos();

    }

}

function cerrarProductoCanaillasBusanos(){

document.getElementById("modalCanaillasBusanos").style.display="none";

}

function actualizarPrecioCanaillasBusanos(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCanaillasBusanos").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCanaillasBusanos").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 45 * peso;

document.getElementById("precioCanaillasBusanos").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarCanaillasBusanos(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCanaillasBusanos").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCanaillasBusanos").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionCanaillasBusanos").value;

let precioFinal = 45 * peso;

carrito.push({

nombre:"Cañaíllas o Busanos",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoCanaillasBusanos();

}
function abrirProductoCalamar(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=calamar";

    }else{

        document.getElementById("modalCalamar").style.display = "flex";

        document.getElementById("pesoCalamar").value = "1";

        actualizarPrecioCalamar();

    }

}

function cerrarProductoCalamar(){

document.getElementById("modalCalamar").style.display="none";

}

function actualizarPrecioCalamar(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCalamar").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCalamar").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 26 * peso;

document.getElementById("precioCalamar").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarCalamar(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCalamar").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCalamar").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionCalamar").value;

let precioFinal = 26 * peso;

carrito.push({

nombre:"Calamar",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoCalamar();

}
function abrirProductoCangrejoArena(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=cangrejo-arena";

    }else{

        document.getElementById("modalCangrejoArena").style.display = "flex";

        document.getElementById("pesoCangrejoArena").value = "1";

        actualizarPrecioCangrejoArena();

    }

}

function cerrarProductoCangrejoArena(){

document.getElementById("modalCangrejoArena").style.display="none";

}

function actualizarPrecioCangrejoArena(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCangrejoArena").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCangrejoArena").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 5.5 * peso;

document.getElementById("precioCangrejoArena").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarCangrejoArena(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCangrejoArena").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCangrejoArena").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionCangrejoArena").value;

let precioFinal = 5.5 * peso;

carrito.push({

nombre:"Cangrejo Arena",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoCangrejoArena();

}
function abrirProductoCangrejoAzul(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=cangrejo-azul";

    }else{

        document.getElementById("modalCangrejoAzul").style.display = "flex";

        document.getElementById("pesoCangrejoAzul").value = "1";

        actualizarPrecioCangrejoAzul();

    }

}

function cerrarProductoCangrejoAzul(){

document.getElementById("modalCangrejoAzul").style.display="none";

}

function actualizarPrecioCangrejoAzul(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCangrejoAzul").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCangrejoAzul").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 8.5 * peso;

document.getElementById("precioCangrejoAzul").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarCangrejoAzul(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCangrejoAzul").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCangrejoAzul").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionCangrejoAzul").value;

let precioFinal = 8.5 * peso;

carrito.push({

nombre:"Cangrejo Azul",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoCangrejoAzul();

}
function abrirProductoCarabinero(){

    abrirProductoCarabineroCongelado();

}

function cerrarProductoCarabinero(){

document.getElementById("modalCarabineroCongelado").style.display="none";

}

function actualizarPrecioCarabinero(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCarabinero").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCarabinero").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 85 * peso;

document.getElementById("precioCarabinero").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarCarabinero(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCarabinero").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCarabinero").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionCarabinero").value;

let precioFinal = 85 * peso;

carrito.push({

nombre:"Carabinero",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoCarabinero();

}
function abrirProductoCigala(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=cigala";

    }else{

        document.getElementById("modalCigala").style.display = "flex";

        document.getElementById("pesoCigala").value = "1";

        actualizarPrecioCigala();

    }

}

function cerrarProductoCigala(){

document.getElementById("modalCigala").style.display="none";

}

function actualizarPrecioCigala(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCigala").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCigala").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 100 * peso;

document.getElementById("precioCigala").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarCigala(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCigala").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCigala").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionCigala").value;

let precioFinal = 100 * peso;

carrito.push({

nombre:"Cigala",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoCigala();

}
function abrirProductoConchaFina(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=concha-fina";

    }else{

        document.getElementById("modalConchaFina").style.display = "flex";

        document.getElementById("pesoConchaFina").value = "1";

        actualizarPrecioConchaFina();

    }

}

function cerrarProductoConchaFina(){

document.getElementById("modalConchaFina").style.display="none";

}

function actualizarPrecioConchaFina(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoConchaFina").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoConchaFina").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let total = 16 * peso;

document.getElementById("precioConchaFina").innerText =
"Total: " + total.toFixed(2) + " €";

}

function agregarConchaFina(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoConchaFina").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoConchaFina").value);

let peso = pesoSeleccionado;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){
    peso = pesoPersonalizado;
}

let preparacion =
document.getElementById("preparacionConchaFina").value;

let precioFinal = 16 * peso;

carrito.push({

nombre:"Concha Fina",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoConchaFina();

}
function abrirProductoCoquina(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=coquina";

    }else{

        document.getElementById("modalCoquina").style.display = "flex";

        document.getElementById("pesoCoquina").value = "1";

        document.getElementById("precioTextoCoquina").innerHTML =
        "<b>Precio:</b> " + productos.coquina.precio + " €/kg";

        
        actualizarPrecioCoquina();

    }

}
function cerrarProductoCoquina(){

document.getElementById("modalCoquina").style.display="none";

}

function actualizarPrecioCoquina(){

let precioKilo = productos.coquina.precio;
alert(precioKilo);

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCoquina").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCoquina").value);

let peso;

// Si el cliente escribe un peso personalizado, tiene prioridad
if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

peso = pesoPersonalizado;

}else{

peso = pesoSeleccionado;

}

let total = precioKilo * peso;

document.getElementById("precioCoquina").innerText =
"Total: " + total.toFixed(2) + "€";

}
function agregarCoquina(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoCoquina").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoCoquina").value);

let peso;

// Si hay un peso personalizado, tiene prioridad
if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

peso = pesoPersonalizado;

}else{

peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionCoquina").value;

let precioFinal = productos.coquina.precio * peso;

carrito.push({

nombre:"Coquina",
peso:peso + " kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoCoquina();

}

function abrirProductoChopito(){

    if(window.innerWidth <= 768){

        window.location.href="producto.html?producto=chopito";

    }else{

        document.getElementById("modalChopito").style.display="flex";

        document.getElementById("pesoChopito").value="1";

        actualizarPrecioChopito();

    }

}

function cerrarProductoChopito(){

document.getElementById("modalChopito").style.display="none";

}

function actualizarPrecioChopito(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoChopito").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoChopito").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 35 * peso;

document.getElementById("precioChopito").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarChopito(){

let pesoSeleccionado=
parseFloat(document.getElementById("pesoChopito").value);

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoChopito").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

    peso=pesoPersonalizado;

}else{

    peso=pesoSeleccionado;

}

let preparacion=
document.getElementById("preparacionChopito").value;

let precioFinal=35*peso;

carrito.push({

nombre:"Chopito",
peso:peso+" kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText=carrito.length;

actualizarCarrito();

cerrarProductoChopito();

}
function abrirProductoGalera(){

    if(window.innerWidth <= 768){

        window.location.href="producto.html?producto=galera";

    }else{

        document.getElementById("modalGalera").style.display="flex";

        document.getElementById("pesoGalera").value="1";

        actualizarPrecioGalera();

    }

}

function cerrarProductoGalera(){

document.getElementById("modalGalera").style.display="none";

}

function actualizarPrecioGalera(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoGalera").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoGalera").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 6.5 * peso;

document.getElementById("precioGalera").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarGalera(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoGalera").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoGalera").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionGalera").value;

let precioFinal = 6.5 * peso;

carrito.push({

    nombre:"Galera",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoGalera();

}
function abrirProductoGambaBlanca(){

    if(window.innerWidth <= 768){

        window.location.href="producto.html?producto=gambablanca";

    }else{

        document.getElementById("modalGambaBlanca").style.display="flex";

        document.getElementById("pesoGambaBlanca").value="1";

        actualizarPrecioGambaBlanca();

    }

}

function cerrarProductoGambaBlanca(){

    document.getElementById("modalGambaBlanca").style.display="none";

}

function actualizarPrecioGambaBlanca(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoGambaBlanca").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoGambaBlanca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 18 * peso;

document.getElementById("precioGambaBlanca").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarGambaBlanca(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoGambaBlanca").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoGambaBlanca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionGambaBlanca").value;

let precioFinal = 18 * peso;

carrito.push({

    nombre:"Gamba Blanca",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoGambaBlanca();

}
function abrirProductoGambaCristal(){

if(window.innerWidth<=768){

window.location.href="producto.html?producto=gambacristal";

return;

}

document.getElementById("modalGambaCristal").style.display="flex";

document.getElementById("pesoGambaCristal").value="1";
document.getElementById("pesoPersonalizadoGambaCristal").value="";

actualizarPrecioGambaCristal();

}

function cerrarProductoGambaCristal(){

document.getElementById("modalGambaCristal").style.display="none";

}

function actualizarPrecioGambaCristal(){

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoGambaCristal").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoGambaCristal").value);

}

let total=20*peso;

document.getElementById("precioGambaCristal").innerText=
"Total: "+total.toFixed(2)+" €";

}

function agregarGambaCristal(){

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoGambaCristal").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoGambaCristal").value);

}

let preparacion=
document.getElementById("preparacionGambaCristal").value;

let precioFinal=20*peso;

carrito.push({

nombre:"Gamba Cristal",
peso:peso.toFixed(3)+" kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText=
carrito.length;

actualizarCarrito();

cerrarProductoGambaCristal();

}
function abrirProductoGambaRoja(){

if(window.innerWidth<=768){

window.location.href="producto.html?producto=gambaroja";

return;

}

document.getElementById("modalGambaRoja").style.display="flex";

document.getElementById("pesoGambaRoja").value="1";
document.getElementById("pesoPersonalizadoGambaRoja").value="";

actualizarPrecioGambaRoja();

}

function cerrarProductoGambaRoja(){

document.getElementById("modalGambaRoja").style.display="none";

}

function actualizarPrecioGambaRoja(){

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoGambaRoja").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoGambaRoja").value);

}

let total=110*peso;

document.getElementById("precioGambaRoja").innerText=
"Total: "+total.toFixed(2)+"€";

}

function agregarGambaRoja(){

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoGambaRoja").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoGambaRoja").value);

}

let preparacion=
document.getElementById("preparacionGambaRoja").value;

let precioFinal=110*peso;

carrito.push({

nombre:"Gamba Roja",
peso:peso.toFixed(3)+" kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText=
carrito.length;

actualizarCarrito();

cerrarProductoGambaRoja();

}
function abrirProductoJibia(){

if(window.innerWidth<=768){

window.location.href="producto.html?producto=jibia";

return;

}

document.getElementById("modalJibia").style.display="flex";

document.getElementById("pesoJibia").value="1";
document.getElementById("pesoPersonalizadoJibia").value="";

actualizarPrecioJibia();

}

function cerrarProductoJibia(){

document.getElementById("modalJibia").style.display="none";

}

function actualizarPrecioJibia(){

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoJibia").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoJibia").value);

}

let total=12*peso;

document.getElementById("precioJibia").innerText=
"Total: "+total.toFixed(2)+"€";

}

function agregarJibia(){

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoJibia").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoJibia").value);

}

let preparacion=
document.getElementById("preparacionJibia").value;

let precioFinal=12*peso;

carrito.push({

nombre:"Jibia o Choco",
peso:peso.toFixed(3)+" kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText=
carrito.length;

actualizarCarrito();

cerrarProductoJibia();

}
function abrirProductoLangostinoTigre(){

if(window.innerWidth<=768){

window.location.href="producto.html?producto=langostinotigre";

return;

}

document.getElementById("modalLangostinoTigre").style.display="flex";

document.getElementById("pesoLangostinoTigre").value="1";
document.getElementById("pesoPersonalizadoLangostinoTigre").value="";

actualizarPrecioLangostinoTigre();

}

function cerrarProductoLangostinoTigre(){

document.getElementById("modalLangostinoTigre").style.display="none";

}

function actualizarPrecioLangostinoTigre(){

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoLangostinoTigre").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoLangostinoTigre").value);

}

let total=45*peso;

document.getElementById("precioLangostinoTigre").innerText=
"Total: "+total.toFixed(2)+"€";

}

function agregarLangostinoTigre(){

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoLangostinoTigre").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoLangostinoTigre").value);

}

let preparacion=
document.getElementById("preparacionLangostinoTigre").value;

let precioFinal=45*peso;

carrito.push({

nombre:"Langostino Tigre",
peso:peso.toFixed(3)+" kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText=
carrito.length;

actualizarCarrito();

cerrarProductoLangostinoTigre();

}
function abrirProductoLongueron(){

if(window.innerWidth<=768){

window.location.href="producto.html?producto=longueron";

return;

}

document.getElementById("modalLongueron").style.display="flex";

document.getElementById("pesoLongueron").value="1";
document.getElementById("pesoPersonalizadoLongueron").value="";

actualizarPrecioLongueron();

}

function cerrarProductoLongueron(){

document.getElementById("modalLongueron").style.display="none";

}

function actualizarPrecioLongueron(){

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoLongueron").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoLongueron").value);

}

let total=11*peso;

document.getElementById("precioLongueron").innerText=
"Total: "+total.toFixed(2)+"€";

}

function agregarLongueron(){

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoLongueron").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoLongueron").value);

}

let preparacion=
document.getElementById("preparacionLongueron").value;

let precioFinal=11*peso;

carrito.push({

nombre:"Longuerón",
peso:peso.toFixed(3)+" kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText=
carrito.length;

actualizarCarrito();

cerrarProductoLongueron();

}
function abrirProductoMejillonRoca(){

if(window.innerWidth<=768){

window.location.href="producto.html?producto=mejillonroca";

return;

}

document.getElementById("modalMejillonRoca").style.display="flex";

document.getElementById("pesoMejillonRoca").value="1";
document.getElementById("pesoPersonalizadoMejillonRoca").value="";

actualizarPrecioMejillonRoca();

}

function cerrarProductoMejillonRoca(){

document.getElementById("modalMejillonRoca").style.display="none";

}

function actualizarPrecioMejillonRoca(){

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoMejillonRoca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoMejillonRoca").value);

}

let total=5.5*peso;

document.getElementById("precioMejillonRoca").innerText=
"Total: "+total.toFixed(2)+"€";

}

function agregarMejillonRoca(){

let pesoPersonalizado=
parseFloat(document.getElementById("pesoPersonalizadoMejillonRoca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado>0){

peso=pesoPersonalizado;

}else{

peso=parseFloat(document.getElementById("pesoMejillonRoca").value);

}

let preparacion=
document.getElementById("preparacionMejillonRoca").value;

let precioFinal=5.5*peso;

carrito.push({

nombre:"Mejillón Roca",
peso:peso.toFixed(3)+" kg",
preparacion:preparacion,
precio:precioFinal

});

document.getElementById("contadorCarrito").innerText=
carrito.length;

actualizarCarrito();

cerrarProductoMejillonRoca();

}
function abrirProductoMejillon(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=mejillon";

    }else{

        document.getElementById("modalMejillon").style.display = "flex";

        document.getElementById("pesoMejillon").value = "1";

        actualizarPrecioMejillon();

    }

}

function cerrarProductoMejillon(){

    document.getElementById("modalMejillon").style.display="none";

}

function actualizarPrecioMejillon(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoMejillon").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoMejillon").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 3.5 * peso;

document.getElementById("precioMejillon").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarMejillon(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoMejillon").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoMejillon").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionMejillon").value;

let precioFinal = 3.5 * peso;

carrito.push({

    nombre:"Mejillón",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoMejillon();

}
function abrirProductoNavaja(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=navaja";

    }else{

        document.getElementById("modalNavaja").style.display = "flex";

        document.getElementById("pesoNavaja").value = "1";

        actualizarPrecioNavaja();

    }

}

function cerrarProductoNavaja(){

    document.getElementById("modalNavaja").style.display="none";

}

function actualizarPrecioNavaja(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoNavaja").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoNavaja").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 9 * peso;

document.getElementById("precioNavaja").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarNavaja(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoNavaja").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoNavaja").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionNavaja").value;

let precioFinal = 9 * peso;

carrito.push({

    nombre:"Navaja",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoNavaja();

}
function abrirProductoOstra(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=ostra";

    }else{

        document.getElementById("modalOstra").style.display="flex";

        document.getElementById("cantidadOstra").value="1";

        actualizarPrecioOstra();

    }

}

function cerrarProductoOstra(){

    document.getElementById("modalOstra").style.display="none";

}

function actualizarPrecioOstra(){

let cantidad =
parseInt(document.getElementById("cantidadOstra").value);

let total = 2.4 * cantidad;

document.getElementById("precioOstra").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarOstra(){

let cantidad =
parseInt(document.getElementById("cantidadOstra").value);

let preparacion =
document.getElementById("preparacionOstra").value;

let precioFinal = 2.4 * cantidad;

carrito.push({

    nombre:"Ostra Guillardeau",
    peso:cantidad + " unidades",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoOstra();

}
function abrirProductoPotaBlanca(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=potablanca";

    }else{

        document.getElementById("modalPotaBlanca").style.display = "flex";

        document.getElementById("pesoPotaBlanca").value = "1";

        actualizarPrecioPotaBlanca();

    }

}

function cerrarProductoPotaBlanca(){

    document.getElementById("modalPotaBlanca").style.display="none";

}

function actualizarPrecioPotaBlanca(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPotaBlanca").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPotaBlanca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 6 * peso;

document.getElementById("precioPotaBlanca").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarPotaBlanca(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPotaBlanca").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPotaBlanca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionPotaBlanca").value;

let precioFinal = 6 * peso;

carrito.push({

    nombre:"Pota Blanca",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoPotaBlanca();

}
function abrirProductoPotaNegra(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=potanegra";

    }else{

        document.getElementById("modalPotaNegra").style.display = "flex";

        document.getElementById("pesoPotaNegra").value = "1";

        actualizarPrecioPotaNegra();

    }

}

function cerrarProductoPotaNegra(){

    document.getElementById("modalPotaNegra").style.display="none";

}

function actualizarPrecioPotaNegra(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPotaNegra").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPotaNegra").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 10.5 * peso;

document.getElementById("precioPotaNegra").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarPotaNegra(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPotaNegra").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPotaNegra").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionPotaNegra").value;

let precioFinal = 10.5 * peso;

carrito.push({

    nombre:"Pota Negra",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoPotaNegra();

}
function abrirProductoPulpoBlanco(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=pulpoblanco";

    }else{

        document.getElementById("modalPulpoBlanco").style.display = "flex";

        document.getElementById("pesoPulpoBlanco").value = "1";

        actualizarPrecioPulpoBlanco();

    }

}

function cerrarProductoPulpoBlanco(){

    document.getElementById("modalPulpoBlanco").style.display = "none";

}

function actualizarPrecioPulpoBlanco(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPulpoBlanco").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPulpoBlanco").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 5.5 * peso;

document.getElementById("precioPulpoBlanco").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarPulpoBlanco(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPulpoBlanco").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPulpoBlanco").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionPulpoBlanco").value;

let precioFinal = 5.5 * peso;

carrito.push({

    nombre:"Pulpo Blanco O Amizclado",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoPulpoBlanco();

}
function abrirProductoPulpoRoca(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=pulporoca";

    }else{

        document.getElementById("modalPulpoRoca").style.display = "flex";

        document.getElementById("pesoPulpoRoca").value = "1";

        actualizarPrecioPulpoRoca();

    }

}

function cerrarProductoPulpoRoca(){

    document.getElementById("modalPulpoRoca").style.display = "none";

}

function actualizarPrecioPulpoRoca(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPulpoRoca").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPulpoRoca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 15 * peso;

document.getElementById("precioPulpoRoca").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarPulpoRoca(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPulpoRoca").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPulpoRoca").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionPulpoRoca").value;

let precioFinal = 15 * peso;

carrito.push({

    nombre:"Pulpo Roca",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoPulpoRoca();

}
function abrirProductoPuntillitas(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=puntillitas";

    }else{

        document.getElementById("modalPuntillitas").style.display = "flex";

        document.getElementById("pesoPuntillitas").value = "1";

        actualizarPrecioPuntillitas();

    }

}

function cerrarProductoPuntillitas(){

    document.getElementById("modalPuntillitas").style.display = "none";

}

function actualizarPrecioPuntillitas(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPuntillitas").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPuntillitas").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 40 * peso;

document.getElementById("precioPuntillitas").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarPuntillitas(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoPuntillitas").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoPuntillitas").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionPuntillitas").value;

let precioFinal = 40 * peso;

carrito.push({

    nombre:"Puntillitas",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoPuntillitas();

}
function abrirProductoQuisquilla(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=quisquilla";

    }else{

        document.getElementById("modalQuisquilla").style.display = "flex";

        document.getElementById("pesoQuisquilla").value = "1";

        actualizarPrecioQuisquilla();

    }

}

function cerrarProductoQuisquilla(){

    document.getElementById("modalQuisquilla").style.display = "none";

}

function actualizarPrecioQuisquilla(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoQuisquilla").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoQuisquilla").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 70 * peso;

document.getElementById("precioQuisquilla").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarQuisquilla(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoQuisquilla").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoQuisquilla").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionQuisquilla").value;

let precioFinal = 70 * peso;

carrito.push({

    nombre:"Quisquilla",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoQuisquilla();

}
function abrirProductoVieira(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=vieira";

    }else{

        document.getElementById("modalVieira").style.display = "flex";

        document.getElementById("cantidadVieira").value = "6";

        actualizarPrecioVieira();

    }

}

function cerrarProductoVieira(){

    document.getElementById("modalVieira").style.display = "none";

}

function actualizarPrecioVieira(){

let cantidad =
parseInt(document.getElementById("cantidadVieira").value);

let total = 4 * cantidad;

document.getElementById("precioVieira").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarVieira(){

let cantidad =
parseInt(document.getElementById("cantidadVieira").value);

let preparacion =
document.getElementById("preparacionVieira").value;

let precioFinal = 4 * cantidad;

carrito.push({

    nombre:"Vieira",
    peso:cantidad + " unidades",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoVieira();

}
function abrirProductoZamburina(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=zamburina";

    }else{

        document.getElementById("modalZamburina").style.display = "flex";

        document.getElementById("cantidadZamburina").value = "6";

        actualizarPrecioZamburina();

    }

}

function cerrarProductoZamburina(){

    document.getElementById("modalZamburina").style.display = "none";

}

function actualizarPrecioZamburina(){

let cantidad =
parseInt(document.getElementById("cantidadZamburina").value);

let total = 3.5 * cantidad;

document.getElementById("precioZamburina").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarZamburina(){

let cantidad =
parseInt(document.getElementById("cantidadZamburina").value);

let preparacion =
document.getElementById("preparacionZamburina").value;

let precioFinal = 3.5 * cantidad;

carrito.push({

    nombre:"Zamburiña",
    peso:cantidad + " unidades",
    preparacion:preparacion,
    precio:precioFinal

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarProductoZamburina();

}
function abrirProductoDorada(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=dorada";

    }else{

        document.getElementById("modalDorada").style.display="flex";

        document.getElementById("pesoDorada").value="1";
        document.getElementById("pesoPersonalizadoDorada").value="";

        actualizarPrecioDorada();

    }

}

function cerrarProductoDorada(){

    document.getElementById("modalDorada").style.display="none";

}

function actualizarPrecioDorada(){

    let precio =
    parseFloat(document.getElementById("procedenciaDorada").value);

    let peso =
    parseFloat(document.getElementById("pesoDorada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoDorada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioDorada").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarDorada(){

    let peso =
    parseFloat(document.getElementById("pesoDorada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoDorada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionDorada").value;

    let selector =
    document.getElementById("procedenciaDorada");

    let nombreProducto =
    "🐟 Dorada - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoDorada();

}
function abrirProductoLubina(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=lubina";

    }else{

        document.getElementById("modalLubina").style.display = "flex";

        document.getElementById("pesoLubina").value = "1";
        document.getElementById("pesoPersonalizadoLubina").value = "";

        actualizarPrecioLubina();

    }

}

function cerrarProductoLubina(){

    document.getElementById("modalLubina").style.display = "none";

}

function actualizarPrecioLubina(){

    let precio =
    parseFloat(document.getElementById("procedenciaLubina").value);

    let peso =
    parseFloat(document.getElementById("pesoLubina").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLubina").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioLubina").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarLubina(){

    let peso =
    parseFloat(document.getElementById("pesoLubina").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLubina").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionLubina").value;

    let selector =
    document.getElementById("procedenciaLubina");

    let nombreProducto =
    "🐟 Lubina - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoLubina();

}
function abrirProductoPargo(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=pargo";

    }else{

        document.getElementById("modalPargo").style.display = "flex";

        document.getElementById("pesoPargo").value = "1";
        document.getElementById("pesoPersonalizadoPargo").value = "";

        actualizarPrecioPargo();

    }

}

function cerrarProductoPargo(){

    document.getElementById("modalPargo").style.display = "none";

}

function actualizarPrecioPargo(){

    let precio =
    parseFloat(document.getElementById("procedenciaPargo").value);

    let peso =
    parseFloat(document.getElementById("pesoPargo").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPargo").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioPargo").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarPargo(){

    let peso =
    parseFloat(document.getElementById("pesoPargo").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPargo").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionPargo").value;

    let selector =
    document.getElementById("procedenciaPargo");

    let nombreProducto =
    "🐟 Pargo - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoPargo();

}
function abrirProductoPerca(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=perca";

    }else{

        document.getElementById("modalPerca").style.display = "flex";

        document.getElementById("pesoPerca").value = "1";
        document.getElementById("pesoPersonalizadoPerca").value = "";

        actualizarPrecioPerca();

    }

}

function cerrarProductoPerca(){

    document.getElementById("modalPerca").style.display = "none";

}

function actualizarPrecioPerca(){

    let precio =
    parseFloat(document.getElementById("procedenciaPerca").value);

    let peso =
    parseFloat(document.getElementById("pesoPerca").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPerca").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioPerca").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarPerca(){

    let peso =
    parseFloat(document.getElementById("pesoPerca").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPerca").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionPerca").value;

    let selector =
    document.getElementById("procedenciaPerca");

    let nombreProducto =
    "🐟 Perca - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoPerca();

}
function abrirProductoRodaballo(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=rodaballo";

    }else{

        document.getElementById("modalRodaballo").style.display = "flex";

        document.getElementById("pesoRodaballo").value = "1";
        document.getElementById("pesoPersonalizadoRodaballo").value = "";

        actualizarPrecioRodaballo();

    }

}

function cerrarProductoRodaballo(){

    document.getElementById("modalRodaballo").style.display = "none";

}

function actualizarPrecioRodaballo(){

    let precio =
    parseFloat(document.getElementById("procedenciaRodaballo").value);

    let peso =
    parseFloat(document.getElementById("pesoRodaballo").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoRodaballo").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioRodaballo").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarRodaballo(){

    let peso =
    parseFloat(document.getElementById("pesoRodaballo").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoRodaballo").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionRodaballo").value;

    let selector =
    document.getElementById("procedenciaRodaballo");

    let nombreProducto =
    "🐟 Rodaballo - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoRodaballo();

}
function abrirProductoSalmon(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=salmon";

    }else{

        document.getElementById("modalSalmon").style.display = "flex";

        document.getElementById("pesoSalmon").value = "1";
        document.getElementById("pesoPersonalizadoSalmon").value = "";

        actualizarPrecioSalmon();

    }

}

function cerrarProductoSalmon(){

    document.getElementById("modalSalmon").style.display = "none";

}

function actualizarPrecioSalmon(){

    let precio =
    parseFloat(document.getElementById("procedenciaSalmon").value);

    let peso =
    parseFloat(document.getElementById("pesoSalmon").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoSalmon").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioSalmon").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarSalmon(){

    let peso =
    parseFloat(document.getElementById("pesoSalmon").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoSalmon").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionSalmon").value;

    let selector =
    document.getElementById("procedenciaSalmon");

    let nombreProducto =
    "🐟 Salmón - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoSalmon();

}
let mariscosAbierto = false;

function toggleMariscos(e){

e.stopPropagation();

mariscosAbierto = !mariscosAbierto;

let submenu = document.getElementById("submenuMariscos");
let flecha = document.getElementById("flechaMariscos");

if(!submenu || !flecha) return;

if(mariscosAbierto){
    submenu.classList.add("open");
    flecha.style.transform = "rotate(180deg)";
}else{
    submenu.classList.remove("open");
    flecha.style.transform = "rotate(0deg)";
}

}
document.querySelectorAll(".menu-lateral a").forEach(link=>{
    link.addEventListener("click",()=>{
        let submenu = document.getElementById("submenuMariscos");
        let flecha = document.getElementById("flechaMariscos");

        submenu.classList.remove("open");
        flecha.innerText = "▼";
        mariscosAbierto = false;
    });
});
function abrirAnillas(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=anillas";

    }else{

        document.getElementById("modalAnillas").style.display = "flex";

        document.getElementById("pesoAnillas").value = "1";

        actualizarAnillas();

    }

}

function cerrarAnillas(){

    document.getElementById("modalAnillas").style.display = "none";

}

function actualizarAnillas(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAnillas").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAnillas").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let total = 4.2 * peso;

document.getElementById("precioAnillas").innerText =
"Total: " + total.toFixed(2) + "€";

}

function agregarAnillas(){

let pesoSeleccionado =
parseFloat(document.getElementById("pesoAnillas").value);

let pesoPersonalizado =
parseFloat(document.getElementById("pesoPersonalizadoAnillas").value);

let peso;

if(!isNaN(pesoPersonalizado) && pesoPersonalizado > 0){

    peso = pesoPersonalizado;

}else{

    peso = pesoSeleccionado;

}

let preparacion =
document.getElementById("preparacionAnillas").value;

let precio = 4.2 * peso;

carrito.push({

    nombre:"Anillas",
    peso:peso + " kg",
    preparacion:preparacion,
    precio:precio

});

document.getElementById("contadorCarrito").innerText =
carrito.length;

actualizarCarrito();

cerrarAnillas();

}
function abrirChocoTiras() {

    if (window.innerWidth <= 768) {
        window.location.href = "producto.html?producto=chocotiras";
        return;
    }

    document.getElementById("modalChocoTiras").style.display = "flex";

    document.getElementById("pesoChocoTiras").value = "1";
    document.getElementById("pesoPersonalizadoChocoTiras").value = "";

    actualizarChocoTiras();
}

function cerrarChocoTiras() {
    document.getElementById("modalChocoTiras").style.display = "none";
}

function actualizarChocoTiras() {

    let precio = 3.20;

    let peso = parseFloat(document.getElementById("pesoChocoTiras").value);

    let personalizado = parseFloat(document.getElementById("pesoPersonalizadoChocoTiras").value);

    if (!isNaN(personalizado) && personalizado > 0) {
        peso = personalizado;
    }

    let total = precio * peso;

    document.getElementById("precioChocoTiras").innerHTML =
        "Total: " + total.toFixed(2) + "€";
}

function agregarChocoTiras() {

    let precioKg = 3.20;

    let peso = parseFloat(document.getElementById("pesoChocoTiras").value);

    let personalizado = parseFloat(document.getElementById("pesoPersonalizadoChocoTiras").value);

    if (!isNaN(personalizado) && personalizado > 0) {
        peso = personalizado;
    }

    let preparacion = document.getElementById("preparacionChocoTiras").value;

    let precio = precioKg * peso;

    carrito.push({
        nombre: "Choco en Tiras",
        peso: peso + " kg",
        preparacion: preparacion,
        precio: precio
    });

    document.getElementById("contadorCarrito").innerText = carrito.length;

    actualizarCarrito();

    cerrarChocoTiras();
}
function abrirChoco(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=choco";

    }else{

        document.getElementById("modalChoco").style.display = "flex";

        document.getElementById("pesoChoco").value = "1";
        document.getElementById("pesoPersonalizadoChoco").value = "";

        actualizarChoco();

    }

}

function cerrarChoco(){

    document.getElementById("modalChoco").style.display = "none";

}

function actualizarChoco(){

    let precio =
    parseFloat(document.getElementById("tamanoChoco").value);

    let peso =
    parseFloat(document.getElementById("pesoChoco").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoChoco").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioChoco").innerText =
    "Total: " + total.toFixed(2) + "€";

}

function agregarChoco(){

    let peso =
    parseFloat(document.getElementById("pesoChoco").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoChoco").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionChoco").value;

    let selector =
    document.getElementById("tamanoChoco");

    let nombreProducto =
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(document.getElementById("tamanoChoco").value) * peso;

    carrito.push({

        nombre: nombreProducto,
        peso: peso + " kg",
        preparacion: preparacion,
        precio: precio

    });

    document.getElementById("contadorCarrito").innerText = carrito.length;

    actualizarCarrito();

    cerrarChoco();

}
function abrirBacalao(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=bacalao";

    }else{

        document.getElementById("modalBacalao").style.display = "flex";

        document.getElementById("pesoBacalao").value = "1";
        document.getElementById("pesoPersonalizadoBacalao").value = "";

        actualizarBacalao();

    }

}

function cerrarBacalao(){

    document.getElementById("modalBacalao").style.display = "none";

}

function actualizarBacalao(){

    let precio =
    parseFloat(document.getElementById("tamanoBacalao").value);

    let peso =
    parseFloat(document.getElementById("pesoBacalao").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoBacalao").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioBacalao").innerText =
    "Total: " + total.toFixed(2) + "€";

}

function agregarBacalao(){

    let peso =
    parseFloat(document.getElementById("pesoBacalao").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoBacalao").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionBacalao").value;

    let selector =
    document.getElementById("tamanoBacalao");

    let nombreProducto =
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(document.getElementById("tamanoBacalao").value) * peso;

    carrito.push({

        nombre: nombreProducto,
        peso: peso + " kg",
        preparacion: preparacion,
        precio: precio

    });

    document.getElementById("contadorCarrito").innerText = carrito.length;

    actualizarCarrito();

    cerrarBacalao();

}
function abrirGallineta(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=gallineta";

    }else{

        document.getElementById("modalGallineta").style.display = "flex";

        document.getElementById("pesoGallineta").value = "1";
        document.getElementById("pesoPersonalizadoGallineta").value = "";

        actualizarGallineta();

    }

}

function cerrarGallineta(){

    document.getElementById("modalGallineta").style.display = "none";

}

function actualizarGallineta(){

    let precio = 7.60;

    let peso =
    parseFloat(document.getElementById("pesoGallineta").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoGallineta").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioGallineta").innerText =
    "Total: " + total.toFixed(2) + "€";

}

function agregarGallineta(){

    let peso =
    parseFloat(document.getElementById("pesoGallineta").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoGallineta").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionGallineta").value;

    let precio = 7.60 * peso;

    carrito.push({

        nombre:"🐟 Filete de Gallineta",
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText = carrito.length;

    actualizarCarrito();

    cerrarGallineta();

}
function abrirLangostinoCocido(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=langostinococido";

    }else{

        document.getElementById("modalLangostinoCocido").style.display = "flex";

        document.getElementById("pesoLangostinoCocido").value = "1";
        document.getElementById("pesoPersonalizadoLangostinoCocido").value = "";

        actualizarLangostinoCocido();

    }

}

function cerrarLangostinoCocido(){

    document.getElementById("modalLangostinoCocido").style.display = "none";

}

function actualizarLangostinoCocido(){

    let precio =
    parseFloat(document.getElementById("calibreLangostinoCocido").value);

    let peso =
    parseFloat(document.getElementById("pesoLangostinoCocido").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLangostinoCocido").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioLangostinoCocido").innerText =
    "Total: " + total.toFixed(2) + "€";

}

function agregarLangostinoCocido(){

    let peso =
    parseFloat(document.getElementById("pesoLangostinoCocido").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLangostinoCocido").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionLangostinoCocido").value;

    let selector =
    document.getElementById("calibreLangostinoCocido");

    let nombreProducto =
    "🦐 Langostino Cocido - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(document.getElementById("calibreLangostinoCocido").value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText = carrito.length;

    actualizarCarrito();

    cerrarLangostinoCocido();

}
function abrirPulpoEntero(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=pulpoentero";

    }else{

        document.getElementById("modalPulpoEntero").style.display = "flex";

        document.getElementById("pesoPulpoEntero").value = "1";
        document.getElementById("pesoPersonalizadoPulpoEntero").value = "";

        actualizarPulpoEntero();

    }

}

function cerrarPulpoEntero(){

    document.getElementById("modalPulpoEntero").style.display = "none";

}

function actualizarPulpoEntero(){

    let precio =
    parseFloat(document.getElementById("tamanoPulpoEntero").value);

    let peso =
    parseFloat(document.getElementById("pesoPulpoEntero").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPulpoEntero").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioPulpoEntero").innerText =
    "Total: " + total.toFixed(2) + "€";

}

function agregarPulpoEntero(){

    let peso =
    parseFloat(document.getElementById("pesoPulpoEntero").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPulpoEntero").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionPulpoEntero").value;

    let selector =
    document.getElementById("tamanoPulpoEntero");

    let nombreProducto =
    "🐙 Pulpo Cocido Entero " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(document.getElementById("tamanoPulpoEntero").value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText = carrito.length;

    actualizarCarrito();

    cerrarPulpoEntero();

}
function abrirPatasPulpo(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=pataspulpo";

    }else{

        document.getElementById("modalPatasPulpo").style.display = "flex";

        document.getElementById("pesoPatasPulpo").value = "1";
        document.getElementById("pesoPersonalizadoPatasPulpo").value = "";

        actualizarPatasPulpo();

    }

}

function cerrarPatasPulpo(){

    document.getElementById("modalPatasPulpo").style.display = "none";

}

function actualizarPatasPulpo(){

    let precio =
    parseFloat(document.getElementById("tamanoPatasPulpo").value);

    let peso =
    parseFloat(document.getElementById("pesoPatasPulpo").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPatasPulpo").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioPatasPulpo").innerText =
    "Total: " + total.toFixed(2) + "€";

}

function agregarPatasPulpo(){

    let peso =
    parseFloat(document.getElementById("pesoPatasPulpo").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPatasPulpo").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionPatasPulpo").value;

    let selector =
    document.getElementById("tamanoPatasPulpo");

    let nombreProducto =
    "🐙 Patas de Pulpo Cocidas " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(document.getElementById("tamanoPatasPulpo").value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText = carrito.length;

    actualizarCarrito();

    cerrarPatasPulpo();

}
function abrirRosada(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=rosada";

    }else{

        document.getElementById("modalRosada").style.display = "flex";

        document.getElementById("pesoRosada").value = "1";
        document.getElementById("pesoPersonalizadoRosada").value = "";

        actualizarRosada();

    }

}

function cerrarRosada(){

    document.getElementById("modalRosada").style.display = "none";

}

function actualizarRosada(){

    let precio = 10.00;

    let peso =
    parseFloat(document.getElementById("pesoRosada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoRosada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioRosada").innerText =
    "Total: " + total.toFixed(2) + "€";

}

function agregarRosada(){

    let peso =
    parseFloat(document.getElementById("pesoRosada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoRosada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionRosada").value;

    let precio = 10.00 * peso;

    carrito.push({

        nombre:"🐟 Filete de Rosada",
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText = carrito.length;

    actualizarCarrito();

    cerrarRosada();

}
function abrirRejosPota(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=rejospota";

    }else{

        document.getElementById("modalRejosPota").style.display = "flex";

        document.getElementById("pesoRejosPota").value = "1";
        document.getElementById("pesoPersonalizadoRejosPota").value = "";

        actualizarRejosPota();

    }

}

function cerrarRejosPota(){

    document.getElementById("modalRejosPota").style.display = "none";

}

function actualizarRejosPota(){

    let precio = 8.00;

    let peso =
    parseFloat(document.getElementById("pesoRejosPota").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoRejosPota").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioRejosPota").innerText =
    "Total: " + total.toFixed(2) + "€";

}

function agregarRejosPota(){

    let peso =
    parseFloat(document.getElementById("pesoRejosPota").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoRejosPota").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionRejosPota").value;

    let precio = 8.00 * peso;

    carrito.push({

        nombre:"🦑 Rejos de Pota",
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText = carrito.length;

    actualizarCarrito();

    cerrarRejosPota();

}

function abrirProductoBogavante(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=bogavante";

    }else{

        document.getElementById("modalBogavante").style.display="flex";

        document.getElementById("pesoBogavante").value="1";
        document.getElementById("pesoPersonalizadoBogavante").value="";

        actualizarPrecioBogavante();

    }

}

function cerrarProductoBogavante(){

    document.getElementById("modalBogavante").style.display="none";

}

function actualizarPrecioBogavante(){

    let precio =
    parseFloat(document.getElementById("tipoBogavante").value);

    let peso =
    parseFloat(document.getElementById("pesoBogavante").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoBogavante").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioBogavante").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarBogavante(){

    let peso =
    parseFloat(document.getElementById("pesoBogavante").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoBogavante").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionBogavante").value;

    let selector =
    document.getElementById("tipoBogavante");

    let nombreProducto =
    "🦞 Bogavante - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoBogavante();

}
function abrirProductoCarabineroCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=carabinero-congelado";

    }else{

        document.getElementById("modalCarabineroCongelado").style.display="flex";

        document.getElementById("pesoCarabineroCongelado").value="1";
        document.getElementById("pesoPersonalizadoCarabineroCongelado").value="";

        actualizarPrecioCarabinero();

    }

}

function abrirProductoCarabinero(){

    abrirProductoCarabineroCongelado();

}

function cerrarProductoCarabinero(){

    document.getElementById("modalCarabineroCongelado").style.display="none";

}

function actualizarPrecioCarabinero(){

    let precio =
    parseFloat(document.getElementById("tipoCarabineroCongelado").value);

    let peso =
    parseFloat(document.getElementById("pesoCarabineroCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoCarabineroCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioCarabineroCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarCarabinero(){

    let peso =
    parseFloat(document.getElementById("pesoCarabineroCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoCarabineroCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionCarabineroCongelado").value;

    let selector =
    document.getElementById("tipoCarabineroCongelado");

    let nombreProducto =
    "🦐 Carabinero congelado - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoCarabinero();

}
function abrirProductoGambaRojaCongelada(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=gambarojacongelada";

    }else{

        document.getElementById("modalGambaRojaCongelada").style.display="flex";

        document.getElementById("pesoGambaRojaCongelada").value="1";
        document.getElementById("pesoPersonalizadoGambaRojaCongelada").value="";

        actualizarPrecioGambaRojaCongelada();

    }

}

function cerrarProductoGambaRojaCongelada(){

    document.getElementById("modalGambaRojaCongelada").style.display="none";

}

function actualizarPrecioGambaRojaCongelada(){

    let precio =
    parseFloat(document.getElementById("tipoGambaRojaCongelada").value);

    let peso =
    parseFloat(document.getElementById("pesoGambaRojaCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoGambaRojaCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioGambaRojaCongelada").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarGambaRojaCongelada(){

    let peso =
    parseFloat(document.getElementById("pesoGambaRojaCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoGambaRojaCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionGambaRojaCongelada").value;

    let selector =
    document.getElementById("tipoGambaRojaCongelada");

    let nombreProducto =
    "🦐 Gamba Roja / Alistado - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoGambaRojaCongelada();

}
function abrirProductoGambaBlancaCongelada(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=gambablancacongelada";

    }else{

        document.getElementById("modalGambaBlancaCongelada").style.display="flex";

        document.getElementById("pesoGambaBlancaCongelada").value="1";
        document.getElementById("pesoPersonalizadoGambaBlancaCongelada").value="";

        actualizarPrecioGambaBlancaCongelada();

    }

}

function cerrarProductoGambaBlancaCongelada(){

    document.getElementById("modalGambaBlancaCongelada").style.display="none";

}

function actualizarPrecioGambaBlancaCongelada(){

    let precio =
    parseFloat(document.getElementById("tipoGambaBlancaCongelada").value);

    let peso =
    parseFloat(document.getElementById("pesoGambaBlancaCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoGambaBlancaCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioGambaBlancaCongelada").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarGambaBlancaCongelada(){

    let peso =
    parseFloat(document.getElementById("pesoGambaBlancaCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoGambaBlancaCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let preparacion =
    document.getElementById("preparacionGambaBlancaCongelada").value;

    let selector =
    document.getElementById("tipoGambaBlancaCongelada");

    let nombreProducto =
    "🦐 Gamba Blanca Congelada - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        preparacion:preparacion,
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoGambaBlancaCongelada();

}
function abrirProductoCristalGambusinoCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=cristalgambusinocongelado";

    }else{

        document.getElementById("modalCristalGambusinoCongelado").style.display="flex";

        document.getElementById("pesoCristalGambusinoCongelado").value="1";
        document.getElementById("pesoPersonalizadoCristalGambusinoCongelado").value="";

        actualizarPrecioCristalGambusinoCongelado();

    }

}

function cerrarProductoCristalGambusinoCongelado(){

    document.getElementById("modalCristalGambusinoCongelado").style.display="none";

}

function actualizarPrecioCristalGambusinoCongelado(){

    let precio = 9.90;

    let peso =
    parseFloat(document.getElementById("pesoCristalGambusinoCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoCristalGambusinoCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioCristalGambusinoCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarCristalGambusinoCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoCristalGambusinoCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoCristalGambusinoCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let nombreProducto =
    "🦐 Cristal / Gambusino Congelado";

    let precio =
    9.90 * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoCristalGambusinoCongelado();

}
function abrirProductoQuisquillaCongelada(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=quisquillacongeleada";

    }else{

        document.getElementById("modalQuisquillaCongelada").style.display="flex";

        document.getElementById("pesoQuisquillaCongelada").value="1";
        document.getElementById("pesoPersonalizadoQuisquillaCongelada").value="";

        actualizarPrecioQuisquillaCongelada();

    }

}

function cerrarProductoQuisquillaCongelada(){

    document.getElementById("modalQuisquillaCongelada").style.display="none";

}

function actualizarPrecioQuisquillaCongelada(){

    let precio =
    parseFloat(document.getElementById("tipoQuisquillaCongelada").value);

    let peso =
    parseFloat(document.getElementById("pesoQuisquillaCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoQuisquillaCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioQuisquillaCongelada").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarQuisquillaCongelada(){

    let peso =
    parseFloat(document.getElementById("pesoQuisquillaCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoQuisquillaCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoQuisquillaCongelada");

    let nombreProducto =
    "🦐 Quisquilla Congelada - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoQuisquillaCongelada();

}
function abrirProductoCigalaCongelada(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=cigalacongelada";

    }else{

        document.getElementById("modalCigalaCongelada").style.display="flex";

        document.getElementById("pesoCigalaCongelada").value="1";
        document.getElementById("pesoPersonalizadoCigalaCongelada").value="";

        actualizarPrecioCigalaCongelada();

    }

}

function cerrarProductoCigalaCongelada(){

    document.getElementById("modalCigalaCongelada").style.display="none";

}

function actualizarPrecioCigalaCongelada(){

    let precio =
    parseFloat(document.getElementById("tipoCigalaCongelada").value);

    let peso =
    parseFloat(document.getElementById("pesoCigalaCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoCigalaCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioCigalaCongelada").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarCigalaCongelada(){

    let peso =
    parseFloat(document.getElementById("pesoCigalaCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoCigalaCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoCigalaCongelada");

    let nombreProducto =
    "🦐 Cigala Congelada - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoCigalaCongelada();

}
function abrirProductoGambonCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=gamboncongelado";

    }else{

        document.getElementById("modalGambonCongelado").style.display="flex";

        document.getElementById("pesoGambonCongelado").value="1";
        document.getElementById("pesoPersonalizadoGambonCongelado").value="";

        actualizarPrecioGambonCongelado();

    }

}

function cerrarProductoGambonCongelado(){

    document.getElementById("modalGambonCongelado").style.display="none";

}

function actualizarPrecioGambonCongelado(){

    let precio =
    parseFloat(document.getElementById("tipoGambonCongelado").value);

    let peso =
    parseFloat(document.getElementById("pesoGambonCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoGambonCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioGambonCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarGambonCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoGambonCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoGambonCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoGambonCongelado");

    let nombreProducto =
    "🦐 Gambón Congelado - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoGambonCongelado();

}
function abrirProductoLangostinoRayadoCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=langostinorayadocongelado";

    }else{

        document.getElementById("modalLangostinoRayadoCongelado").style.display="flex";

        document.getElementById("pesoLangostinoRayadoCongelado").value="1";
        document.getElementById("pesoPersonalizadoLangostinoRayadoCongelado").value="";

        actualizarPrecioLangostinoRayadoCongelado();

    }

}

function cerrarProductoLangostinoRayadoCongelado(){

    document.getElementById("modalLangostinoRayadoCongelado").style.display="none";

}

function actualizarPrecioLangostinoRayadoCongelado(){

    let precio =
    parseFloat(document.getElementById("tipoLangostinoRayadoCongelado").value);

    let peso =
    parseFloat(document.getElementById("pesoLangostinoRayadoCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLangostinoRayadoCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioLangostinoRayadoCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarLangostinoRayadoCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoLangostinoRayadoCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLangostinoRayadoCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoLangostinoRayadoCongelado");

    let nombreProducto =
    "🦐 Langostino Rayado Tipo Sanlúcar - Túnez - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoLangostinoRayadoCongelado();

}
function abrirProductoLangostinoBlancoCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=langostinoblancocongelado";

    }else{

        document.getElementById("modalLangostinoBlancoCongelado").style.display="flex";

        document.getElementById("pesoLangostinoBlancoCongelado").value="1";
        document.getElementById("pesoPersonalizadoLangostinoBlancoCongelado").value="";

        actualizarPrecioLangostinoBlancoCongelado();

    }

}

function cerrarProductoLangostinoBlancoCongelado(){

    document.getElementById("modalLangostinoBlancoCongelado").style.display="none";

}

function actualizarPrecioLangostinoBlancoCongelado(){

    let precio =
    parseFloat(document.getElementById("tipoLangostinoBlancoCongelado").value);

    let peso =
    parseFloat(document.getElementById("pesoLangostinoBlancoCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLangostinoBlancoCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioLangostinoBlancoCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarLangostinoBlancoCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoLangostinoBlancoCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLangostinoBlancoCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoLangostinoBlancoCongelado");

    let nombreProducto =
    "🦐 Langostino Blanco Salvaje - Túnez - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoLangostinoBlancoCongelado();

}
function abrirProductoLangostinoVannameiCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=langostinovannameicongelado";

    }else{

        document.getElementById("modalLangostinoVannameiCongelado").style.display="flex";

        document.getElementById("pesoLangostinoVannameiCongelado").value="1";
        document.getElementById("pesoPersonalizadoLangostinoVannameiCongelado").value="";

        actualizarPrecioLangostinoVannameiCongelado();

    }

}

function cerrarProductoLangostinoVannameiCongelado(){

    document.getElementById("modalLangostinoVannameiCongelado").style.display="none";

}

function actualizarPrecioLangostinoVannameiCongelado(){

    let precio =
    parseFloat(document.getElementById("tipoLangostinoVannameiCongelado").value);

    let peso =
    parseFloat(document.getElementById("pesoLangostinoVannameiCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLangostinoVannameiCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioLangostinoVannameiCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarLangostinoVannameiCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoLangostinoVannameiCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLangostinoVannameiCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoLangostinoVannameiCongelado");

    let nombreProducto =
    "🦐 Langostino Vannamei Congelado - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoLangostinoVannameiCongelado();

}
function abrirProductoZamburinaCongelada(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=zamburinacongelada";

    }else{

        document.getElementById("modalZamburinaCongelada").style.display="flex";

        document.getElementById("pesoZamburinaCongelada").value="1";
        document.getElementById("pesoPersonalizadoZamburinaCongelada").value="";

        actualizarPrecioZamburinaCongelada();

    }

}

function cerrarProductoZamburinaCongelada(){

    document.getElementById("modalZamburinaCongelada").style.display="none";

}

function actualizarPrecioZamburinaCongelada(){

    let precio =
    parseFloat(document.getElementById("tipoZamburinaCongelada").value);

    let peso =
    parseFloat(document.getElementById("pesoZamburinaCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoZamburinaCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioZamburinaCongelada").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarZamburinaCongelada(){

    let peso =
    parseFloat(document.getElementById("pesoZamburinaCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoZamburinaCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoZamburinaCongelada");

    let nombreProducto =
    "🦪 Zamburiña Congelada - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoZamburinaCongelada();

}
function abrirProductoMejillonPasteurizadoCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=mejillonpasteurizadocongelado";

    }else{

        document.getElementById("modalMejillonPasteurizadoCongelado").style.display="flex";

        document.getElementById("pesoMejillonPasteurizadoCongelado").value="1";
        document.getElementById("pesoPersonalizadoMejillonPasteurizadoCongelado").value="";

        actualizarPrecioMejillonPasteurizadoCongelado();

    }

}

function cerrarProductoMejillonPasteurizadoCongelado(){

    document.getElementById("modalMejillonPasteurizadoCongelado").style.display="none";

}

function actualizarPrecioMejillonPasteurizadoCongelado(){

    let precio = 3.85;

    let peso =
    parseFloat(document.getElementById("pesoMejillonPasteurizadoCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoMejillonPasteurizadoCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioMejillonPasteurizadoCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarMejillonPasteurizadoCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoMejillonPasteurizadoCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoMejillonPasteurizadoCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let precio = 3.85;

    carrito.push({

        nombre:"🦪 Mejillón Pasteurizado Congelado",
        peso:peso + " kg",
        precio:precio * peso

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoMejillonPasteurizadoCongelado();

}
function abrirProductoPulpoCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=pulpocongelado";

    }else{

        document.getElementById("modalPulpoCongelado").style.display="flex";

        document.getElementById("pesoPulpoCongelado").value="1";
        document.getElementById("pesoPersonalizadoPulpoCongelado").value="";

        actualizarPrecioPulpoCongelado();

    }

}

function cerrarProductoPulpoCongelado(){

    document.getElementById("modalPulpoCongelado").style.display="none";

}

function actualizarPrecioPulpoCongelado(){

    let precio =
    parseFloat(document.getElementById("tipoPulpoCongelado").value);

    let peso =
    parseFloat(document.getElementById("pesoPulpoCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPulpoCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioPulpoCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarPulpoCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoPulpoCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPulpoCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoPulpoCongelado");

    let nombreProducto =
    "🐙 Pulpo Congelado - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoPulpoCongelado();

}
function abrirProductoPatasPulpoCongeladas(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=pataspulpocongeladas";

    }else{

        document.getElementById("modalPatasPulpoCongeladas").style.display="flex";

        document.getElementById("cantidadPatasPulpoCongeladas").value="1";

        actualizarPrecioPatasPulpoCongeladas();

    }

}

function cerrarProductoPatasPulpoCongeladas(){

    document.getElementById("modalPatasPulpoCongeladas").style.display="none";

}

function actualizarPrecioPatasPulpoCongeladas(){

    let cantidad =
    parseInt(document.getElementById("cantidadPatasPulpoCongeladas").value);

    let precio = 19.50;

    let total = precio * cantidad;

    document.getElementById("precioPatasPulpoCongeladas").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarPatasPulpoCongeladas(){

    let cantidad =
    parseInt(document.getElementById("cantidadPatasPulpoCongeladas").value);

    let precio = 19.50;

    let total = precio * cantidad;

    carrito.push({

        nombre:"🐙 Patas de Pulpo Cocidas Congeladas",
        cantidad:cantidad + " paquete(s)",
        precio:total

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoPatasPulpoCongeladas();

}
function abrirProductoCalamarNacionalCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=calamarnacionalcongelado";

    }else{

        document.getElementById("modalCalamarNacionalCongelado").style.display="flex";

        document.getElementById("pesoCalamarNacionalCongelado").value="1";
        document.getElementById("pesoPersonalizadoCalamarNacionalCongelado").value="";

        actualizarPrecioCalamarNacionalCongelado();

    }

}

function cerrarProductoCalamarNacionalCongelado(){

    document.getElementById("modalCalamarNacionalCongelado").style.display="none";

}

function actualizarPrecioCalamarNacionalCongelado(){

    let precio =
    parseFloat(document.getElementById("tipoCalamarNacionalCongelado").value);

    let peso =
    parseFloat(document.getElementById("pesoCalamarNacionalCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoCalamarNacionalCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioCalamarNacionalCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarCalamarNacionalCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoCalamarNacionalCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoCalamarNacionalCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoCalamarNacionalCongelado");

    let nombreProducto =
    "🦑 Calamar Nacional - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoCalamarNacionalCongelado();

}
function abrirProductoPuntillitaCalamarCongelada(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=puntillitacalamarcongelada";

    }else{

        document.getElementById("modalPuntillitaCalamarCongelada").style.display="flex";

        document.getElementById("pesoPuntillitaCalamarCongelada").value="1";
        document.getElementById("pesoPersonalizadoPuntillitaCalamarCongelada").value="";

        actualizarPrecioPuntillitaCalamarCongelada();

    }

}

function cerrarProductoPuntillitaCalamarCongelada(){

    document.getElementById("modalPuntillitaCalamarCongelada").style.display="none";

}

function actualizarPrecioPuntillitaCalamarCongelada(){

    let precio = 38.50;

    let peso =
    parseFloat(document.getElementById("pesoPuntillitaCalamarCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPuntillitaCalamarCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioPuntillitaCalamarCongelada").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarPuntillitaCalamarCongelada(){

    let peso =
    parseFloat(document.getElementById("pesoPuntillitaCalamarCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoPuntillitaCalamarCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let precio = 38.50;

    carrito.push({

        nombre:"🦑 Puntillita de Calamar Nacional Larga",
        peso:peso + " kg",
        precio:precio * peso

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoPuntillitaCalamarCongelada();

}
function abrirProductoSepiaNacionalCongelada(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=sepianacionalcongelada";

    }else{

        document.getElementById("modalSepiaNacionalCongelada").style.display="flex";

        document.getElementById("pesoSepiaNacionalCongelada").value="1";
        document.getElementById("pesoPersonalizadoSepiaNacionalCongelada").value="";

        actualizarPrecioSepiaNacionalCongelada();

    }

}

function cerrarProductoSepiaNacionalCongelada(){

    document.getElementById("modalSepiaNacionalCongelada").style.display="none";

}

function actualizarPrecioSepiaNacionalCongelada(){

    let precio = 4.45;

    let peso =
    parseFloat(document.getElementById("pesoSepiaNacionalCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoSepiaNacionalCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioSepiaNacionalCongelada").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarSepiaNacionalCongelada(){

    let peso =
    parseFloat(document.getElementById("pesoSepiaNacionalCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoSepiaNacionalCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let precio = 4.45;

    carrito.push({

        nombre:"🦑 Sepia Nacional 200/400 g",
        peso:peso + " kg",
        precio:precio * peso

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoSepiaNacionalCongelada();

}
function abrirProductoBacalaoIslandiaCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=bacalaoislandiacongelado";

    }else{

        document.getElementById("modalBacalaoIslandiaCongelado").style.display="flex";

        document.getElementById("pesoBacalaoIslandiaCongelado").value="1";
        document.getElementById("pesoPersonalizadoBacalaoIslandiaCongelado").value="";

        actualizarPrecioBacalaoIslandiaCongelado();

    }

}

function cerrarProductoBacalaoIslandiaCongelado(){

    document.getElementById("modalBacalaoIslandiaCongelado").style.display="none";

}

function actualizarPrecioBacalaoIslandiaCongelado(){

    let precio =
    parseFloat(document.getElementById("tipoBacalaoIslandiaCongelado").value);

    let peso =
    parseFloat(document.getElementById("pesoBacalaoIslandiaCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoBacalaoIslandiaCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioBacalaoIslandiaCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarBacalaoIslandiaCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoBacalaoIslandiaCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoBacalaoIslandiaCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoBacalaoIslandiaCongelado");

    let nombreProducto =
    "🐟 Bacalao de Islandia a Punto de Sal - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoBacalaoIslandiaCongelado();

}
function abrirProductoFileteCarboneroCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=filetecarbonerocongelado";

    }else{

        document.getElementById("modalFileteCarboneroCongelado").style.display="flex";

        document.getElementById("pesoFileteCarboneroCongelado").value="1";
        document.getElementById("pesoPersonalizadoFileteCarboneroCongelado").value="";

        actualizarPrecioFileteCarboneroCongelado();

    }

}

function cerrarProductoFileteCarboneroCongelado(){

    document.getElementById("modalFileteCarboneroCongelado").style.display="none";

}

function actualizarPrecioFileteCarboneroCongelado(){

    let precio = 7.65;

    let peso =
    parseFloat(document.getElementById("pesoFileteCarboneroCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoFileteCarboneroCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioFileteCarboneroCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarFileteCarboneroCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoFileteCarboneroCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoFileteCarboneroCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let precio = 7.65;

    carrito.push({

        nombre:"🐟 Filete de Carbonero +2000 g",
        peso:peso + " kg",
        precio:precio * peso

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoFileteCarboneroCongelado();

}
function abrirProductoAbadejoPielPuntoSalCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=abadejopielpuntosalcongelado";

    }else{

        document.getElementById("modalAbadejoPielPuntoSalCongelado").style.display="flex";

        document.getElementById("pesoAbadejoPielPuntoSalCongelado").value="1";
        document.getElementById("pesoPersonalizadoAbadejoPielPuntoSalCongelado").value="";

        actualizarPrecioAbadejoPielPuntoSalCongelado();

    }

}

function cerrarProductoAbadejoPielPuntoSalCongelado(){

    document.getElementById("modalAbadejoPielPuntoSalCongelado").style.display="none";

}

function actualizarPrecioAbadejoPielPuntoSalCongelado(){

    let precio = 4.40;

    let peso =
    parseFloat(document.getElementById("pesoAbadejoPielPuntoSalCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoAbadejoPielPuntoSalCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioAbadejoPielPuntoSalCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarAbadejoPielPuntoSalCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoAbadejoPielPuntoSalCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoAbadejoPielPuntoSalCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let precio = 4.40;

    carrito.push({

        nombre:"🐟 Filete de Abadejo con Piel Punto de Sal",
        peso:peso + " kg",
        precio:precio * peso

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoAbadejoPielPuntoSalCongelado();

}
function abrirProductoColaRapeCongelada(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=coladerapecongelada";

    }else{

        document.getElementById("modalColaRapeCongelada").style.display="flex";

        document.getElementById("pesoColaRapeCongelada").value="1";
        document.getElementById("pesoPersonalizadoColaRapeCongelada").value="";

        actualizarPrecioColaRapeCongelada();

    }

}

function cerrarProductoColaRapeCongelada(){

    document.getElementById("modalColaRapeCongelada").style.display="none";

}

function actualizarPrecioColaRapeCongelada(){

    let precio =
    parseFloat(document.getElementById("tipoColaRapeCongelada").value);

    let peso =
    parseFloat(document.getElementById("pesoColaRapeCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoColaRapeCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioColaRapeCongelada").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarColaRapeCongelada(){

    let peso =
    parseFloat(document.getElementById("pesoColaRapeCongelada").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoColaRapeCongelada").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let selector =
    document.getElementById("tipoColaRapeCongelada");

    let nombreProducto =
    "🐟 Cola de Rape - " +
    selector.options[selector.selectedIndex].text;

    let precio =
    parseFloat(selector.value) * peso;

    carrito.push({

        nombre:nombreProducto,
        peso:peso + " kg",
        precio:precio

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoColaRapeCongelada();

}
function abrirProductoLenguadoRubioCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=lenguadorubiocongelado";

    }else{

        document.getElementById("modalLenguadoRubioCongelado").style.display="flex";

        document.getElementById("pesoLenguadoRubioCongelado").value="1";
        document.getElementById("pesoPersonalizadoLenguadoRubioCongelado").value="";

        actualizarPrecioLenguadoRubioCongelado();

    }

}

function cerrarProductoLenguadoRubioCongelado(){

    document.getElementById("modalLenguadoRubioCongelado").style.display="none";

}

function actualizarPrecioLenguadoRubioCongelado(){

    let precio = 8.10;

    let peso =
    parseFloat(document.getElementById("pesoLenguadoRubioCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLenguadoRubioCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioLenguadoRubioCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarLenguadoRubioCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoLenguadoRubioCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLenguadoRubioCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let precio = 8.10;

    carrito.push({

        nombre:"🐟 Lenguado Rubio 300/400 g",
        peso:peso + " kg",
        precio:precio * peso

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoLenguadoRubioCongelado();

}
function abrirProductoLenguadoTigreCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=lenguadotigrecongelado";

    }else{

        document.getElementById("modalLenguadoTigreCongelado").style.display="flex";

        document.getElementById("pesoLenguadoTigreCongelado").value="1";
        document.getElementById("pesoPersonalizadoLenguadoTigreCongelado").value="";

        actualizarPrecioLenguadoTigreCongelado();

    }

}

function cerrarProductoLenguadoTigreCongelado(){

    document.getElementById("modalLenguadoTigreCongelado").style.display="none";

}

function actualizarPrecioLenguadoTigreCongelado(){

    let precio = 7.10;

    let peso =
    parseFloat(document.getElementById("pesoLenguadoTigreCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLenguadoTigreCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioLenguadoTigreCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarLenguadoTigreCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoLenguadoTigreCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoLenguadoTigreCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let precio = 7.10;

    carrito.push({

        nombre:"🐟 Lenguado Tigre 400/600 g",
        peso:peso + " kg",
        precio:precio * peso

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoLenguadoTigreCongelado();

}
function abrirProductoFileteMerluzaNambia(){

    if(window.innerWidth <= 768){

        window.location.href =
        "producto.html?producto=filetemerluzanambia";

    }else{

        document.getElementById(
            "modalFileteMerluzaNambia"
        ).style.display="flex";

        document.getElementById(
            "pesoFileteMerluzaNambia"
        ).value="1";

        document.getElementById(
            "pesoPersonalizadoFileteMerluzaNambia"
        ).value="";

        actualizarPrecioFileteMerluzaNambia();

    }

}


function cerrarProductoFileteMerluzaNambia(){

    document.getElementById(
        "modalFileteMerluzaNambia"
    ).style.display="none";

}


function actualizarPrecioFileteMerluzaNambia(){

    let precio = 11.90;

    let peso =
    parseFloat(
        document.getElementById(
            "pesoFileteMerluzaNambia"
        ).value
    );

    let personalizado =
    parseFloat(
        document.getElementById(
            "pesoPersonalizadoFileteMerluzaNambia"
        ).value
    );


    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }


    document.getElementById(
        "precioFileteMerluzaNambia"
    ).innerHTML =
    "Precio pendiente";

}


function agregarFileteMerluzaNambia(){

    let peso =
    parseFloat(
        document.getElementById(
            "pesoFileteMerluzaNambia"
        ).value
    );

    let personalizado =
    parseFloat(
        document.getElementById(
            "pesoPersonalizadoFileteMerluzaNambia"
        ).value
    );


    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }


    let precio = 11.90;


    if(precio <= 11.90){

        alert(
            "⚠️ El precio de este producto todavía está pendiente."
        );

        return;

    }


    let total = precio * peso;


    carrito.push({

        nombre:
        "🐟 Filete de Merluza Nambia 14 OZ",

        peso:
        peso + " kg",

        precio: total

    });


    document.getElementById(
        "contadorCarrito"
    ).innerText =
    carrito.length;


    actualizarCarrito();


    cerrarProductoFileteMerluzaNambia();

}
function abrirProductoFileteCorvinaCongelado(){

    if(window.innerWidth <= 768){

        window.location.href = "producto.html?producto=filetedecorvinacongelado";

    }else{

        document.getElementById("modalFileteCorvinaCongelado").style.display="flex";

        document.getElementById("pesoFileteCorvinaCongelado").value="1";
        document.getElementById("pesoPersonalizadoFileteCorvinaCongelado").value="";

        actualizarPrecioFileteCorvinaCongelado();

    }

}

function cerrarProductoFileteCorvinaCongelado(){

    document.getElementById("modalFileteCorvinaCongelado").style.display="none";

}

function actualizarPrecioFileteCorvinaCongelado(){

    let precio = 10.80;

    let peso =
    parseFloat(document.getElementById("pesoFileteCorvinaCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoFileteCorvinaCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let total = precio * peso;

    document.getElementById("precioFileteCorvinaCongelado").innerHTML =
    "Total: " + total.toFixed(2) + "€";

}

function agregarFileteCorvinaCongelado(){

    let peso =
    parseFloat(document.getElementById("pesoFileteCorvinaCongelado").value);

    let personalizado =
    parseFloat(document.getElementById("pesoPersonalizadoFileteCorvinaCongelado").value);

    if(!isNaN(personalizado) && personalizado > 0){

        peso = personalizado;

    }

    let precio = 10.80;

    carrito.push({

        nombre:"🐟 Filete de Corvina +1000 g",
        peso:peso + " kg",
        precio:precio * peso

    });

    document.getElementById("contadorCarrito").innerText =
    carrito.length;

    actualizarCarrito();

    cerrarProductoFileteCorvinaCongelado();

}



function abrirBuscador(){

let buscador =
document.getElementById("buscadorFlotante");


if(buscador.style.display=="block"){

buscador.style.display="none";


}else{

buscador.style.display="block";


document.getElementById("inputBusqueda").value="";

document.getElementById("resultadosBusqueda").innerHTML="";


document.getElementById("inputBusqueda").focus();

}

}

function quitarTildes(texto){

return texto.normalize("NFD").replace(/[\u0300-\u036f]/g,"");

}



function mostrarResultados(){

let texto =
quitarTildes(
document.getElementById("inputBusqueda").value.toLowerCase()
);


let resultado =
document.getElementById("resultadosBusqueda");


resultado.innerHTML="";


let tarjetas =
document.querySelectorAll(".card");


tarjetas.forEach(card=>{


let nombre =
quitarTildes(card.innerText.toLowerCase());


if(nombre.includes(texto) && texto!=""){


let div=document.createElement("div");

div.className="resultado-busqueda";

div.innerText=card.querySelector("h3").innerText;


div.onclick=function(){

card.scrollIntoView({
behavior:"smooth",
block:"center"
});


document.getElementById("buscadorFlotante").style.display="none";


};


resultado.appendChild(div);


}


});


}
document.addEventListener("click",function(e){

let buscador =
document.getElementById("buscadorFlotante");

let lupa =
document.querySelector(".buscar-btn-fijo");


if(
buscador.style.display=="block" &&
!buscador.contains(e.target) &&
!lupa.contains(e.target)
){

buscador.style.display="none";

document.getElementById("inputBusqueda").value="";

document.getElementById("resultadosBusqueda").innerHTML="";

}

});
window.addEventListener('scroll',()=>{

const cards=document.querySelectorAll('.card');

cards.forEach(card=>{

const top=card.getBoundingClientRect().top;

if(top<window.innerHeight-100){
card.style.opacity="1";
card.style.transform="translateY(0)";
}

});

});

document.querySelectorAll('.card').forEach(card=>{
card.style.opacity="0";
card.style.transform="translateY(50px)";
card.style.transition=".8s";
});
window.addEventListener("click",function(e){

let modal =
document.getElementById("modalDorada");

if(e.target===modal){

modal.style.display="none";

}

});
document.getElementById("contadorCarrito").innerText = carrito.length;

actualizarCarrito();

