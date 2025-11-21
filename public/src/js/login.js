document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://vhoactnkjwtoljiktxle.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZob2FjdG5rand0b2xqaWt0eGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NTEyNjMsImV4cCI6MjA3OTMyNzI2M30.jrIt5AoW0kHAIcGrzJrchSxhGI07xgCDOYAk2RPEXTQ";
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const btnLogin = document.getElementById("btnLogin");
  const usuarioInput = document.getElementById("usuarioInput");
  const passwordInput = document.getElementById("passwordInput");
  const mensajeError = document.getElementById("mensajeError");

  btnLogin.addEventListener("click", async () => {
    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();
    mensajeError.textContent = "";

    if (!usuario || !password) {
      mensajeError.textContent = "Complete ambos campos";
      return;
    }

    try {
      // Buscar en tabla usuarios
      const { data, error } = await supabaseClient
        .from("usuarios") // tabla correcta
        .select("*")
        .eq("usuario", usuario)
        .eq("password", password)
        .single();

      if (error) {
        console.error("Error Supabase:", error);
        mensajeError.textContent = "Usuario o contraseña incorrectos";
        return;
      }

      if (!data) {
        mensajeError.textContent = "Usuario o contraseña incorrectos";
        return;
      }

      // Guardar sesión
      localStorage.setItem("usuarioActual", JSON.stringify(data));
      window.location.href = "ingresos-ernesto.html";
    } catch (err) {
      console.error("Error en login:", err);
      mensajeError.textContent = "Error al conectar con el servidor";
    }
  });
});
