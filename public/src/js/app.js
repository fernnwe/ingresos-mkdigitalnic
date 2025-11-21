// Inicializa Supabase
const SUPABASE_URL = "https://vhoactnkjwtoljiktxle.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZob2FjdG5rand0b2xqaWt0eGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTEyNjMsImV4cCI6MjA3OTMyNzI2M30.jrIt5AoW0kHAIcGrzJrchSxhGI07xgCDOYAk2RPEXTQ";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Selecciones de DOM
const servicioSelect = document.getElementById("servicioSelect");
const precioInput = document.getElementById("precioInput");
const clienteInput = document.getElementById("clienteInput");
const cuentaSelect = document.getElementById("cuentaSelect");
const fechaInput = document.getElementById("fechaInput");

const colaboradorSelect = document.getElementById("colaboradorSelect");
const montoPagoInput = document.getElementById("montoPagoInput");
const fechaPagoInput = document.getElementById("fechaPagoInput");

const tablaIngresos = document.getElementById("tablaIngresos");
const totalIngresos = document.getElementById("totalIngresos");


// Cargar servicios en el select
servicios.forEach(s => {
  const option = document.createElement("option");
  option.value = s.nombre;
  option.textContent = s.nombre;
  servicioSelect.appendChild(option);
});

// Actualizar precio al seleccionar servicio
servicioSelect.addEventListener("change", () => {
  const servicio = servicios.find(s => s.nombre === servicioSelect.value);
  precioInput.value = servicio ? servicio.precio : "";
});

// ------------------ GUARDAR INGRESO ------------------
document.getElementById("btnGuardar").addEventListener("click", async () => {
  const registro = {
    servicio: servicioSelect.value,
    precio: Number(precioInput.value),
    cliente: clienteInput.value,
    cuenta: cuentaSelect.value,
    fecha: fechaInput.value
  };

  if (!registro.servicio || !registro.precio || !registro.cliente || !registro.fecha) {
    alert("Complete todos los campos para guardar el ingreso");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("ingresos")
      .insert([registro]);
    if (error) throw error;

    alert("Ingreso registrado correctamente");
    cargarIngresos();
    clienteInput.value = "";
    fechaInput.value = "";
  } catch (err) {
    console.error(err);
    alert("Error al guardar ingreso");
  }
});

// ------------------ GUARDAR PAGO A COLABORADOR ------------------
document.getElementById("btnPago").addEventListener("click", async () => {
  const registroPago = {
    servicio: "Pago a colaborador",
    precio: -Math.abs(Number(montoPagoInput.value)), // negativo
    cliente: colaboradorSelect.value,
    cuenta: "Pago",
    fecha: fechaPagoInput.value
  };

  if (!registroPago.precio || !registroPago.fecha) {
    alert("Complete todos los campos para registrar el pago");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("ingresos")
      .insert([registroPago]);
    if (error) throw error;

    alert("Pago registrado correctamente");
    cargarIngresos();
    montoPagoInput.value = "";
    fechaPagoInput.value = "";
  } catch (err) {
    console.error(err);
    alert("Error al registrar pago");
  }
});

async function cargarIngresos() {
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
  const { data: ingresos, error } = await supabaseClient
    .from("ingresos")
    .select("*")
    .eq("cliente", usuarioActual.nombre);

  if (error) return console.error(error);

  let total = 0;
  const tabla = document.getElementById("tablaIngresos");
  tabla.innerHTML = "";

  ingresos.forEach(ingreso => {
    total += Number(ingreso.precio);
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${ingreso.fecha}</td>
      <td>${ingreso.cliente}</td>
      <td>${ingreso.servicio}</td>
      <td>C$${ingreso.precio}</td>
      <td>${ingreso.cuenta}</td>
      <td>
        <button onclick="eliminarIngreso(${ingreso.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });

  // Actualiza total en tabla
  document.getElementById("totalIngresos").textContent = `C$${total}`;

  // **Actualiza total en tarjeta resumen**
  document.getElementById("totalIngresosDashboard").textContent = `C$${total}`;
}

cargarIngresos();

