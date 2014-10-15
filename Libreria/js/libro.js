
//aplicacion para el mantenimiento de libros tenemos alta,baja, modificacion y consulta, hay un numero de unidades vendidas, titulo, isbn (unico) y paginas
// la url del servicio es alumnos-mcsd2014.azure.mobile.net/tables/libros
//tiene que haber un buscador por isbn, titulo, paginas, unidades
//filas de editar y borrar por cada resultado
// Sacar una lista de los mas vendidos (unidades vendidas)
var url = "https://alumnos-mcsd2014.azure-mobile.net/tables/libros/";
function Libro(isbn, titulo, paginas, ventas) {
    this.isbn = isbn;
    this.titulo = titulo;
    this.paginas = paginas;
    this.ventas = ventas;
};
var borrarTabla= function() {
    $("#tablaDatos").remove();
};

var pintarTabla = function (datos) {
    var tabla = document.createElement("table");
    tabla.setAttribute("id", "tablaDatos");
    tabla.setAttribute("class", "table table-hover");
    var cabecera = document.createElement("thead");
    var filacabecera = document.createElement("tr");
    var columna1 = document.createElement("th");
    var columna2 = document.createElement("th");
    var columna3 = document.createElement("th");
    var columna4 = document.createElement("th");
    var columna5 = document.createElement("th");
    var cc1 = document.createTextNode("ISBN");
    var cc2 = document.createTextNode("TITULO");
    var cc3 = document.createTextNode("PAGINAS");
    var cc4 = document.createTextNode("UNIDADES");
    var cc5 = document.createTextNode("#");
    var cuerpo = document.createElement("tbody");
    columna1.appendChild(cc1);
    columna2.appendChild(cc2);
    columna3.appendChild(cc3);
    columna4.appendChild(cc4);
    columna5.appendChild(cc5);

    filacabecera.appendChild(columna1);

    filacabecera.appendChild(columna2);

    filacabecera.appendChild(columna3);

    filacabecera.appendChild(columna4);

    filacabecera.appendChild(columna5);
    cabecera.appendChild(filacabecera);
    tabla.appendChild(cabecera);
    tabla.appendChild(cuerpo);

    for (var i = 0; i < datos.length; i++) {
       
        var fila = document.createElement("tr");
        var c1 = document.createElement("td");
        var c2 = document.createElement("td");
        var c3 = document.createElement("td");
        var c4 = document.createElement("td");
        var c5 = document.createElement("td");
        var t1 = document.createTextNode(datos[i].isbn);
        var t2 = document.createTextNode(datos[i].titulo);
        var t3 = document.createTextNode(datos[i].paginas);
        var t4 = document.createTextNode(datos[i].unidades);
        var t5 = document.createElement("a");
        t5.setAttribute("id", "Borrar," + datos[i].id);
        t5.setAttribute("href", "#");
        t5.onclick = borrar;

        var t6 = document.createElement("a");
        t6.setAttribute("id", "Modificar-" + datos[i].id);
        t6.setAttribute("href", "#");
     //   t6.onclick = modificar;

        var tt5 = document.createTextNode("Borrar");
        var tt6 = document.createTextNode("Modificar");
        
        t5.appendChild(tt5);
        t6.appendChild(tt6);
        c1.appendChild(t1);
        c2.appendChild(t2);
        c3.appendChild(t3);
        c4.appendChild(t4);
        c5.appendChild(t5);
        fila.appendChild(c1);
        fila.appendChild(c2);
        fila.appendChild(c3);
        fila.appendChild(c4);
        fila.appendChild(c5);

       
        cuerpo.appendChild(fila);
    }
    document.getElementById("contenido").appendChild(tabla);
};



function cargarDatos() {

    $.getJSON(url, null, function (res) {
        borrarTabla();

        pintarTabla(res);

    });
   


}


function guardarLibro() {

    libro = new Libro($("#txtIsbn").val(), $("#txtTitulo").val(), $("#txtPaginas").val(), $("#txtUnidades").val());
    var dat = JSON.stringify(libro);
    //$.post(url, dat,  function(data, textStatus) {
    //    //data contiene los datos en JSON
    //    //textStatus contiene el estado de la operacion
    //    alert(textStatus);
    //}, "json");

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("POST", "/json-handler");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ name: "John Rambo", time: "2pm" }));
   
}

function sortJsonName(a, b) {
    return a.unidades < b.unidades ? 1 : -1;
};
function CargarSuperventas() {
    var contador = 0;
    $.getJSON(url, null, function (res) {
        res = $(res).sort(sortJsonName);
        var lhtml = '<div class="list-group">';
        $.each(res, function (index, libro) {
            // aqui tengo que hacer fill uno a uno en la tabla
            if (contador==0)
                lhtml += '<li class="list-group-item list-group-item-danger">' + libro.titulo + '</li>';
            else if (contador == 1)
                lhtml += '<li class="list-group-item list-group-item-warning">' + libro.titulo + '</li>';
            else if (contador == 2)
                lhtml += '<li class="list-group-item list-group-item-info">' + libro.titulo + '</li>';
            else {
                lhtml += '<li class="list-group-item list-group-item-success">' + libro.titulo + '</li>';
            }
            contador = contador + 1;

        });
        lhtml+='</div>'
        $('#contenidoVentas').append(lhtml);
    //    borrarTablaVentas();

    });



}

var buscar = function () {
   
    var busqueda = document.getElementById("busqueda").value;

    var resultados = [];

    $.getJSON(url, null, function (res) {
        borrarTabla();
        for (var i=0 ; i < res.length ; i++)
        {
            if (document.getElementById("isbn").checked) {
                if (res[i]["isbn"] == busqueda) {
                     resultados.push(res[i]);
                } 
                
            } else if (document.getElementById("titulo").checked) {
                if (res[i]["titulo"] == busqueda) {
                    resultados.push(res[i]);
                }
            }
            else if (document.getElementById("paginas").checked) {
                if (res[i]["paginas"] == busqueda) {
                    resultados.push(res[i]);
                }
            } else {
                if (res[i]["unidades"] == busqueda) {
                    resultados.push(res[i]);
                }
            }
        
       
        }
        pintarTabla(resultados);
    });


};

var borrar = function (evt) {
    var idelemento = evt.target.getAttribute("id");
    var urlFinal = url + "/" + idelemento.split(",")[1];

    var ajax = new XMLHttpRequest();
    ajax.open("DELETE", urlFinal);

    ajax.onreadystatechange = function () {

        if (ajax.readyState != 4)
            return;

        if (ajax.status >= 200 && ajax.status < 300) {
            cargarDatos();

        } else {

            alert("Error borrando datos");
        }

    };

    ajax.send(null);


};

(function () {
    document.getElementById("btnbuscar").onclick = buscar;
    cargarDatos();
    CargarSuperventas();
    document.getElementById("EntradaDatos").onclick = guardarLibro;
    //var enlaces = document.querySelectorAll("a");

    //for (var i = 0; i < enlaces.length; i++) {
    //    enlaces[i].onclick = borrar;

    //}

})();