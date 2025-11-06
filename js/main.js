const serviciosSection = document.getElementById("servicios-section")
const barberosSection = document.getElementById("barberos-home")

const URL_SERVICIOS = "./db/servicios.json"

async function obtenerServicios() {
  try {
    const response = await fetch(URL_SERVICIOS)
    const data = await response.json()

    localStorage.setItem("servicios", JSON.stringify(data))

    renderServicios(data)
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al cargar los servicios.",
    })
  }
}

function renderServicios(servicios) {
  servicios.forEach((servicio) => {
    const card = document.createElement("div")
    card.classList.add("servicio-card")

    card.innerHTML = `<img src="${servicio.foto}" alt="${servicio.nombre}" class="servicio-foto">
                      <h3>${servicio.nombre}</h3>
                      <p>Precio: $${servicio.precio.toLocaleString()}</p>
                      <button class="btn-reservar">Elegir servicio</button>`

    const boton = card.querySelector(".btn-reservar")
    boton.addEventListener("click", () => {
      localStorage.setItem("servicioSeleccionado", JSON.stringify(servicio))
      mostrarBarberosParaTurno()
      window.scrollTo({
        top: barberosSection.offsetTop,
        behavior: "smooth",
      })
    })

    serviciosSection.appendChild(card)
  })
}

obtenerServicios()

const URL_BARBEROS = "./db/barberos.json"

async function obtenerBarberos() {
  try {
    const response = await fetch(URL_BARBEROS)
    const data = await response.json()

    localStorage.setItem("barberos", JSON.stringify(data))

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al cargar los barberos.",
    })
  }
}
obtenerBarberos()

function mostrarBarberosParaTurno() {
  const barberos = JSON.parse(localStorage.getItem("barberos")) || []

  barberos.forEach((barbero) => {
    const card = document.createElement("div")
    card.classList.add("barbero-card-home")

    card.innerHTML = `<img src="${barbero.foto}" alt="${barbero.nombre}" class="barbero-foto">
                      <h3>${barbero.nombre}</h3>
                      <p>Especialidad: ${barbero.especialidad}</p>
                      <p>Experiencia: ${barbero.experiencia} años</p>
                      <p>Días: ${barbero.diasTrabajo}</p>
                      <p>Horario: ${barbero.horario}</p>
                      <button class="btn-seleccionar-barbero">Elegir barbero</button>`

    const boton = card.querySelector(".btn-seleccionar-barbero")
    boton.addEventListener("click", () => {
      localStorage.setItem("barberoSeleccionado", JSON.stringify(barbero))
      window.location.href = "./pages/turno.html"
    })

    barberosSection.appendChild(card)
  })
}
