import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NovaTriagem from "./pages/NovaTriagem";
import ResultadoTriagem from "./pages/ResultadoTriagem";
import HistoricoTriagem from "./pages/HistoricoTriagem";
import Pacientes from "./pages/Pacientes";
import CadastroProfissional from "./pages/CadastroProfissional";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/nova-triagem"
          element={<NovaTriagem />}
        />

        <Route
          path="/resultado"
          element={<ResultadoTriagem />}
        />

        <Route
          path="/historico"
          element={<HistoricoTriagem />}
        />

        <Route path="/pacientes" 
        element={<Pacientes />} 
        />

        <Route path="/cadastro-profissional" 
        element={<CadastroProfissional />} 
        />

      </Routes>


    </BrowserRouter>
  );
}

export default App;