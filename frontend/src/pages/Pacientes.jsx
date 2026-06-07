import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserInjured, FaClipboardList, FaNotesMedical, FaUser } from "react-icons/fa";
import api from "../services/api";
import logoInstituto from "../assets/logo-IBK-branco.png";
import "./Pacientes.css";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const isAdmin = JSON.parse(localStorage.getItem("usuario") || "{}").is_admin === 1;

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

  function calcularIdade(dataNascimento) {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const mes = hoje.getMonth() - nascimento.getMonth();

  if (
    mes < 0 ||
    (mes === 0 && hoje.getDate() < nascimento.getDate())
  ) {
    idade--;
  }

  return idade;
}

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
          <span>Histórico</span>
        </Link>

        <Link to="/nova-triagem" className="sidebar-item">
          <FaNotesMedical />
          <span>Triagem</span>
        </Link>
        {isAdmin && (
          <Link to="/cadastro-profissional" className="sidebar-item">
            <FaUser /><span>Profissional</span>
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
                    <th>Gênero</th>
                    <th>Sexo Clínico</th>
                    <th>Idade</th>
                    <th>Responsável</th>
                  </tr>
                </thead>

                <tbody>
                  {pacientes.map((paciente) => (
                    <tr key={paciente.id_paciente}>
                      <td>{paciente.id_paciente}</td>
                      <td className="nome-paciente">{paciente.nome}</td>
                      <td>{paciente.email}</td>
                      <td>{paciente.genero}</td>
                      <td>{paciente.sexo_referencia_clinica}</td>
                      <td>{calcularIdade(paciente.data_nascimento)} anos</td>
                      <td>{paciente.nome_responsavel || "-"}</td>
                    </tr>
                  ))}
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