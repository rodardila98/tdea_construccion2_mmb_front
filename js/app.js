//function: crea la acción conectando con el boton abrirChat, const: declara variables que no
// pueden ser reasignadas. document(toda la página).getElementById(busca el elemento "chatBox") 
let paso = "inicio";
let datos = {
  servicio: "",
  tipo: ""
};

function abrirChat() {
      const chat = document.getElementById("chatBox");
      const mensajes = document.getElementById("chatMensajes");
      //const mensajeListo = mensajes.innerHTML.trim() !=="";
      //esta linea muestra el chat
      chat.classList.toggle("hidden"); //toggle: esta linea basicamente ordena si el chat está abierto
      //cerrarlo si está cerrado abrirlo, al dar clic

      //Al abrir chat por primera vez saluda automáticamente
      if (/*!mensajeListo*/mensajes.innerHTML.trim() === "") {
        mensajes.innerHTML +=`
          <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs shadow">
          <b>Mmb:</b> Hola ❄️​ ¿En que te puedo ayudar hoy?
          </div>`;
        
        mostrarMenu("menuInicial");

        //let menuInicial = document.getElementById("menuInicial").outerHTML;
       // menuInicial = menuInicial.replace("hidden", "");
       
        //mensajes.innerHTML += '<div id="menuActivo" class="flex flex-col items-center mt-2 space-y-2">' +
       // menuInicial +
        //'</div>';
        
      }
    }

  
    //Esta función recibe los parametros de la seleccion de botones
    function seleccionarOpcion(valor) {
      
      const mensaje = document.getElementById("chatMensajes");

      //Elimina menú después de dar clic
      const menu = document.getElementById("menuActivo");
      if (menu) menu.remove();

      //Mensaje del usuario "Tu:"
       mensajes.innerHTML += `<div class="flex justify-end mb-2"><div class="bg-green-400 
            text-white px-4 py-2 rounded-lg"><b>Tú:</b>&nbsp ${valor}</div>`;
     

    //Menú tipo Servicio
      if (paso === "inicio") {
        datos.servicio = valor;
        paso = "tipoAire";

        let texto = "";

        if (valor === "Instalación") {
          texto = "Perfecto, por favor seleccione el tipo de equipo a instalar";
        } else if (valor === "Reparacion"){
          texto = "Perfecto, por favor seleccione el tipo de equipo a reparar";
        } else if (valor === "Instalacion"){
          texto = "Perfecto, por favor seleccione el tipo de equipo a reparar";
        }

         mensajes.innerHTML += `<div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
      <b>Mmb:</b> ${texto} </div>` ;

      mostrarMenu("nenuTipoAire");
      }

    //Menú tipo Aire
     else if (paso === "tipoAire") {

    datos.tipo = valor;
    paso = "serial";
      mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>Mmb:</b> Ingrese el serial de su equipo
      </div>`;

    }else if (paso === "serial"){
      datos.serial = mensaje;
      paso = "modelo";
      mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>Mmb:</b> Ingrese el modelo de su equipo
      </div>`;

    }else if (paso === "modelo")
      datos.modelo = mensaje; 
      paso = "final"

    fetch ("http://localhost:8080/api/equipos", {
          method: "POST",
           headers: {"Content-Type": "application/json"},
           body: JSON.stringify({
          serial: datos.serial,
          marca: datos.marca,
          modelo: datos.modelo,
          tipo: valor,
          usuario: "12"
         })
        })
        
        .then(response => response.json())
          .then(data => {
            console.log("✅ Backend OK:", data);
          })
          .catch(error => {
            console.error("❌ Error:", error);
          });

          
          mensajes.innerHTML += `
              <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                ✅ Listo, registré tu solicitud:<br><br>
                Servicio: ${datos.servicio}<br>
                Tipo: ${datos.tipo}<br>
                Serial: ${datos.serial}<br>
                Modelo: ${datos.modelo}
              </div>
            `;

            console.log("DATOS FINALES:", datos);

            scrollChat();
          }
          ``
     
    // ✅ mostrar menú dinámico
function mostrarMenu(idMenu) {

  const mensajes = document.getElementById("chatMensajes");

  let contenido = document.getElementById(idMenu).innerHTML;

  mensajes.innerHTML += `
    <div id="menuActivo" class="flex flex-col items-center mt-2 space-y-2">
      ${contenido}
    </div>
  `;
}


