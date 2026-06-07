import { useEffect, useState } from "react";
import api from "../services/api";

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarHora(data) {
  return new Date(data).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function HistoricoTriagem() {
  const [triagens, setTriagens] = useState([]);
  const [triagemAberta, setTriagemAberta] = useState(null);

  useEffect(() => {
    async function carregarTriagens() {
      try {
        const resposta = await api.get("/triagens");
        setTriagens(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar histórico:", erro);
      }
    }

    carregarTriagens();
  }, []);

  return (
    <div>
      <h1>Histórico de Triagens</h1>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Score</th>
            <th>Recomendação</th>
            <th>Observações</th>
          </tr>
        </thead>

        <tbody>
          {triagens.map((triagem) => (
            <>
              <tr key={triagem.id_triagem}>
                <td>{triagem.id_triagem}</td>
                <td>{triagem.nome}</td>
                <td>{formatarData(triagem.data_triagem)}</td>
                <td>{formatarHora(triagem.data_triagem)}</td>
                <td>{triagem.score_triagem}</td>
                <td>{triagem.recomendacao}</td>
                <td>
                  <button
                    onClick={() =>
                      setTriagemAberta(
                        triagemAberta === triagem.id_triagem
                          ? null
                          : triagem.id_triagem
                      )
                    }
                  >
                    {triagemAberta === triagem.id_triagem
                      ? "Ocultar"
                      : "Visualizar"}
                  </button>
                </td>
              </tr>

              {triagemAberta === triagem.id_triagem && (
                <tr>
                  <td colSpan="6">
                    <strong>Observações:</strong>
                    <p>
                      {triagem.observacoes ||
                        "Nenhuma observação registrada."}
                    </p>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoricoTriagem;