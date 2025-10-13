const servicios= [
  {
    id: 1,
    nombre: "Corte",
    precio: 10000,
    foto: "https://placehold.co/300x300",
  },
  {
    id: 2,
    nombre: "Corte y Barba",
    precio: 13000,
    foto: "https://placehold.co/300x300",
  },
  {
    id: 3,
    nombre: "Corte niños",
    precio: 8000,
    foto: "https://placehold.co/300x300",
  },
  {
    id: 4,
    nombre: "Barba",
    precio: 6000,
    foto: "https://placehold.co/300x300",
  },
  {
    id: 5,
    nombre: "Reflejos o Claritos",
    precio: 25000,
    foto: "https://placehold.co/300x300",
  },
  {
    id: 6,
    nombre: "Color Global (Decoloracion + Baño de luz)",
    precio: 35000,
    foto: "https://placehold.co/300x300",
  },
]

const barberos= [
  {
    id: 1,
    nombre: "Kevin",
    especialidad: "Corte y Barba",
    experiencia: 5,
    diasTrabajo: "Lunes a Sabado",
    horario: "10:00 a 20:00",
    foto: "https://placehold.co/300x300",
  },
  {
    id: 2,
    nombre: "Matias",
    especialidad: "Corte y Coloracion",
    experiencia: 3,
    diasTrabajo: "Miercoles a Sabado",
    horario: "12:00 a 20:00",
    foto: "https://placehold.co/300x300",
  },
  {
    id: 3,
    nombre: "Pablo",
    especialidad: "Corte niños",
    experiencia: 6,
    diasTrabajo: "Lunes a Viernes",
    horario: "10:00 a 18:00",
    foto: "https://placehold.co/300x300"
  }
]
localStorage.setItem("barberos", JSON.stringify(barberos))

const serviciosSection = document.getElementById("servicios-section")

function renderServicios() {
  serviciosSection.innerHTML = ""
  servicios.forEach(servicio => {
    const card = document.createElement("div")
    card.classList.add("servicio-card")
    card.innerHTML = `
      <img src="${servicio.foto || 'img/servicio-default.jpg'}" alt="${servicio.nombre}" class="servicio-foto">
      <h3>${servicio.nombre}</h3>
      <p>Precio: $${servicio.precio.toLocaleString()}</p>
      <button class="btn-reservar">Pedir turno</button>
      `
      const boton = card.querySelector(".btn-reservar")
    boton.addEventListener("click", () => {
      localStorage.setItem("servicioSeleccionado", JSON.stringify(servicio))
      window.location.href = "./pages/turno.html"
    })

    serviciosSection.appendChild(card)
  })
}

renderServicios()

const barberosSection = document.getElementById("barberos-home")

function renderBarberosHome() {
  barberosSection.innerHTML = ""
  barberos.forEach(barbero => {
    const card = document.createElement("div")
    card.classList.add("barbero-card-home")

    card.innerHTML = `
      <img src="${barbero.foto || 'img/barbero-default.jpg'}" alt="${barbero.nombre}" class="barbero-foto">
      <h3>${barbero.nombre}</h3>
      <p>Especialidad: ${barbero.especialidad}</p>
      <p>Experiencia: ${barbero.experiencia} años</p>
      <p>Días: ${barbero.diasTrabajo}</p>
      <p>Horario: ${barbero.horario}</p>
    `

    barberosSection.appendChild(card)
  })
}

renderBarberosHome()

