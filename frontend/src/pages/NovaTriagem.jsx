import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserInjured, FaClipboardList, FaNotesMedical, FaUser } from "react-icons/fa";
import FormPaciente from "../components/FormPaciente";
import ListaSintomas from "../components/ListaSintomas";
import api from "../services/api";
import logoInstituto from "../assets/logo-IBK-branco.png";
import "./NovaTriagem.css";

function buscarUsuarioSalvo() {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    return {};
  }

  return JSON.parse(usuarioSalvo);
}

function NovaTriagem() {
  const navigate = useNavigate();

  const usuario = buscarUsuarioSalvo();
  const isAdmin = usuario.is_admin === 1;

  const [paciente, setPaciente] = useState({});
  const [sintomasSelecionados, setSintomasSelecionados] = useState([]);
  const [sintomas, setSintomas] = useState([]);
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {
      navigate("/");
      return;
    }

    async function carregarSintomas() {
      try {
        const resposta = await api.get("/sintomas");
        setSintomas(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar sintomas:", erro);
      }
    }

    carregarSintomas();
  }, [navigate]);

  async function salvarTriagem() {
    const dadosDaTriagem = {
      paciente: paciente,
      sintomas: sintomasSelecionados,
      observacoes: observacoes
    };

    try {
      const resposta = await api.post("/triagens", dadosDaTriagem);

      navigate("/resultado", {
        state: resposta.data
      });
    } catch (erro) {
      console.error("Erro ao salvar triagem:", erro);
    }
  }

  return (
    <div className="layout-sistema">
      <aside className="sidebar">
        <div className="sidebar-menu">
          <Link to="/pacientes" className="sidebar-item">
            <FaUserInjured />
            <span>Pacientes</span>
          </Link>

          <Link to="/historico" className="sidebar-item">
            <FaClipboardList />
            <span>Historico</span>
          </Link>

          <Link to="/nova-triagem" className="sidebar-item active">
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

      <main className="conteudo-principal">
        <section className="triagem-area">
          <div className="triagem-titulo">
            <h1>TRIAGEM</h1>
            <p>Preencha os dados do paciente e selecione os sintomas apresentados.</p>
          </div>

          <div className="triagem-card">
            <div className="triagem-section">
              <h2>Dados do Paciente</h2>

              <FormPaciente
                paciente={paciente}
                setPaciente={setPaciente}
              />
            </div>

            <div className="triagem-section">
              <h2>Sintomas</h2>

              <ListaSintomas
                sintomas={sintomas}
                sintomasSelecionados={sintomasSelecionados}
                setSintomasSelecionados={setSintomasSelecionados}
              />
            </div>

            <div className="triagem-section">
              <h2>Observacoes do Medico</h2>

              <textarea
                className="campo-observacoes"
                placeholder="Digite observacoes relevantes sobre o paciente, sintomas ou atendimento..."
                value={observacoes}
                onChange={(evento) => setObservacoes(evento.target.value)}
              />
            </div>

            <div className="triagem-footer">
              <p>Sintomas selecionados: {sintomasSelecionados.length}</p>

              <button className="btn-salvar" onClick={salvarTriagem}>
                Salvar Triagem
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NovaTriagem;
