import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import FormPaciente from "../components/FormPaciente";
import ListaSintomas from "../components/ListaSintomas";
import "./NovaTriagem.css";
import logoInstituto from "../assets/logo-IBK-branco.png";
import { FaUserInjured, FaClipboardList, FaNotesMedical, FaUser } from "react-icons/fa";



function NovaTriagem() {

  const navigate = useNavigate();

  const [paciente, setPaciente] = useState({});

  const [sintomasSelecionados, setSintomasSelecionados] = useState([]);

  const [sintomas, setSintomas] = useState([]);

  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
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


  
const salvarTriagem = async () => {
  try {
    const resposta = await api.post("/triagens", {
      paciente,
      sintomas: sintomasSelecionados,
      observacoes: observacoes
    });

    navigate("/resultado", {
      state: resposta.data
    });

  } catch (erro) {
    console.error("Erro:", erro);
  }
};

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
            <span>Histórico</span>
          </Link>

          <Link to="/nova-triagem" className="sidebar-item active">
            <FaNotesMedical />
            <span>Triagem</span>
          </Link>
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
            <h2>Observações do Médico</h2>

            <textarea
              className="campo-observacoes"
              placeholder="Digite observações relevantes sobre o paciente, sintomas ou atendimento..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          <div className="triagem-footer">
            <p>
              Sintomas selecionados: {sintomasSelecionados.length}
            </p>

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