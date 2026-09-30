// Array donde se guardan las citas
let citas = [];

// Establecer fecha mínima como hoy
document.addEventListener("DOMContentLoaded", () => {
    const hoy = new Date().toISOString().split("T")[0];
    document.getElementById("fecha").min = hoy;
});

function agendarCita() {
    const nombre = document.getElementById("nombre").value.trim();
    const doctor = document.getElementById("doctor").value.trim();
    const fecha  = document.getElementById("fecha").value;
    const hora   = document.getElementById("hora").value;
    const mensaje = document.getElementById("mensaje");

    // Validaciones
    if (!nombre || !fecha || !hora) {
        mensaje.textContent = "⚠️ Debes completar todos los campos";
        mensaje.className = "mensaje error";
        return;
    }

    // Verificar si ya existe una cita en esa fecha y hora
    const ocupada = citas.some(c => c.fecha === fecha && c.hora === hora);
    if (ocupada) {
        mensaje.textContent = "❌ Esa fecha y hora ya están ocupadas";
        mensaje.className = "mensaje error";
        return;
    }

    // Guardar cita
    citas.push({ nombre, doctor, fecha, hora });

    mensaje.textContent = "✅ Cita agendada correctamente";
    mensaje.className = "mensaje exito";

    // Limpiar formulario
    document.getElementById("nombre").value = "";
    document.getElementById("doctor").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("hora").value = "";

    renderizarCitas();
}

function renderizarCitas() {
    const lista = document.getElementById("listaCitas");
    lista.innerHTML = "";

    if (citas.length === 0) {
        lista.innerHTML = '<li class="vacio">No hay citas agendadas aún</li>';
        return;
    }

    // Ordenar por fecha y hora
    citas.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

    citas.forEach(c => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="nombre">${c.nombre}</span> — <span class="doctor"> ${c.doctor} </span> - 📅 ${c.fecha} a las 🕐 ${c.hora}`;
        lista.appendChild(li);
    });
}