console.log("¡Bienvenido a la Barbería!")

let cliente = prompt("Ingrese su nombre:")

console.log("Hola " + cliente + ", esperamos que tengas un buen turno.")

const turnos = []
let opcion = parseInt(prompt(
  "Hola " + cliente  +  " selecciona la opcion deseada \n\n" +
  "1 - Agregar turno\n" +
  "2 - Mostrar turnos\n" +
  "3 - Eliminar turno\n" +
  "4 - Salir\n\n" +
  "Ingresá el número de la opción:"
))


function agregarTurno(nombre, fecha, hora, servicio) {
  let turno = fecha + " " + hora + " - " + nombre + " - " + servicio;
  turnos.push(turno)

  alert("Felicitaciones ya tenes tu turno agendado")
}


function mostrarTurnos(arrayTurnos) {
  if (arrayTurnos.length === 0) {
    alert("No hay turnos cargados.")

    return
  }

  let texto = "Turnos:\n"
  for (let i = 0; i < arrayTurnos.length; i++) {
    texto += (i + 1) + " - " + arrayTurnos[i] + "\n"
  }
  alert(texto)
}


function eliminarTurno(arrayTurnos, numero) {
  if (numero < 1 || numero > arrayTurnos.length) {
    alert("Número inválido. No se eliminó ningún turno.")

    return
  }

  arrayTurnos.splice(numero - 1, 1)
  alert("Turno eliminado correctamente.")
}


while (opcion !== 4) {
  switch(opcion) {
    case 1:
      let nombre = prompt("Ingresa tu nombre:")
      let fecha = prompt("Que fecha queres el turno? DD/MM:")
      let hora = prompt("Ingresa el horario deseado (HH:MM):")
      let servicio = prompt("Que te vas a realizar (Corte, Color, Peinado, Barba, etc):")

     
      if (!nombre || !fecha || !hora || !servicio) {
        alert("Todos los campos son obligatorios. Turno no agregado.")
      } else {
        agregarTurno(nombre, fecha, hora, servicio)
      }

      break

    case 2:
      mostrarTurnos(turnos)

      break

    case 3:
      if (turnos.length === 0) {
        alert("No hay turnos para eliminar.")
      } else {
        let texto = "Turnos:\n"
        for (let i = 0; i < turnos.length; i++) {
          texto += (i + 1) + " - " + turnos[i] + "\n"
        }
        let numero = parseInt(prompt(texto + "\nIngrese el número del turno a eliminar:"))
        if (numero >= 1 && numero <= turnos.length) {
        eliminarTurno(turnos, numero)
        } else {
        alert("Número inválido. No se eliminó ningún turno.")
        }
      }

      break

    default:
      alert("Opción incorrecta. Ingresá 1, 2, 3 o 4.")
  }

  opcion = parseInt(prompt(
    "Hola " + cliente  +  " selecciona la opcion deseada\n\n" +
    "1 - Agregar turno\n" +
    "2 - Mostrar turnos\n" +
    "3 - Eliminar turno\n" +  
    "4 - Salir\n\n" +
    "Ingresá el número de la opción:"
  ))
}

alert("Gracias por elegirnos, " + cliente  + ". ¡Hasta pronto!")