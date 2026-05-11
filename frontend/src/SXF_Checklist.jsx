import { useState } from "react";

const itens = {
  M: ["Face alongada", "Orelhas grandes", "Macroorquidismo", "Hiperatividade", "Atraso na fala", "Déficit intelectual"],
  F: ["Face alongada", "Orelhas grandes", "Hiperatividade", "Atraso na fala", "Déficit intelectual"],
};

export default function SXFChecklist() {
  const [sexo, setSexo] = useState("");
  const [marcados, setMarcados] = useState([]);

  const toggle = (i) => setMarcados((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  const score = marcados.length;
  const risco = score >= 4 ? "Alto" : score >= 2 ? "Moderado" : "Baixo";
  const cor = score >= 4 ? "red" : score >= 2 ? "orange" : "green";

  return (
    <div>
      <h2>Triagem SXF</h2>

      <p><strong>Sexo do paciente:</strong></p>
      {["M", "F"].map((s) => (
        <label key={s} style={{ marginRight: 16, cursor: "pointer" }}>
          <input type="radio" name="sexo" checked={sexo === s} onChange={() => { setSexo(s); setMarcados([]); }} style={{ marginRight: 6 }} />
          {s === "M" ? "Masculino" : "Feminino"}
        </label>
      ))}

      {!sexo ? <p style={{ color: "#999" }}>Selecione o sexo para continuar.</p> : (
        <>
          {itens[sexo].map((c) => (
            <label key={c} style={{ display: "block", margin: "8px 0", cursor: "pointer" }}>
              <input type="checkbox" checked={marcados.includes(c)} onChange={() => toggle(c)} style={{ marginRight: 8 }} />
              {c}
            </label>
          ))}
          <hr />
          <p>Score: <strong>{score}/{itens[sexo].length}</strong> — Risco: <strong style={{ color: cor }}>{risco}</strong></p>
        </>
      )}
    </div>
  );
}