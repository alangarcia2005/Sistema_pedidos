import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axios";
import videoBg from "../assets/Video_4.mp4";

const Admin = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    disponible: true,
  });

  const [editando, setEditando] = useState(false);
  const [productoId, setProductoId] = useState(null);

  // =========================
  // OBTENER PRODUCTOS
  // =========================
  const obtenerProductos = async () => {
    try {
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // =========================
  // MANEJAR INPUTS
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  // =========================
  // CREAR O EDITAR
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/productos/${productoId}`, formulario);
        alert("Producto actualizado ✅");
      } else {
        await api.post("/productos", formulario);
        alert("Producto creado ✅");
      }

      setFormulario({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        disponible: true,
      });

      setEditando(false);
      setProductoId(null);
      obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("Error");
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const eliminarProducto = async (id) => {
    const confirmar = confirm("¿Eliminar producto?");
    if (!confirmar) return;

    try {
      await api.delete(`/productos/${id}`);
      alert("Producto eliminado");
      obtenerProductos();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // EDITAR
  // =========================
  const editarProducto = (producto) => {
    setFormulario({
      nombre: producto.Nombre,
      descripcion: producto.Descripcion,
      precio: producto.Precio,
      categoria: producto.Categoria,
      disponible: producto.Disponible,
    });

    setEditando(true);
    setProductoId(producto.Id);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
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
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src={videoBg} type="video/mp4" />
      </video>

      {/* OVERLAY OSCURO */}
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.55)",
          zIndex: -1,
        }}
      ></div>

      {/* CONTENIDO */}
      <div className="container-fluid p-4">
        {/* TÍTULO Y BOTÓN */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-white mb-0" style={{ fontWeight: "bold" }}>
            Panel de control ⚙️
          </h1>
          <button
            className="btn btn-primary fw-bold"
            onClick={() => navigate("/pedidos")}
          >
            📦 Ver pedidos
          </button>
        </div>

        <div className="row">
          {/* FORMULARIO */}
          <div className="col-md-4 mb-4">
            <div
              className="shadow p-4"
              style={{
                borderRadius: "20px",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
              }}
            >
              <h3 className="mb-3">
                {editando ? "Editar Producto" : "Crear Producto"}
              </h3>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Nombre"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  required
                />

                <textarea
                  className="form-control mb-3"
                  placeholder="Descripción"
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Precio"
                  name="precio"
                  value={formulario.precio}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Categoría"
                  name="categoria"
                  value={formulario.categoria}
                  onChange={handleChange}
                  required
                />

                <button type="submit" className="btn btn-warning w-100 fw-bold">
                  {editando ? "Actualizar" : "Crear"}
                </button>
              </form>
            </div>
          </div>

          {/* TABLA DE PRODUCTOS */}
          <div className="col-md-8">
            <div
              className="shadow p-4"
              style={{
                borderRadius: "20px",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
              }}
            >
              <h3 className="mb-4">Productos</h3>

              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr key={producto.Id}>
                        <td>{producto.Id}</td>
                        <td>{producto.Nombre}</td>
                        <td>${producto.Precio}</td>
                        <td>{producto.Categoria}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => editarProducto(producto)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarProducto(producto.Id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;