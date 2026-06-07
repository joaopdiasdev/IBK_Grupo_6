import { useLocation, Link } from "react-router-dom";
import {FaUserInjured, FaClipboardList, FaNotesMedical, FaCheckCircle, FaExclamationTriangle} from "react-icons/fa";
import logoInstituto from "../assets/logo-IBK-branco.png";
import "./ResultadoTriagem.css";

function ResultadoTriagem() {
  const location = useLocation();
  const resultado = location.state;

  if (!resultado) {
    return (
      <div className="resultado-page">
        <aside className="sidebar">
          <div className="sidebar-menu">
            <Link to="/pacientes" className="sidebar-item">
              <FaUserInjured />
              <span>Pacientes</span>
            </Link>

            <Link to="/resultado" className="sidebar-item active">
              <FaClipboardList />
              <span>Resultados</span>
            </Link>

            <Link to="/nova-triagem" className="sidebar-item">
              <FaNotesMedical />
              <span>Triagem</span>
            </Link>
          </div>

          <div className="sidebar-logo">
            <img src={logoInstituto} alt="Logo Instituto" />
          </div>
        </aside>

        <main className="resultado-content">
          <div className="resultado-container">
            <div className="resultado-card resultado-vazio">
              <FaExclamationTriangle className="resultado-alerta-icon" />
              <h1>Nenhum resultado encontrado</h1>
              <p>Não há dados de triagem para exibir no momento.</p>

              <Link to="/nova-triagem" className="btn-nova-triagem">
                Fazer nova triagem
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="resultado-page">
      <aside className="sidebar">
        <div className="sidebar-menu">
          <Link to="/pacientes" className="sidebar-item">
            <FaUserInjured />
            <span>Pacientes</span>
          </Link>

          <Link to="/resultado" className="sidebar-item active">
            <FaClipboardList />
            <span>Resultados</span>
          </Link>

          <Link to="/nova-triagem" className="sidebar-item">
            <FaNotesMedical />
            <span>Triagem</span>
          </Link>
        </div>

        <div className="sidebar-logo">
          <img src={logoInstituto} alt="Logo Instituto" />
        </div>
      </aside>

      <main className="resultado-content">
        <div className="resultado-container">
          <div className="resultado-header">
            <h1>Resultado da Triagem</h1>
            <p>Resumo da avaliação realizada no sistema de triagem.</p>
          </div>

          <div className="resultado-card">
            <div className="resultado-status">
              <FaCheckCircle className="resultado-status-icon" />
              <div>
                <h2>Triagem registrada com sucesso</h2>
                <p>{resultado.mensagem}</p>
              </div>
            </div>

            <div className="resultado-grid">
              <div className="resultado-info">
                <span>ID Paciente</span>
                <strong>{resultado.id_paciente}</strong>
              </div>

              <div className="resultado-info">
                <span>ID Triagem</span>
                <strong>{resultado.id_triagem}</strong>
              </div>

              <div className="resultado-info">
                <span>Score</span>
                <strong>{resultado.score}</strong>
              </div>

              <div className="resultado-info resultado-recomendacao">
                <span>Recomendação</span>
                <strong>{resultado.recomendacao}</strong>
              </div>
            </div>

            <div className="resultado-footer">
              <Link to="/nova-triagem" className="btn-nova-triagem">
                Fazer nova triagem
              </Link>

              <Link to="/pacientes" className="btn-secundario">
                Ver pacientes
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResultadoTriagem;