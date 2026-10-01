import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
// IMPORTA TU VIDEO AQUÍ - Ajusta la ruta según tu estructura de carpetas
import videoBg from "../assets/Video_1.mp4"; 

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================
  // OBTENER TODOS LOS PEDIDOS
  // =========================
  const obtenerPedidos = async () => {
    try {
      setCargando(true);
      setError("");
      const res = await api.get("/pedidos");
      setPedidos(res.data);
    } catch (error) {
      console.error(error);
      setError("No se pudieron obtener los pedidos.");
    } finally {
      setCargando(false);
    }
  };

  // =========================
  // OBTENER DETALLE DEL PEDIDO
  // =========================
  const verDetalle = async (id) => {
    try {
      const res = await api.get(`/pedidos/${id}`);
      setPedidoSeleccionado(res.data);
    } catch (error) {
      console.error(error);
      alert("No se pudo obtener el detalle del pedido.");
    }
  };

  // =========================
  // CARGAR PEDIDOS AL INICIAR
  // =========================
  useEffect(() => {
    obtenerPedidos();
  }, []);

  return (
    <div
      style={{
        position: "relative", // Necesario para posicionar el contenido sobre el video
        minHeight: "100vh",
        paddingBottom: "40px",
        overflow: "hidden" // Evita barras de desplazamiento no deseadas si el video se desborda ligeramente
      }}
    >
      {/* =========================
          VIDEO DE FONDO
      ========================= */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed", // Fija el video a la ventana gráfica
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover", // Escala el video para cubrir todo el contenedor sin estirarse
          zIndex: -2, // Coloca el video detrás de todo el contenido
        }}
      >
        <source src={videoBg} type="video/mp4" />
      </video>

      {/* =========================
          OVERLAY OSCURO (OPCIONAL)
          Mejora el contraste del texto sobre el video
      ========================= */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)", // Capa negra semitransparente (ajusta la opacidad según necesites)
          zIndex: -1, // Detrás del contenido, pero delante del video
        }}
      ></div>

      {/* =========================
          CONTENIDO PRINCIPAL
      ========================= */}
      <div className="container pt-4">
        {/* ENCABEZADO */}
        {/* He cambiado las clases de texto para que sean blancas y contrasten con el fondo oscuro */}
        <div className="d-flex justify-content-between align-items-center mb-4 text-white">
          <div>
            <h1 className="fw-bold">Pedidos 📦</h1>
            <p className="mb-0 text-light">
              Pedidos registrados en el sistema
            </p>
          </div>
          <button
            className="btn btn-outline-light" // Botón con borde claro para contrastar
            onClick={() => navigate("/admin")}
          >
            ← Regresar
          </button>
        </div>

        {/* CARGANDO */}
        {cargando && (
          <div className="text-center mt-5 text-white">
            <div className="spinner-border text-light" role="status"></div>
            <p className="mt-3">Cargando pedidos...</p>
          </div>
        )}

        {/* ERROR */}
        {!cargando && error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {/* SIN PEDIDOS */}
        {!cargando && !error && pedidos.length === 0 && (
          <div className="alert alert-info">
            No hay pedidos registrados.
          </div>
        )}

        {/* LISTA DE PEDIDOS */}
        {!cargando && !error && pedidos.length > 0 && (
          <div className="row">
            {pedidos.map((pedido) => (
              <div className="col-md-6 col-lg-4 mb-4" key={pedido.id}>
                {/* He añadido 'bg-dark text-white' a las tarjetas para que contrasten */}
                <div className="card shadow h-100 bg-dark text-white border-secondary">
                  <div className="card-body">
                    {/* ENCABEZADO TARJETA */}
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="fw-bold mb-0">
                        Pedido #{pedido.id}
                      </h4>
                      <span className="badge bg-success">
                        Registrado
                      </span>
                    </div>

                    <hr className="border-secondary" />

                    {/* CLIENTE */}
                    <p>
                      <strong>Cliente:</strong> {pedido.cliente}
                    </p>

                    {/* FECHA */}
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {pedido.fecha
                        ? new Date(pedido.fecha).toLocaleString()
                        : "Sin fecha"}
                    </p>

                    {/* TOTAL */}
                    <h4 className="text-success mt-3">
                      Total: ${Number(pedido.total).toFixed(2)}
                    </h4>

                    {/* DETALLES */}
                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={() => verDetalle(pedido.id)}
                    >
                      📋 Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL DE DETALLES */}
        {pedidoSeleccionado && (
          <div
            className="modal fade show d-block"
            style={{ background: "rgba(0,0,0,0.85)" }} // Fondo del modal ligeramente más oscuro
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content bg-dark text-white border-secondary">
                {/* HEADER */}
                <div className="modal-header border-secondary">
                  <h5 className="modal-title">
                    Pedido #{pedidoSeleccionado.pedido.id}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white" // Botón de cerrar blanco
                    onClick={() => setPedidoSeleccionado(null)}
                  ></button>
                </div>

                {/* BODY */}
                <div className="modal-body">
                  <p>
                    <strong>Cliente:</strong>{" "}
                    {pedidoSeleccionado.pedido.cliente}
                  </p>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {pedidoSeleccionado.pedido.fecha
                      ? new Date(
                          pedidoSeleccionado.pedido.fecha
                        ).toLocaleString()
                      : "Sin fecha"}
                  </p>

                  <hr className="border-secondary" />

                  <h5 className="mb-3">Productos</h5>

                  <div className="table-responsive">
                    <table className="table table-bordered table-dark table-hover border-secondary">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidoSeleccionado.detalle.map((item) => (
                          <tr key={item.id}>
                            <td>{item.nombre}</td>
                            <td>{item.cantidad}</td>
                            <td>${Number(item.subtotal).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-end">
                    <h4 className="text-success">
                      Total: ${Number(pedidoSeleccionado.pedido.total).toFixed(2)}
                    </h4>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="modal-footer border-secondary">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setPedidoSeleccionado(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pedidos;