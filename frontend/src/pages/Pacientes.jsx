import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserInjured, FaClipboardList, FaNotesMedical, FaUser } from "react-icons/fa";
import api from "../services/api";
import logoInstituto from "../assets/logo-IBK-branco.png";
import "./Pacientes.css";

function buscarUsuarioSalvo() {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    return {};
  }

  return JSON.parse(usuarioSalvo);
}

function calcularIdade(dataNascimento) {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const diferencaMeses = hoje.getMonth() - nascimento.getMonth();

  if (diferencaMeses < 0) {
    idade--;
  } else if (diferencaMeses === 0 && hoje.getDate() < nascimento.getDate()) {
    idade--;
  }

  return idade;
}

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);

  const [busca, setBusca] = useState("");
  const [filtroSexo, setFiltroSexo] = useState("TODOS");
  const [filtroIdade, setFiltroIdade] = useState("TODOS");

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const nomeDoPaciente = (paciente.nome || "").toLowerCase();
    const termoDeBusca = busca.toLowerCase();

    const passouNaBusca = nomeDoPaciente.includes(termoDeBusca);
    const passouNoSexo = filtroSexo === "TODOS" || paciente.sexo_referencia_clinica === filtroSexo;

    const idadeDoPaciente = calcularIdade(paciente.data_nascimento);
    const passouNaIdade =
      filtroIdade === "TODOS" ||
      (filtroIdade === "0-12" && idadeDoPaciente <= 12) ||
      (filtroIdade === "13-17" && idadeDoPaciente >= 13 && idadeDoPaciente <= 17) ||
      (filtroIdade === "18+" && idadeDoPaciente >= 18);

    return passouNaBusca && passouNoSexo && passouNaIdade;
  });



  const usuario = buscarUsuarioSalvo();
  const isAdmin = usuario.is_admin === 1;

  useEffect(() => {
    async function carregarPacientes() {
      try {
        const resposta = await api.get("/pacientes");
        setPacientes(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar pacientes:", erro);
      }
    }

    carregarPacientes();
  }, []);

  return (
    <div className="pacientes-page">
      <aside className="sidebar">
        <div className="sidebar-menu">
          <Link to="/pacientes" className="sidebar-item active">
            <FaUserInjured />
            <span>Pacientes</span>
          </Link>

          <Link to="/historico" className="sidebar-item">
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

      <main className="pacientes-content">
        <div className="pacientes-container">
          <div className="pacientes-header">
            <div>
              <h1>PACIENTES</h1>
              <p>Lista de pacientes cadastrados no sistema de triagem.</p>
            </div>
          </div>

          <input
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="campo-busca"
          />

          <select
            value={filtroSexo}
            onChange={(e) => setFiltroSexo(e.target.value)}
            className="campo-busca"
          >
            <option value="TODOS">Todos os sexos</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>

          <select
            value={filtroIdade}
            onChange={(e) => setFiltroIdade(e.target.value)}
            className="campo-busca"
          >
            <option value="TODOS">Todas as idades</option>
            <option value="0-12">0 a 12 anos</option>
            <option value="13-17">13 a 17 anos</option>
            <option value="18+">18 anos ou mais</option>
          </select>

          <div className="pacientes-card">
            {pacientesFiltrados.length === 0 ? (
              <p className="pacientes-vazio">Nenhum paciente cadastrado.</p>
            ) : (
              <div className="tabela-wrapper">
                <table className="pacientes-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Genero</th>
                      <th>Sexo Clinico</th>
                      <th>Idade</th>
                      <th>Responsavel</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pacientesFiltrados.map((paciente) => {
                      const idadeDoPaciente = calcularIdade(paciente.data_nascimento);
                      const nomeResponsavel = paciente.nome_responsavel || "-";

                      return (
                        <tr key={paciente.id_paciente}>
                          <td>{paciente.id_paciente}</td>
                          <td className="nome-paciente">{paciente.nome}</td>
                          <td>{paciente.email}</td>
                          <td>{paciente.genero}</td>
                          <td>{paciente.sexo_referencia_clinica}</td>
                          <td>{idadeDoPaciente} anos</td>
                          <td>{nomeResponsavel}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Pacientes;
