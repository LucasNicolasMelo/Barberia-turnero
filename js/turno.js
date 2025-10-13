const turnoSection = document.getElementById("turno-section")
const barberosSection = document.getElementById("barberos-section")
const mensajeTurno = document.getElementById("mensaje-turno")
const formTurno = document.getElementById("form-turno")
const resumenTurno = document.getElementById("resumen-turno")
const btnCancelar = document.getElementById("btn-cancelar-turno")
const horaInput = document.getElementById("hora")

const servicio = JSON.parse(localStorage.getItem("servicioSeleccionado"))
const barberos = JSON.parse(localStorage.getItem("barberos")) || []

function renderServicioSeleccionado() {
  if (servicio) {
    turnoSection.innerHTML = `
      <h2>Tu servicio seleccionado:</h2>
      <p>${servicio.nombre} - $${servicio.precio.toLocaleString()}</p>
    `
  } else {
    turnoSection.innerHTML = `<p>No seleccionaste ningún servicio.</p>`
  }
}

function ajustarHorario(barbero) {
  const [horaInicio, horaFin] = barbero.horario.split(" a ")
  horaInput.min = horaInicio
  horaInput.max = horaFin
}

function renderBarberos() {
  barberosSection.innerHTML = ""
  barberos.forEach(barbero => {
    const card = document.createElement("div")
    card.classList.add("barbero-card")
    card.innerHTML = `
      <img src="${barbero.foto || 'img/barbero-default.jpg'}" alt="${barbero.nombre}" class="barbero-foto">
      <h4>${barbero.nombre}</h4>
      <p>Especialidad: ${barbero.especialidad}</p>
      <p>Experiencia: ${barbero.experiencia} años</p>
      <p>Días de trabajo: ${barbero.diasTrabajo}</p>
      <p>Horario: ${barbero.horario}</p>
      <button class="btn-elegir">Elegir barbero</button>
    `
    const boton = card.querySelector(".btn-elegir")
    boton.addEventListener("click", () => {
      localStorage.setItem("barberoSeleccionado", JSON.stringify(barbero))
      mensajeTurno.innerText = `Elegiste a ${barbero.nombre}. Ahora completá tu turno con fecha y hora.`
      ajustarHorario(barbero)
    })
    barberosSection.appendChild(card)
  })
}

function renderResumen(turno) {
  resumenTurno.innerHTML = `
    <h2>Resumen de tu turno:</h2>
    <p>Servicio: ${turno.servicio.nombre} - $${turno.servicio.precio.toLocaleString()}</p>
    <p>Barbero: ${turno.barbero.nombre} (${turno.barbero.especialidad})</p>
    <p>Cliente: ${turno.nombreCliente} - ${turno.celularCliente}</p>
    <p>Fecha: ${turno.fecha}</p>
    <p>Hora: ${turno.hora}</p>
  `
}

renderServicioSeleccionado()
renderBarberos()

formTurno.addEventListener("submit", (e) => {
  e.preventDefault()
  const nombre = document.getElementById("nombre").value.trim()
  const celular = document.getElementById("celular").value.trim()
  const fecha = document.getElementById("fecha").value
  const hora = document.getElementById("hora").value
  const barbero = JSON.parse(localStorage.getItem("barberoSeleccionado"))

  if (!nombre || !celular || !fecha || !hora || !barbero) {
    mensajeTurno.innerText = "Completá todos los datos."
    return
  }

  let turnosGuardados = JSON.parse(localStorage.getItem("turnosGuardados")) || []

  const turnoExistente = turnosGuardados.find(
    t => t.barbero.id === barbero.id && t.fecha === fecha && t.hora === hora
  )

  if (turnoExistente) {
    mensajeTurno.innerText = "Ese turno ya está ocupado. Elegí otra hora."
    return
  }

  const turno = { servicio, barbero, fecha, hora, nombreCliente: nombre, celularCliente: celular }
  turnosGuardados.push(turno)
  localStorage.setItem("turnosGuardados", JSON.stringify(turnosGuardados))
  localStorage.setItem("turnoFinal", JSON.stringify(turno))
  renderResumen(turno)
  mensajeTurno.innerText = "¡Turno confirmado!"
})

btnCancelar.addEventListener("click", () => {
  let turnosGuardados = JSON.parse(localStorage.getItem("turnosGuardados")) || []

  if (turnosGuardados.length === 0) {
    mensajeTurno.innerText = "No hay turnos para cancelar."
    return
  }

  const turnoCancelado = turnosGuardados.pop()
  localStorage.setItem("turnosGuardados", JSON.stringify(turnosGuardados))
  localStorage.removeItem("turnoFinal")
  resumenTurno.innerHTML = ""
  mensajeTurno.innerText = `Turno con ${turnoCancelado.barbero.nombre} el ${turnoCancelado.fecha} a las ${turnoCancelado.hora} cancelado.`
})