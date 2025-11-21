document.addEventListener("DOMContentLoaded", async () => {
  // -------------------- CONFIGURACIÓN SUPABASE --------------------
  const SUPABASE_URL = "https://vhoactnkjwtoljiktxle.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZob2FjdG5rand0b2xqaWt0eGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTEyNjMsImV4cCI6MjA3OTMyNzI2M30.jrIt5AoW0kHAIcGrzJrchSxhGI07xgCDOYAk2RPEXTQ";
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // -------------------- USUARIO ACTUAL --------------------
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuarioActual) {
    alert("No estás logueado. Redirigiendo al login...");
    window.location.href = "login.html";
    return;
  }

  const tabla = document.getElementById("tablaIngresos");
  const totalElement = document.getElementById("totalIngresos");

  // -------------------- CARGAR INGRESOS --------------------
  async function cargarIngresos() {
    let registros = [];

    if (supabaseClient) {
      const { data } = await supabaseClient
        .from("ingresos")
        .select("*")
        .order("fecha", { ascending: false });
      registros = data || [];
    } else {
      registros = JSON.parse(localStorage.getItem("ingresos") || "[]");
    }

    // Filtrar solo los ingresos del usuario logueado
    registros = registros.filter(r => r.cliente === usuarioActual.nombre);

    // Limpiar tabla y calcular total
    tabla.innerHTML = "";
    let total = 0;

    registros.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.fecha}</td>
        <td>${r.cliente}</td>
        <td>${r.servicio}</td>
        <td>C$${r.precio}</td>
        <td>${r.cuenta}</td>
        <td><button class="btnEliminar" data-id="${r.id}">Eliminar</button></td>
      `;
      tabla.appendChild(tr);

      total += Number(r.precio);

      // Botón eliminar
      const btnEliminar = tr.querySelector(".btnEliminar");
      btnEliminar.addEventListener("click", async () => {
        const id = btnEliminar.dataset.id;

        if (supabaseClient) {
          await supabaseClient.from("ingresos").delete().eq("id", id);
        } else {
          let datos = JSON.parse(localStorage.getItem("ingresos") || "[]");
          datos = datos.filter(item => item.id != id);
          localStorage.setItem("ingresos", JSON.stringify(datos));
        }

        cargarIngresos(); // refrescar tabla
      });
    });

    totalElement.textContent = `C$${total}`;
  }

  // -------------------- FILTRO POR FECHAS --------------------
  function filtrar() {
    const desde = document.getElementById("desdeFiltro").value;
    const hasta = document.getElementById("hastaFiltro").value;

    const filas = document.querySelectorAll("#tablaIngresos tr");

    filas.forEach(f => {
      const fecha = f.children[0].textContent;
      f.style.display = (!desde || !hasta || (fecha >= desde && fecha <= hasta)) ? "table-row" : "none";
    });
  }

  document.getElementById("btnFiltrar").addEventListener("click", filtrar);

  // -------------------- PRESETS --------------------
  const presetBtns = document.querySelectorAll(".presets button");
  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const dias = Number(btn.dataset.range);
      const hoy = new Date();
      const desde = new Date(hoy);
      desde.setDate(hoy.getDate() - dias);

      document.getElementById("desdeFiltro").value = desde.toISOString().slice(0,10);
      document.getElementById("hastaFiltro").value = hoy.toISOString().slice(0,10);
      filtrar();
    });
  });

  // -------------------- INICIAR --------------------
  cargarIngresos();
});
