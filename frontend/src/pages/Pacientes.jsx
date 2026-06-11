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

          <div className="pacientes-card">
            {pacientes.length === 0 ? (
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
                    {pacientes.map((paciente) => {
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
