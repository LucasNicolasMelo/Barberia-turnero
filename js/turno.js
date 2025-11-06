const turnoResumen = document.getElementById("turno-resumen");
const servicioSeleccionado = JSON.parse(localStorage.getItem("servicioSeleccionado"));
const barberoSeleccionado = JSON.parse(localStorage.getItem("barberoSeleccionado"));

if (!servicioSeleccionado || !barberoSeleccionado) {
  Swal.fire({
    icon: "warning",
    title: "Faltan datos",
    text: "Por favor seleccioná un servicio y un barbero antes de reservar el turno.",
  }).then(() => {
    window.location.href = "../index.html";
  });
} else {
  mostrarResumenTurno();
}

function mostrarResumenTurno() {
  turnoResumen.innerHTML = `<h2>Tu selección</h2>
    <div class="resumen-container">
      <div class="resumen-servicio">
        <h3>Servicio</h3>
        <img src="${servicioSeleccionado.foto}" alt="${servicioSeleccionado.nombre}" class="resumen-foto">
        <p>${servicioSeleccionado.nombre}</p>
        <p>Precio: $${servicioSeleccionado.precio.toLocaleString()}</p>
      </div>
      <div class="resumen-barbero">
        <h3>Barbero</h3>
        <img src="${barberoSeleccionado.foto}" alt="${barberoSeleccionado.nombre}" class="resumen-foto">
        <p>${barberoSeleccionado.nombre}</p>
        <p>Especialidad: ${barberoSeleccionado.especialidad}</p>
      </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const title = document.getElementById("calendar-title");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");
  const horaSelect = document.getElementById("horaSelect");
  const clienteForm = document.getElementById("clienteForm");
  let currentDate = new Date();
  let turnosGuardados = JSON.parse(localStorage.getItem("turnosGuardados")) || [];

  function mostrarTurnosConfirmados() {
    const turnosConfirmadosSection = document.getElementById("turnos-confirmados");
    turnosConfirmadosSection.innerHTML = "<h2>Turnos Confirmados</h2>";
    const turnosCompletos = JSON.parse(localStorage.getItem("turnosCompletos") || "[]");

    if (turnosCompletos.length === 0) {
      turnosConfirmadosSection.innerHTML += "<p>No hay turnos confirmados aún.</p>";
      return;
    }

    const container = document.createElement("div");
    container.classList.add("turnos-container");

    turnosCompletos.forEach((turno, index) => {
      const turnoDiv = document.createElement("div");
      turnoDiv.classList.add("turno-card", "p-3", "mb-3", "border", "rounded");

      const [fechaStr, horaStr] = turno.hora.split(" ");

      turnoDiv.innerHTML = `
        <p><b>Cliente:</b> ${turno.cliente.nombre}</p>
        <p><b>Teléfono:</b> ${turno.cliente.telefono}</p>
        <p><b>Servicio:</b> ${turno.servicio.nombre} ($${turno.servicio.precio.toLocaleString()})</p>
        <p><b>Barbero:</b> ${turno.barbero.nombre}</p>
        <p><b>Fecha:</b> ${fechaStr}</p>
        <p><b>Hora:</b> ${horaStr} hs</p>
        <button class="editar-turno btn btn-sm btn-warning mt-2">Editar</button>
        <button class="borrar-turno btn btn-sm btn-danger mt-2">Borrar</button>
      `;

      turnoDiv.querySelector(".editar-turno").addEventListener("click", () => {
        turnosCompletos.splice(index, 1);
        localStorage.setItem("turnosCompletos", JSON.stringify(turnosCompletos));
        turnosGuardados = turnosGuardados.filter(h => h !== turno.hora);
        localStorage.setItem("turnosGuardados", JSON.stringify(turnosGuardados));
        mostrarTurnosConfirmados();
        localStorage.removeItem("fechaSeleccionada");
        Swal.fire({
          icon: "info",
          title: "Editar turno",
          text: "Seleccioná una nueva fecha y hora para tu turno."
        });
      });

      turnoDiv.querySelector(".borrar-turno").addEventListener("click", () => {
        turnosCompletos.splice(index, 1);
        localStorage.setItem("turnosCompletos", JSON.stringify(turnosCompletos));
        turnosGuardados = turnosGuardados.filter(h => h !== turno.hora);
        localStorage.setItem("turnosGuardados", JSON.stringify(turnosGuardados));
        mostrarTurnosConfirmados();
      });

      container.appendChild(turnoDiv);
    });

    turnosConfirmadosSection.appendChild(container);
  }

  function renderCalendar(fecha) {
    calendar.innerHTML = "";
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const year = fecha.getFullYear();
    const month = fecha.getMonth();

    const nombreMes = fecha.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    title.textContent = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

    const primerDiaMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const primerDiaVista = new Date(year, month, 1);
    prevBtn.disabled = primerDiaVista <= primerDiaMesActual;

    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    diasSemana.forEach(dia => {
      const dayName = document.createElement("div");
      dayName.classList.add("day-name");
      dayName.textContent = dia;
      calendar.appendChild(dayName);
    });

    let offset = (primerDia.getDay() + 6) % 7;
    for (let i = 0; i < offset; i++) calendar.appendChild(document.createElement("div"));

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fechaDia = new Date(year, month, dia);
      const dayEl = document.createElement("div");
      dayEl.classList.add("day");
      dayEl.textContent = dia;
      const diaSemana = fechaDia.getDay();
      if (diaSemana === 0 || fechaDia < hoy) dayEl.classList.add("disabled");
      else dayEl.addEventListener("click", () => seleccionarDia(fechaDia, dayEl));
      calendar.appendChild(dayEl);
    }
  }

  function seleccionarDia(fecha, el) {
    document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
    el.classList.add("selected");
    const fechaISO = fecha.toISOString().split("T")[0];
    localStorage.setItem("fechaSeleccionada", fechaISO);
    generarHorariosDisponibles(fechaISO);
    Swal.fire({
      icon: "success",
      title: "Fecha seleccionada",
      text: `Elegiste el ${fecha.toLocaleDateString("es-AR")}`,
    });
  }

  function generarHorariosDisponibles(fechaSeleccionada) {
    horaSelect.innerHTML = `<option selected disabled>Elegí hora disponible</option>`;
    if (!fechaSeleccionada) return;

    const horaInicio = 12, horaFin = 20, intervaloMin = 30;
    const turnosCompletos = JSON.parse(localStorage.getItem("turnosCompletos") || "[]");

    for (let hora = horaInicio; hora < horaFin; hora++) {
      for (let min = 0; min < 60; min += intervaloMin) {
        const fechaHoraStr = `${fechaSeleccionada} ${hora.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}`;

        const ocupado = turnosCompletos.some(t => 
          t.hora === fechaHoraStr && t.barbero.nombre === barberoSeleccionado.nombre
        );

        const option = document.createElement("option");
        option.value = fechaHoraStr;
        option.textContent = `${hora.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}`;
        if (ocupado) {
          option.disabled = true;
          option.textContent += " (Ocupado)";
        }
        horaSelect.appendChild(option);
      }
    }
  }

  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate);
  mostrarTurnosConfirmados();

  clienteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombreCliente = document.getElementById("nombreCliente").value.trim();
    const telefonoCliente = document.getElementById("telefonoCliente").value.trim();
    const fechaSeleccionada = localStorage.getItem("fechaSeleccionada");
    const horaSeleccionada = document.getElementById("horaSelect").value;

    if (!fechaSeleccionada || !horaSeleccionada || !servicioSeleccionado || !barberoSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Asegurate de haber elegido servicio, barbero, fecha y hora antes de confirmar.",
      });
      return;
    }

    const turnoCompleto = {
      cliente: { nombre: nombreCliente, telefono: telefonoCliente },
      servicio: servicioSeleccionado,
      barbero: barberoSeleccionado,
      fecha: fechaSeleccionada,
      hora: horaSeleccionada,
    };

    const turnosCompletos = JSON.parse(localStorage.getItem("turnosCompletos") || "[]");
    turnosCompletos.push(turnoCompleto);
    localStorage.setItem("turnosCompletos", JSON.stringify(turnosCompletos));

    turnosGuardados.push(horaSeleccionada);
    localStorage.setItem("turnosGuardados", JSON.stringify(turnosGuardados));

    generarHorariosDisponibles(fechaSeleccionada);
    mostrarTurnosConfirmados();

    const [fechaStr, horaStr] = horaSeleccionada.split(" ");

    Swal.fire({
      icon: "success",
      title: "Turno confirmado",
      html: `
        <b>Cliente:</b> ${nombreCliente}<br>
        <b>Teléfono:</b> ${telefonoCliente}<br><br>
        <b>Servicio:</b> ${servicioSeleccionado.nombre} ($${servicioSeleccionado.precio.toLocaleString()})<br>
        <b>Barbero:</b> ${barberoSeleccionado.nombre}<br>
        <b>Fecha:</b> ${fechaStr}<br>
        <b>Hora:</b> ${horaStr} hs
      `
    });

    clienteForm.reset();
    document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
    localStorage.removeItem("fechaSeleccionada");
  });
});
