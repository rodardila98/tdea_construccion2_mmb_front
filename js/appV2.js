// ============================================================
//  ESTADO GLOBAL
// ============================================================
let estado = {
  flujo: "",   // "agendar" | "consultar" | "modificar" | "cancelar"
  paso: "menuInicial",
  datos: {
    servicio: "",
    tipo: "",
    serial: "",
    marca: "",
    modelo: "",
    campo: "",
    nuevoValor: ""
  }
};

const BASE_URL = "http://localhost:8080/api/equipos";


// ============================================================
//  ABRIR CHAT
// ============================================================
function abrirChat() {
  const chat     = document.getElementById("chatBox");
  const mensajes = document.getElementById("chatMensajes");

  chat.classList.toggle("hidden");

  if (mensajes.innerHTML.trim() === "") {
    botMensaje("Hola 👋 ¿Qué deseas realizar el día de hoy con tu visita técnica?");
    mostrarMenu("menuInicial");
    scrollChat();
  }
}


// ============================================================
//  CLICK EN BOTONES DEL MENÚ
// ============================================================
function seleccionarOpcion(valor) {
  const mensajes = document.getElementById("chatMensajes");

  // Eliminar menú activo
  const menu = document.getElementById("menuActivo");
  if (menu) menu.remove();

  // Burbuja verde del usuario
  usuarioMensaje(valor);

  // ── Menú raíz ──────────────────────────────────────────────
  if (estado.paso === "menuInicial") {

    if (valor === "Agendar") {
      estado.flujo = "agendar";
      estado.paso  = "tipoServicio";
      estado.datos = resetDatos();
      botMensaje("¿Qué tipo de servicio deseas agendar?");
      mostrarMenu("menuTipoServicio");

    } else if (valor === "Consultar") {
      estado.flujo = "consultar";
      estado.paso  = "serial";
      estado.datos = resetDatos();
      botMensaje("Ingresa el <b>serial</b> del equipo que deseas consultar");

    } else if (valor === "Modificar") {
      estado.flujo = "modificar";
      estado.paso  = "serial";
      estado.datos = resetDatos();
      botMensaje("Ingresa el <b>serial</b> del equipo que deseas modificar");

    } else if (valor === "Cancelar") {
      estado.flujo = "cancelar";
      estado.paso  = "serial";
      estado.datos = resetDatos();
      botMensaje("Ingresa el <b>serial</b> del equipo que deseas cancelar");
    }

    scrollChat();
    return;
  }

  // ── Delegación a cada flujo (pasos con botones) ────────────
  if      (estado.flujo === "agendar")   manejarAgendar(valor);
  else if (estado.flujo === "modificar") manejarModificar(valor);
  else if (estado.flujo === "cancelar")  manejarCancelar(valor);

  scrollChat();
}


// ============================================================
//  INPUT DE TEXTO (mensajeInput fijo)
// ============================================================
function enviarMensaje() {
  const input = document.getElementById("mensajeInput");
  const valor = input.value.trim();

  if (!valor) return;

  input.value = "";

  usuarioMensaje(valor);

  if      (estado.flujo === "agendar")   manejarAgendar(valor);
  else if (estado.flujo === "consultar") manejarConsultar(valor);
  else if (estado.flujo === "modificar") manejarModificar(valor);
  else if (estado.flujo === "cancelar")  manejarCancelar(valor);

  scrollChat();
}


