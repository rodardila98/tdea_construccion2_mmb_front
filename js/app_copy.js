let pasoAnterior = "menuInicial";
let opcionMenuPrincipal = "";

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
        <b>MMB:</b> Hola 👋 ¿Qué deseas realizar el día de hoy con tu visita técnica?
      </div>
    `;

    mostrarMenu("menuInicial");

    scrollChat();
  }
}

// Scroll automático
function scrollChat() {

  const mensajes = document.getElementById("chatMensajes");

  setTimeout(() => {
    mensajes.scrollTop = mensajes.scrollHeight;
  }, 50);
}

// Input serial, modelo, marca
function enviarMensaje() {
  let input = document.getElementById("mensajeInput"); //busca en mensajeInput en el html
  let valor = input.value.trim();

  if (!valor) return;

  const mensajes = document.getElementById("chatMensajes");

  // Eliminar input activo
  const inputBox = document.getElementById("mensajeInput");
  if (inputBox) {
    inputBox.value = "";
  }

  // Burbuja verde
  mensajes.innerHTML += `
    <div class="flex justify-end mb-2">
      <div class="bg-green-400 text-white px-4 py-2 rounded-lg">
        ${valor}
      </div>
    </div>
  `;
  scrollChat();

  // PASO 3: SE CAPTURA SERIAL DEL EQUIPO
  if (pasoAnterior === "serial") {

    datos.serial = valor;
    pasoAnterior = "marca";

    // Se muestra texto pidiendo la marca
    mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>MMB:</b> Ingrese la marca de su equipo
      </div>
      `;
  }
  // PASO 3: SE CAPTURA MARCA DEL AIRE
  else if (pasoAnterior === "marca") {

    datos.marca = valor;
    pasoAnterior = "modelo";

    // Se muestra texto pidiendo el modelo
    mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>MMB:</b> Ingrese el modelo de su equipo
      </div>
      `;
    scrollChat();
  }


  // PASO 4: SE CAPTURA MODELO DEL AIRE
  else if (pasoAnterior === "modelo") {

    datos.modelo = valor;
    pasoAnterior = "finMenusEquipo";

    scrollChat();
  }

  if (pasoAnterior === "finMenusEquipo") {

    fetch("http://localhost:8080/api/equipos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        servicio: datos.servicio,
        tipo: datos.tipo,
        serial: datos.serial,
        marca: datos.marca,
        modelo: datos.modelo,
        usuario: "123"
      })
    }).then(response => response.json())
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
          Marca: ${datos.marca}<br>
          Modelo: ${datos.modelo}
        </div>
      `;

    console.log("DATOS FINALES:", datos);

    scrollChat();
  }
}


// Mostrar menú dinámico (los botones)
function mostrarMenu(idMenu) {

  const mensajes = document.getElementById("chatMensajes");

  let contenido = document.getElementById(idMenu).innerHTML;

  mensajes.innerHTML += `
    <div id="menuActivo" class="flex flex-col items-center mt-2 space-y-2">
      ${contenido}
    </div>
  `;
}

function menuAgendar(mensajes) {

  // SE INICIA RUTA DE AGENDAMIENTO
  if (pasoAnterior === "menuInicial") {

    pasoAnterior = "tipoServicio";

    mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>Mmb:</b> Hola 👋 ¿Que servicio buscas el día de hoy?
      </div>
    `;

    // Desplegar menú  de tipo de servicio
    mostrarMenu("menuTipoServicio");

    scrollChat();
  }

  // PASO 1: SE CAPTURA TIPO DE SERVICIO 
  else if (pasoAnterior === "tipoServicio") {

    datos.servicio = valor;
    pasoAnterior = "tipoAire";

    let texto = "";

    // Se despliega texto y menú según el servicio seleccionado
    if (valor === "Instalacion") {
      texto = "Perfecto ✅ ¿Qué tipo de aire deseas instalar?";

    } else if (valor === "Reparacion") {
      texto = "Perfecto ✅ ¿Qué tipo de aire deseas reparar?";

    } else if (valor === "Mantenimiento") {
      texto = "Perfecto ✅ ¿A qué tipo de aire deseas realizar mantenimiento?";
    }

    mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>MMB:</b> ${texto}
      </div>
    `;

    // Desplegar menú  de tipo de aire
    mostrarMenu("menuTipoAire");

    scrollChat();
  }

  // PASO 2: SE CAPTURA TIPO DE AIRE
  else if (pasoAnterior === "tipoAire") {

    datos.tipo = valor;
    pasoAnterior = "serial";

    // Se muestra texto pidiendo el serial
    mensajes.innerHTML += `
      <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
        <b>MMB:</b> Ingrese el serial de su equipo
      </div>
      `;

    scrollChat();

  }
}

// CLICK DE BOTONES
function seleccionarOpcion(opcionMenu, valor) {

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

  opcionMenuPrincipal = opcionMenu;

  // FLUJO PRINCIPAL
  if (opcionMenuPrincipal === "Agendar") {

    menuAgendar(mensajes);

  }
}