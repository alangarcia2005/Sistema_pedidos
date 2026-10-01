import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Pedidos from "./pages/Pedidos";
import Admin from "./pages/Admin";

import "bootstrap/dist/css/bootstrap.min.css";

// Ruta protegida
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const rol = localStorage.getItem("rol");

  return rol === "admin" ? children : <Navigate to="/menu" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* MENU */}
        <Route
          path="/menu"
          element={
            <PrivateRoute>
              <Menu />
            </PrivateRoute>
          }
        />

        {/* PEDIDOS */}
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <Pedidos />
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* REDIRECCIÓN */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