// ============================================================
//  FLUJO: AGENDAR — POST
// ============================================================
function manejarAgendar(valor) {

  // PASO 1: TIPO DE SERVICIO (botones)
  if (estado.paso === "tipoServicio") {
    estado.datos.servicio = valor;
    estado.paso = "tipoAire";

    let texto = "";
    if (valor === "Instalacion")    texto = "Perfecto ✅ ¿Qué tipo de aire deseas instalar?";
    else if (valor === "Reparacion")    texto = "Perfecto ✅ ¿Qué tipo de aire deseas reparar?";
    else if (valor === "Mantenimiento") texto = "Perfecto ✅ ¿A qué tipo de aire deseas realizar mantenimiento?";

    botMensaje(texto);
    mostrarMenu("menuTipoAire");
  }

  // PASO 2: TIPO DE AIRE (botones)
  else if (estado.paso === "tipoAire") {
    estado.datos.tipo = valor;
    estado.paso = "serial";
    botMensaje("Ingresa el <b>serial</b> de tu equipo");
  }

  // PASO 3: SERIAL (input)
  else if (estado.paso === "serial") {
    estado.datos.serial = valor;
    estado.paso = "marca";
    botMensaje("Ingresa la <b>marca</b> de tu equipo");
  }

  // PASO 4: MARCA (input)
  else if (estado.paso === "marca") {
    estado.datos.marca = valor;
    estado.paso = "modelo";
    botMensaje("Ingresa el <b>modelo</b> de tu equipo");
  }

  // PASO 5: MODELO (input) → POST
  else if (estado.paso === "modelo") {
    estado.datos.modelo = valor;
    estado.paso = "finMenusEquipo";
    botMensaje("⏳ Registrando tu equipo...");

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        servicio: estado.datos.servicio,
        tipo:     estado.datos.tipo,
        serial:   estado.datos.serial,
        marca:    estado.datos.marca,
        modelo:   estado.datos.modelo,
        usuario:  "123"
      })
    })
      .then(verificarRespuesta)
      .then(() => {
        botMensaje(`
          ✅ ¡Equipo registrado con éxito!<br><br>
          <b>Servicio:</b> ${estado.datos.servicio}<br>
          <b>Tipo:</b>     ${estado.datos.tipo}<br>
          <b>Serial:</b>   ${estado.datos.serial}<br>
          <b>Marca:</b>    ${estado.datos.marca}<br>
          <b>Modelo:</b>   ${estado.datos.modelo}
        `);
        console.log("✅ Backend OK:", estado.datos);
        reiniciar();
      })
      .catch(err => manejarError(err));
  }
}


