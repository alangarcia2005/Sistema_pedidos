import { useEffect, useState } from "react";
import api from "../Api/axios";
import { useNavigate } from "react-router-dom";
import videoBg from "../assets/Video_5.mp4";

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState("");

  const navigate = useNavigate();

  // OBTENER PRODUCTOS
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

  // AGREGAR AL CARRITO
  const agregarCarrito = (producto) => {
    const existe = carrito.find((item) => item.Id === producto.Id);

    if (existe) {
      const nuevoCarrito = carrito.map((item) =>
        item.Id === producto.Id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item,
      );

      setCarrito(nuevoCarrito);
    } else {
      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad: 1,
        },
      ]);
    }
  };

  // TOTAL
  const total = carrito.reduce(
    (acc, item) => acc + item.Precio * item.cantidad,
    0,
  );

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    navigate("/login");
  };

  const realizarPedido = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (!cliente) {
      alert("Ingresa el nombre del cliente");
      return;
    }

    try {
      const pedido = {
        cliente,
        productos: carrito.map((item) => ({
          producto_id: item.Id,
          precio: Number(item.Precio),
          cantidad: item.cantidad,
        })),
      };

      const res = await api.post("/pedidos", pedido);

      alert(`
Pedido realizado correctamente ✅

Pedido ID: ${res.data.pedidoId}
Total: $${res.data.total}
    `);

      setCarrito([]);
      setCliente("");
    } catch (error) {
      console.error(error);

      alert("Error al crear pedido");
    }
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

      {/* OVERLAY */}
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
      <div className="container-fluid">
        {/* NAVBAR */}
        <div
          className="d-flex justify-content-between align-items-center p-3"
          style={{
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            color: "white",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
            }}
          >
            Sistema de Pedidos 🍔
          </h2>

          <button className="btn btn-danger" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        <div className="row">
          {/* PRODUCTOS */}
          <div className="col-md-8 p-4">
            <h3 className="mb-4 text-white">Menú</h3>

            <div className="row">
              {productos.map((producto) => (
                <div className="col-md-4 mb-4" key={producto.Id}>
                  <div
                    className="card shadow h-100"
                    style={{
                      borderRadius: "20px",
                      background: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  >
                    <div className="card-body">
                      <h5 className="fw-bold">{producto.Nombre}</h5>

                      <p>{producto.Descripcion}</p>

                      <h4 className="text-warning">${producto.Precio}</h4>

                      <span className="badge bg-dark mb-3">
                        {producto.Categoria}
                      </span>

                      <button
                        className="btn btn-success w-100 fw-bold"
                        onClick={() => agregarCarrito(producto)}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARRITO */}
          <div className="col-md-4 p-4">
            <div
              className="shadow"
              style={{
                borderRadius: "20px",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                padding: "25px",
              }}
            >
              <h3>Carrito 🛒</h3>

              <hr className="border-light" />

              {carrito.length === 0 ? (
                <p>No hay productos</p>
              ) : (
                carrito.map((item) => (
                  <div key={item.Id} className="mb-3 border-bottom pb-2">
                    <h5>{item.Nombre}</h5>

                    <p>Cantidad: {item.cantidad}</p>

                    <p>
                      ${item.Precio} x {item.cantidad}
                    </p>
                  </div>
                ))
              )}

              <hr className="border-light" />

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Nombre del cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />

              <h4 className="text-warning">Total: ${total}</h4>

              <button
                className="btn btn-warning w-100 mt-3 fw-bold"
                onClick={realizarPedido}
              >
                Realizar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
