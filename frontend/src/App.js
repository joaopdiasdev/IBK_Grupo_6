import { useState } from "react";
import SXFChecklist from "./SXF_Checklist";

export default function App() {
  const [pagina, setPagina] = useState("pacientes");

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif" }}>

      {/* Sidebar */}
      <div style={{ width: 180, minHeight: "100vh", background: "#2c3462", color: "#fff", padding: 20 }}>
        <h3 style={{ marginTop: 0 }}>IBK Grupo 6</h3>
        <p onClick={() => setPagina("pacientes")} style={{ cursor: "pointer", color: pagina === "pacientes" ? "#fff" : "#a0aec0" }}>Pacientes</p>
        <p onClick={() => setPagina("triagem")}   style={{ cursor: "pointer", color: pagina === "triagem"   ? "#fff" : "#a0aec0" }}>Triagem</p>
        <p onClick={() => setPagina("resultados")} style={{ cursor: "pointer", color: pagina === "resultados" ? "#fff" : "#a0aec0" }}>Resultados</p>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, padding: 32 }}>
        {pagina === "pacientes" && (
          <div>
            <h2>Pacientes</h2>
            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th>Nome</th><th>Idade</th><th>Email</th><th>Sexo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Felipe Sokulski</td><td>18</td><td>felipe@gmail.com</td><td>Masculino</td></tr>
                <tr><td>João Pedro</td><td>18</td><td>joao@gmail.com</td><td>Masculino</td></tr>
                <tr><td>Tiago Miglioli</td><td>20</td><td>tiago@gmail.com</td><td>Masculino</td></tr>
                <tr><td>Victor Henrico</td><td>18</td><td>victor@gmail.com</td><td>Masculino</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {pagina === "triagem" && <SXFChecklist />}

        {pagina === "resultados" && (
          <div>
            <h2>Resultados</h2>
            <p>Nenhum resultado ainda. Faça uma triagem primeiro.</p>
          </div>
        )}
      </div>
    </div>
  );
}