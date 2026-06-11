import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NovaTriagem from "./pages/NovaTriagem";
import ResultadoTriagem from "./pages/ResultadoTriagem";
import HistoricoTriagem from "./pages/HistoricoTriagem";
import Pacientes from "./pages/Pacientes";
import CadastroProfissional from "./pages/CadastroProfissional";

function buscarUsuarioSalvo() {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    return null;
  }

  return JSON.parse(usuarioSalvo);
}

function RotaProtegida({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

function SoAdmin({ children }) {
  const token = localStorage.getItem("token");
  const usuario = buscarUsuarioSalvo();

  if (!token) {
    return <Navigate to="/" />;
  }

  if (!usuario) {
    return <Navigate to="/" />;
  }

  if (usuario.is_admin !== 1) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/nova-triagem"
          element={<RotaProtegida><NovaTriagem /></RotaProtegida>}
        />
        <Route
          path="/resultado"
          element={<RotaProtegida><ResultadoTriagem /></RotaProtegida>}
        />
        <Route
          path="/historico"
          element={<RotaProtegida><HistoricoTriagem /></RotaProtegida>}
        />
        <Route
          path="/pacientes"
          element={<RotaProtegida><Pacientes /></RotaProtegida>}
        />
        <Route
          path="/cadastro-profissional"
          element={<SoAdmin><CadastroProfissional /></SoAdmin>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
