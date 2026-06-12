import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserInjured, FaClipboardList, FaNotesMedical, FaUser } from "react-icons/fa";
import api from "../services/api";
import logoInstituto from "../assets/logo-IBK-branco.png";
import "./HistoricoTriagem.css";
import BotaoRelatorio from "../components/BotaoRelatorio";

function buscarUsuarioSalvo() {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    return {};
  }

  return JSON.parse(usuarioSalvo);
}

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

  const [busca, setBusca] = useState("");
  const [filtroRecomendacao, setFiltroRecomendacao] = useState("TODOS");
  const triagensFiltradas = triagens.filter((triagem) => {
    const nomeDoPaciente = (triagem.nome || "").toLowerCase();
    const termoDeBusca = busca.toLowerCase();

    const passouNaBusca = nomeDoPaciente.includes(termoDeBusca);
    const passouNoFiltro = filtroRecomendacao === "TODOS" || triagem.recomendacao === filtroRecomendacao;

    return passouNaBusca && passouNoFiltro;
  });

  const usuario = buscarUsuarioSalvo();
  const isAdmin = usuario.is_admin === 1;

  function alternarObservacoes(idTriagem) {
    if (triagemAberta === idTriagem) {
      setTriagemAberta(null);
      return;
    }

    setTriagemAberta(idTriagem);
  }

  function buscarTextoBotao(idTriagem) {
    if (triagemAberta === idTriagem) {
      return "Ocultar";
    }

    return "Visualizar";
  }

  function buscarTextoObservacao(triagem) {
    if (triagem.observacoes) {
      return triagem.observacoes;
    }

    return "Nenhuma observacao registrada.";
  }

  useEffect(() => {
    async function carregarTriagens() {
      try {
        const resposta = await api.get("/triagens");
        setTriagens(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar historico:", erro);
      }
    }

    carregarTriagens();
  }, []);

  return (
    <div className="historico-page">
      <aside className="sidebar">
        <div className="sidebar-menu">
          <Link to="/pacientes" className="sidebar-item">
            <FaUserInjured />
            <span>Pacientes</span>
          </Link>

          <Link to="/historico" className="sidebar-item active">
            <FaClipboardList />
            <span>Historico</span>
          </Link>

          <Link to="/nova-triagem" className="sidebar-item">
            <FaNotesMedical />
            <span>Triagem</span>
          </Link>

          {isAdmin && (
            <Link to="/cadastro-profissional" className="sidebar-item">
              <FaUser />
              <span>Profissional</span>
            </Link>
          )}
        </div>

        <div className="sidebar-logo">
          <img src={logoInstituto} alt="Logo Instituto" />
        </div>
      </aside>

      <main className="historico-content">
        <section className="historico-area">
          <div className="historico-titulo">
            <h1>HISTORICO</h1>
            <p>Consulte as triagens ja realizadas no sistema.</p>
          </div>

          <div className="filtros-historico">
            <input
              placeholder="Buscar por paciente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="campo-busca"
            />

            <select
              value={filtroRecomendacao}
              onChange={(e) => setFiltroRecomendacao(e.target.value)}
              className="campo-busca"
            >
              <option value="TODOS">Todas as recomendações</option>
              <option value="ENCAMINHAR_TESTE_GENETICO">Encaminhar</option>
              <option value="NAO_ENCAMINHAR">Não Encaminhar</option>
            </select>
          </div>

          <div className="historico-card">
            {triagensFiltradas.length === 0 ? (
              <p className="historico-vazio">Nenhuma triagem registrada.</p>
            ) : (
              <div className="tabela-wrapper">
                <table className="historico-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Paciente</th>
                      <th>Data</th>
                      <th>Hora</th>
                      <th>Score</th>
                      <th>Recomendacao</th>
                      <th>Observacoes</th>
                      <th>Relatório</th>
                    </tr>
                  </thead>

                  <tbody>
                    {triagensFiltradas.map((triagem) => {
                      const observacoesAbertas = triagemAberta === triagem.id_triagem;

                      return (
                        <Fragment key={triagem.id_triagem}>
                          <tr>
                            <td>{triagem.id_triagem}</td>
                            <td className="nome-paciente">{triagem.nome}</td>
                            <td>{formatarData(triagem.data_triagem)}</td>
                            <td>{formatarHora(triagem.data_triagem)}</td>
                            <td>{triagem.score_triagem}</td>
                            <td>{triagem.recomendacao}</td>
                            <td>
                              <button
                                className="btn-observacoes"
                                onClick={() => alternarObservacoes(triagem.id_triagem)}
                              >
                                {buscarTextoBotao(triagem.id_triagem)}
                              </button>
                            </td>
                            <td>
                              <BotaoRelatorio idTriagem={triagem.id_triagem} />
                            </td>
                          </tr>

                          {observacoesAbertas && (
                            <tr className="linha-observacoes">
                              <td colSpan="8">
                                <strong>Observacoes:</strong>
                                <p>{buscarTextoObservacao(triagem)}</p>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HistoricoTriagem;
