const API = "http://localhost:3000/api";

async function login() {
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
    });

    const data = await res.json();
    console.log(data);

    if (data.token) {
        alert("Login OK");

        localStorage.setItem("token", data.token);

        if (data.usuario.rol === "ADMIN") {
            alert("Panel ADMIN (futuro)");
        } else {
            alert("Panel CANDIDATO (futuro)");
        }
    } else {
        alert(data.mensaje || "Error");
    }
}

async function register() {
    const res = await fetch(`${API}/usuarios/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            correo: "test" + Math.random() + "@test.com",
            password: "12345678",
            nombre: "Test",
            apellido_paterno: "User",
            tipo_identificacion: "RUT",
            numero_identificacion: Math.random().toString()
        })
    });

    const data = await res.json();
    console.log(data);

    alert("Usuario creado (ver consola)");
}