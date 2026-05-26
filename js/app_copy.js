let paso = "inicio";

//acá se definen todos los datos que se vayan a usar en los feth
let datos = {
  servicio: "",
  tipo: "",
  serial: "",
  marca: "",
  modelo: ""
};


// Abrir chat + iniciar flujo
function abrirChat() {

  const chat = document.getElementById("chatBox");
  const mensajes = document.getElementById("chatMensajes");

  chat.classList.toggle("hidden");

  // SOLO iniciar una vez
  if (mensajes.innerHTML.trim() === "") {

    mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>Mmb:</b> Hola 👋 ¿Que servicio buscas el día de hoy?
      </div>
    `;

    mostrarMenu("menuInicial");
  }
}

  //Input serial, modelo, marca
function enviarMensaje() {
      let input = document.getElementById("mensajeInput"); //busca en mensajeInput en el html
      let valor = input.value.trim();

      if (!valor) return;

      const mensajes = document.getElementById("chatMensajes");

      //Eliminar input activo
      const inputBox = document.getElementById("mensajeInput");
      if (inputBox){ 
        inputBox.value = "";
      }

      //burbuja verde
      mensajes.innerHTML += `
    <div class="flex justify-end mb-2">
      <div class="bg-green-400 text-white px-4 py-2 rounded-lg">
        ${valor}
      </div>
    </div>
  `;

  if (paso === "serial") {
    datos.serial = valor;
    paso = "modelo";
    mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>Mmb:</b> Ingrese el modelo de su equipo
      </div>`;

  } else if (paso === "modelo") {
    datos.modelo = mensaje;
    paso = "final"


    fetch("http://localhost:8080/api/equipos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
}

//mostrar menú dinámico
function mostrarMenu(idMenu) {

  const mensajes = document.getElementById("chatMensajes");

  let contenido = document.getElementById(idMenu).innerHTML;

  mensajes.innerHTML += `
    <div id="menuActivo" class="flex flex-col items-center mt-2 space-y-2">
      ${contenido}
    </div>
  `;
}

// CLICK DE BOTONES
function seleccionarOpcion(valor) {

  const mensajes = document.getElementById("chatMensajes");

  // Eliminar menú activo
  const menu = document.getElementById("menuActivo");
  if (menu) menu.remove();

  // mensaje usuario (burbuja verde)
  mensajes.innerHTML += `
    <div class="flex justify-end mb-2">
      <div class="bg-green-400 text-white px-4 py-2 rounded-lg">
        ${valor}
      </div>
    </div>
  `;

  //FLUJO PRINCIPAL

  //PASO 1: TIPO DE SERVICIO 
  if (paso === "inicio") {

    datos.servicio = valor;
    paso = "tipoAire";

    let texto = "";

    if (valor === "Instalacion") {
      texto = "Perfecto ✅ ¿Qué tipo de aire deseas instalar?";

    } else if (valor === "Reparacion") {
      texto = "Perfecto ✅ ¿Qué tipo de aire deseas reparar?";
      
    } else if (valor === "Mantenimiento") {
      texto = "Perfecto ✅ ¿A qué tipo de aire deseas realizar mantenimiento?";
    }

    mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>Mmb:</b> ${texto}
      </div>
    `;

    mostrarMenu("menuTipoAire");
  }


  // ---- PASO 2: TIPO DE AIRE ----
  else if (paso === "tipoAire") {

    datos.tipo = valor;
    paso = "serial";

    mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>Mmb:</b> Ingrese el serial de su equipo
      </div>
      `;
    mostrarInput("serial");
  }

  scrollChat();





// ✅ scroll automático
function scrollChat() {

  const mensajes = document.getElementById("chatMensajes");

  setTimeout(() => {
    mensajes.scrollTop = mensajes.scrollHeight;
  }, 50);
}
}