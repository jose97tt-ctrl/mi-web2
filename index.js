
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

// Los ajustes de precio los aplica precios-store.js sobre `productos` y el catálogo
// se refresca en catalogo.js (refrescarPreciosCatalogo escucha 'precios:actualizados').


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
window.addEventListener("click",function(e){

let modal =
document.getElementById("modalDorada");

if(e.target===modal){

modal.style.display="none";

}

});
document.getElementById("contadorCarrito").innerText = carrito.length;

actualizarCarrito();

