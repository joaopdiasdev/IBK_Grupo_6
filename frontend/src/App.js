import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NovaTriagem from "./pages/NovaTriagem";
import ResultadoTriagem from "./pages/ResultadoTriagem";
import HistoricoTriagem from "./pages/HistoricoTriagem";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;