import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
import videoBg from "../assets/Video_2.mp4";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        correo,
        password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("rol", res.data.usuario.Rol);

      if (res.data.usuario.Rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/menu");
      }
    } catch (err) {
      console.error(err);

      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={videoBg} type="video/mp4" />
      </video>

      {/* CAPA OSCURA */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
        }}
      ></div>

      {/* LOGIN */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        <div
          className="card shadow-lg p-5"
          style={{
            width: "400px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
          }}
        >
          <div className="text-center mb-4">
            <h1
              style={{
                fontWeight: "bold",
              }}
            >
              Bienvenido
            </h1>

            <p>Inicia sesión para disfrutar de nuestros platillos</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="mb-3">
              <label className="form-label">Correo</label>

              <input
                type="email"
                className="form-control"
                placeholder="correo@gmail.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Contraseña</label>

              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="btn w-100"
              style={{
                background: "#ff9800",
                color: "white",
                fontWeight: "bold",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
