

class NodoCita {
    constructor(cita) {
        this.cita = cita;        
        this.anterior = null;
        this.siguiente = null;
    }
}

// Clave de ordenamiento (fecha + hora)
const clave = (c) => c.fecha + c.hora;

class ListaCitas {
    constructor() {
        this.cabeza = null;
        this.cola = null;
        this.tam = 0;
    }


    insertarDespues(ref, cita) {
        const n = new NodoCita(cita);
        n.anterior = ref;
        n.siguiente = ref.siguiente;
        if (ref.siguiente) ref.siguiente.anterior = n;
        else this.cola = n;
        ref.siguiente = n;
        this.tam++;
        return n;
    }


    insertarAntes(ref, cita) {
        const n = new NodoCita(cita);
        n.siguiente = ref;
        n.anterior = ref.anterior;
        if (ref.anterior) ref.anterior.siguiente = n;
        else this.cabeza = n;
        ref.anterior = n;
        this.tam++;
        return n;
    }


    insertarOrdenado(cita) {
        if (!this.cabeza) {                       
            const n = new NodoCita(cita);
            this.cabeza = this.cola = n;
            this.tam++;
            return n;
        }
        let act = this.cabeza;
        while (act && clave(act.cita) <= clave(cita)) act = act.siguiente;
        if (act) return this.insertarAntes(act, cita);        
        return this.insertarDespues(this.cola, cita);          
    }


    buscarConflicto(doctor, fecha, hora) {
        for (let a = this.cabeza; a; a = a.siguiente) {
            const c = a.cita;
            if (c.doctor === doctor && c.fecha === fecha && c.hora === hora) return a;
        }
        return null;
    }


    eliminarNodo(nodo) {
        if (nodo.anterior) nodo.anterior.siguiente = nodo.siguiente;
        else this.cabeza = nodo.siguiente;
        if (nodo.siguiente) nodo.siguiente.anterior = nodo.anterior;
        else this.cola = nodo.anterior;
        nodo.anterior = nodo.siguiente = null;
        this.tam--;
    }

    
    recorrerAdelante() {
        const r = [];
        for (let a = this.cabeza; a; a = a.siguiente) r.push(a);
        return r;
    }

    
    recorrerAtras() {
        const r = [];
        for (let a = this.cola; a; a = a.anterior) r.push(a);
        return r;
    }
}
//variable para crea mi lista de citas
const citas = new ListaCitas();
let ordenAdelante = true;

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        const hoy = new Date().toISOString().split("T")[0];
        document.getElementById("fecha").min = hoy; // aclaramos que no se puede tener fechas anterior al dia actual
    });
}

// funciones que nos permite identificar cuando se comete algun error en el proceso de agendar
function mostrarMensaje(texto, tipo) {
    const m = document.getElementById("mensaje");
    m.textContent = texto;
    m.className = "mensaje " + tipo;
}
// creamos el constructor para identificar con html que datos corresponden 
function agendarCita() {
    const nombre = document.getElementById("nombre").value.trim();
    const doctor = document.getElementById("doctor").value.trim();
    const fecha  = document.getElementById("fecha").value;
    const hora   = document.getElementById("hora").value;

    if (!nombre || !doctor || !fecha || !hora) {
        mostrarMensaje("⚠️ Debes completar todos los campos", "error"); //para errores de campos vacios
        return;
    }

    if (citas.buscarConflicto(doctor, fecha, hora)) {
        mostrarMensaje("❌ Ese doctor ya tiene una cita en esa fecha y hora", "error"); //validamos que no existan dos citas a la misma hora
        return;
    }

    citas.insertarOrdenado({ nombre, doctor, fecha, hora, estado: "Pendiente" }); // aclaramos el orden que se desea para mostrar la informacion de la cita agendada
    mostrarMensaje("✅ Cita agendada correctamente", "exito");

    document.getElementById("nombre").value = "";
    document.getElementById("doctor").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("hora").value = "";

    renderizarCitas();
}

function cancelarCita(nodo) {
    citas.eliminarNodo(nodo); // indicamos al nodo que debe borrar ese campo de la lista
    mostrarMensaje("🗑️ Cita cancelada", "exito");
    renderizarCitas();
}