// ✅ scroll automático
function scrollChat() {

  const mensajes = document.getElementById("chatMensajes");

  setTimeout(() => {
    mensajes.scrollTop = mensajes.scrollHeight;
  }, 50);
}
``
    

   
    /*function enviarMensaje() {
      
      const input = document.getElementById("mensajeInput"); //busca en mensajeInput en el html
      const mensajes = document.getElementById("chatMensajes"); //busca el chatMensajes en el html

       let mensaje = input.value.trim(); //toma o guarda el contenido del boton al que se le da clic

       if (mensaje === "") return; //no permite que se envien mensajes vacíos
       //mensaje del usuario en burbujita verde (selección del botón)
      

      input.value = "";//Luego queda el input limpio para nueva selección

        //Menú inicio
      if(paso == "inicio" && mensaje === "Instalación"){
        paso = "tipoAire;"
        mensajes.innerHTML += `<div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs shadow">
           <b>Mmb:</b> Perfecto, por favor seleccione el tipo de equipo a instalar</div>`;

          //const menuTipoAire = document.getElementById("menuTipoAire").innerHTML;
          let menuTipoAire = document.getElementById("menuTipoAire").outerHTML;
          menuTipoAire = menuTipoAire.replace("hidden", "");
        
           mensajes.innerHTML += `<div id="menuActivo" class=flex-col items-center mt-2">` + menuTipoAire + `</div>`;
            
           input.value = "";//Luego queda el input limpio para nueva selección
 // mensajes.scrollTop = mensajes.scrollHeight; //scroll automático
      } else if(paso == "inicio" && mensaje === "Reparación")
        paso = "tipoAire;"
        mensajes.innerHTML += `<div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs shadow">
           <b>Mmb:</b> Perfecto, por favor seleccione el tipo de equipo a reparar</div>`;

          //const menuTipoAire = document.getElementById("menuTipoAire").innerHTML;
          let menuTipoAire = document.getElementById("menuTipoAire").outerHTML;
          menuTipoAire = menuTipoAire.replace("hidden", "");
        
           mensajes.innerHTML += `<div id="menuActivo" class=flex-col items-center mt-2">` + menuTipoAire + `</div>`;
            
           input.value = "";//Luego queda el input limpio para nueva selección
        

      //Este metodo desaparece todos los botones una vez se da clic en alguno
      const contenedorBotones = document.getElementById("botonesChat");
      if (contenedorBotones){
        contenedorBotones.remove();
      }
      mensajes.scrollTop = mensajes.scrollHeight; //scroll automático

     


      

      //(let es una variable que solo existe dentro de la funcion o llave donde fue creada)
      //let mensaje = input.value.toLowerCase();  //aqui la variable mensaje optiene como valor el
      // mensaje que escribe el usuario //toLowerCase estandariza caracteres alfanumericos en cadena minuscula
      //if (mensaje.trim()=="") return; //validación mensaje vacío no lo recibe
      
      //prueba en consola - document.getElementById("chatMensajes").innerHTML = "JS FUNCIONANDO"

      //RESPUESTAS BOT

      //Crear equipo
      if (mensaje.includes("1"))
        mensajes.innerHTML += "<div><b>Mmb:</b> ¿A que tipo de aire realizaremos mantenimiento? <br>1. Aire portátil <br>2. Aire de ventana <br>3. Aire de techo </div>";

/*       if (mensaje.includes("1"))
        mensajes.innerHTML += '<div><b>Mmb:</b> <button onclick="enviarMensajeBotones("botonServicio")" class="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600">Solicitar servicio</button></div>'; */

      /*if (["1", "2", "3"].includes(mensaje)) {
        fetch ("http://localhost:8080/api/equipos", {
          method: "POST",
           headers: {"Content-Type": "application/json"},
           body: JSON.stringify({ 
          serial: "1238",
          marca: "TehAire2",
          modelo: "X20",
          tipo: "ventana",
          usuario: "12"
        })
      })
    }
  
      //crear usuario
         if (mensaje.includes("crear usuario")) {

          let body =  JSON.stringify({ 
            tipoDocumento: "CC",
            numDocumento: "123",
            nombreCompleto: "Andrea",
            numCel: "31122",
            direccion: "Cra 80",
            barrio:"Colonial",
            ciudad:"Medellin",
            correo:"usuario2@correo.com"
         })

      fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: body
      })
      .then(res => res.text())
      .then(data => {
        mensajes.innerHTML += "<div><b>Bot:</b> " + data + "</div>";


       
      });

      input.value = "";
    }
}
 //PRUEBAS RESPUESTA DEL BOT
      //mensajes.innerHTML += "<div><b>MasAire: </b> " + "Hola, para mi es un gusto saludarte" + "</div>";
        //PRUEBA CONEXIÓN BACK 
        // console.log("Intentando crear usuario...");*/