// ============================================================
//  FLUJO: CONSULTAR — GET
// ============================================================
function manejarConsultar(valor) {

  if (estado.paso === "serial") {
    estado.datos.serial = valor;
    estado.paso = "final";
    botMensaje("🔍 Buscando equipo...");

    fetch(`${BASE_URL}/${valor}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(verificarRespuesta)
      .then(data => {
        botMensaje(`
          📋 Equipo encontrado:<br><br>
          <b>Serial:</b>   ${data.serial}<br>
          <b>Marca:</b>    ${data.marca}<br>
          <b>Modelo:</b>   ${data.modelo}<br>
          <b>Tipo:</b>     ${data.tipo}<br>
          <b>Servicio:</b> ${data.servicio}
        `);
        reiniciar();
      })
      .catch(err => manejarError(err));
  }
}


// ============================================================
//  FLUJO: MODIFICAR — GET → PUT objeto completo
// ============================================================
function manejarModificar(valor) {

  // PASO 1: SERIAL (input) → GET para traer datos actuales
  if (estado.paso === "serial") {
    estado.datos.serial = valor;
    estado.paso = "campo";
    botMensaje("🔍 Buscando equipo...");

    fetch(`${BASE_URL}/${valor}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(verificarRespuesta)
      .then(data => {
        // Guardar el objeto completo que vino del backend
        estado.datos.equipoActual = {
          serial:   data.serial,
          marca:    data.marca,
          modelo:   data.modelo,
          tipo:     data.tipo,
          servicio: data.servicio,
          usuario:  data.usuario || "123"
        };

        botMensaje(`
          📋 Datos actuales del equipo:<br><br>
          <b>Serial:</b>   ${data.serial}<br>
          <b>Marca:</b>    ${data.marca}<br>
          <b>Modelo:</b>   ${data.modelo}<br>
          <b>Tipo:</b>     ${data.tipo}<br>
          <b>Servicio:</b> ${data.servicio}<br><br>
          ¿Qué dato deseas modificar?
        `);
        mostrarMenu("menuCamposModificar");
        scrollChat();
      })
      .catch(err => manejarError(err));
  }

  // PASO 2: CAMPO A MODIFICAR (botones)
  else if (estado.paso === "campo") {
    estado.datos.campo = valor;
    estado.paso = "nuevoValor";
    botMensaje(`Ingresa el nuevo valor para <b>${valor}</b>`);
  }

  // PASO 3: NUEVO VALOR (input) → PUT con objeto completo
  else if (estado.paso === "nuevoValor") {
    estado.datos.nuevoValor = valor;
    estado.paso = "final";
    botMensaje("⏳ Actualizando equipo...");

    // Mezclar objeto actual con el campo modificado
    const bodyActualizado = {
      ...estado.datos.equipoActual,
      [estado.datos.campo]: estado.datos.nuevoValor
    };

    fetch(`${BASE_URL}/${estado.datos.serial}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyActualizado)
    })
      .then(verificarRespuesta)
      .then(() => {
        botMensaje(`
          ✅ Equipo actualizado con éxito:<br><br>
          <b>Serial:</b>   ${bodyActualizado.serial}<br>
          <b>Marca:</b>    ${bodyActualizado.marca}<br>
          <b>Modelo:</b>   ${bodyActualizado.modelo}<br>
          <b>Tipo:</b>     ${bodyActualizado.tipo}<br>
          <b>Servicio:</b> ${bodyActualizado.servicio}
        `);
        reiniciar();
      })
      .catch(err => manejarError(err));
  }
}


// ============================================================
//  FLUJO: CANCELAR — DELETE
// ============================================================
function manejarCancelar(valor) {

  // PASO 1: SERIAL (input)
  if (estado.paso === "serial") {
    estado.datos.serial = valor;
    estado.paso = "confirmar";
    botMensaje(`¿Confirmas que deseas eliminar el equipo con serial <b>${valor}</b>?`);
    mostrarMenu("menuConfirmar");
  }

  // PASO 2: CONFIRMACIÓN (botones)
  else if (estado.paso === "confirmar") {

    if (valor === "Sí, eliminar") {
      estado.paso = "final";
      botMensaje("🗑️ Eliminando equipo...");

      fetch(`${BASE_URL}/${estado.datos.serial}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
        .then(verificarRespuesta)
        .then(() => {
          botMensaje(`✅ Equipo con serial <b>${estado.datos.serial}</b> eliminado correctamente.`);
          reiniciar();
        })
        .catch(err => manejarError(err));

    } else {
      botMensaje("❌ Operación cancelada.");
      reiniciar();
    }
  }
}


// ============================================================
//  HELPERS DE UI
// ============================================================

function botMensaje(texto) {
  const mensajes = document.getElementById("chatMensajes");
  mensajes.innerHTML += `
    <div class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs">
      <b>MMB:</b> ${texto}
    </div>
  `;
  scrollChat();
}

function usuarioMensaje(texto) {
  const mensajes = document.getElementById("chatMensajes");
  mensajes.innerHTML += `
    <div class="flex justify-end mb-2">
      <div class="bg-green-400 text-white px-4 py-2 rounded-lg max-w-xs">
        ${texto}
      </div>
    </div>
  `;
}

function mostrarMenu(idMenu) {
  const mensajes  = document.getElementById("chatMensajes");
  const contenido = document.getElementById(idMenu).innerHTML;
  mensajes.innerHTML += `
    <div id="menuActivo" class="flex flex-col items-center mt-2 space-y-2">
      ${contenido}
    </div>
  `;
  scrollChat();
}

function scrollChat() {
  const mensajes = document.getElementById("chatMensajes");
  setTimeout(() => {
    mensajes.scrollTop = mensajes.scrollHeight;
  }, 50);
}


// ============================================================
//  HELPERS DE FETCH
// ============================================================

function verificarRespuesta(response) {
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return {};
}

function manejarError(err) {
  console.error("❌ Error:", err);
  botMensaje("❌ Ocurrió un error. Por favor intenta de nuevo.");
  reiniciar();
}


// ============================================================
//  REINICIAR → volver al menú principal
// ============================================================
function reiniciar() {
  estado.flujo = "";
  estado.paso  = "menuInicial";
  estado.datos = resetDatos();

  setTimeout(() => {
    botMensaje("¿Deseas realizar otra acción?");
    mostrarMenu("menuInicial");
  }, 800);
}

function resetDatos() {
  return {
    servicio: "",
    tipo: "",
    serial: "",
    marca: "",
    modelo: "",
    campo: "",
    nuevoValor: ""
  };
}