function marcarAtendida(nodo) {
    nodo.cita.estado = "Atendida"; // solo de identifica pero no elimina la cita
    mostrarMensaje("✅ Cita marcada como atendida", "exito");
    renderizarCitas();
}

function cambiarOrden() {
    ordenAdelante = !ordenAdelante; // se invierte el orden de las citas creadas
    document.getElementById("btnOrden").textContent =
        ordenAdelante ? "Ver más recientes primero" : "Ver más antiguas primero";
    renderizarCitas();
}

function renderizarCitas() {
    const lista = document.getElementById("listaCitas"); // se encarga de mostrar y eliminar informacion de la cita
    lista.innerHTML = "";

    if (citas.tam === 0) {
        lista.innerHTML = '<li class="vacio">No hay citas agendadas aún</li>'; // inforamcion default cuando no hay citas
        return;
    }

    let nodos;
    if (ordenAdelante) {
        nodos = citas.recorrerAdelante();
    } else {
        nodos = citas.recorrerAtras();
    }

    nodos.forEach(nodo => {
        const c = nodo.cita;
        const li = document.createElement("li");

        const texto = document.createElement("span");
        const nom = document.createElement("span");
        nom.className = "nombre";
        nom.textContent = c.nombre;
        const doc = document.createElement("span");
        doc.className = "doctor";
        doc.textContent = c.doctor;
        // se muestra la informacion de la cita agendada
        const estado = document.createElement("span");
        estado.className = "estado";
        estado.textContent = ` - Estado: ${c.estado || "Pendiente"}`;
        texto.append(nom, " — ", doc, ` - 📅 ${c.fecha} a las 🕐 ${c.hora}`, estado);

        const btnAtendida = document.createElement("button");
        btnAtendida.className = "btn-atendida";
        btnAtendida.textContent = "Marcar atendida";
        btnAtendida.disabled = c.estado === "Atendida";
        btnAtendida.addEventListener("click", () => marcarAtendida(nodo));

        const btn = document.createElement("button");
        btn.className = "btn-cancelar";
        btn.textContent = "Cancelar";
        btn.addEventListener("click", () => cancelarCita(nodo));

        li.append(texto, btnAtendida, btn);
        lista.appendChild(li);
    });
}


function ejecutarPruebas() {
    const L = new ListaCitas();
    const f = (r) => r.map(n => n.cita.hora).join(",");
    const base = { nombre: "x", doctor: "Felipe", fecha: "2026-10-01" };

    L.insertarOrdenado({ ...base, hora: "10:00" });
    L.insertarOrdenado({ ...base, hora: "08:00" });   
    L.insertarOrdenado({ ...base, hora: "15:00" });   
    L.insertarOrdenado({ ...base, hora: "09:00" });   
    console.assert(f(L.recorrerAdelante()) === "08:00,09:00,10:00,15:00", "orden adelante");
    console.assert(f(L.recorrerAtras()) === "15:00,10:00,09:00,08:00", "orden atrás");
    console.assert(L.tam === 4, "tamaño tras insertar");

    console.assert(L.buscarConflicto("Felipe", "2026-10-01", "09:00"), "conflicto mismo doctor");
    console.assert(!L.buscarConflicto("Nicolas", "2026-10-01", "09:00"), "otro doctor sin conflicto");

    L.eliminarNodo(L.buscarConflicto("Felipe", "2026-10-01", "09:00"));  
    console.assert(f(L.recorrerAdelante()) === "08:00,10:00,15:00", "eliminar medio");
    L.eliminarNodo(L.cabeza);                                            
    L.eliminarNodo(L.cola);                                              
    console.assert(f(L.recorrerAdelante()) === "10:00" && L.cabeza === L.cola, "extremos");
    L.eliminarNodo(L.cabeza);
    console.assert(L.tam === 0 && !L.cabeza && !L.cola, "lista vacía");
    console.log("Pruebas terminadas: si no hay 'Assertion failed' arriba, todo pasó.");
}

if (typeof process !== "undefined" && process.argv && process.argv.includes("--test")) {
    ejecutarPruebas();
}
