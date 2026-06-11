import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserInjured, FaClipboardList, FaNotesMedical, FaUserMd } from "react-icons/fa";
import api from "../services/api";
import logoInstituto from "../assets/logo-IBK-branco.png";
import "./CadastroProfissional.css";

function CadastroProfissional() {
  const [profissional, setProfissional] = useState({
    nome: "",
    email: "",
    senha: "",
    especialidade: ""
  });

  function atualizarCampo(evento) {
    const nomeDoCampo = evento.target.name;
    const valorDoCampo = evento.target.value;

    setProfissional({
      ...profissional,
      [nomeDoCampo]: valorDoCampo
    });
  }

  async function cadastrarProfissional(evento) {
    evento.preventDefault();

    try {
      await api.post("/profissionais", profissional);
      alert("Profissional cadastrado com sucesso!");
    } catch (erro) {
      console.error("Erro ao cadastrar profissional:", erro);
      alert("Erro ao cadastrar profissional");
    }
  }

  return (
    <div className="cadastro-page">
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

          <Link to="/nova-triagem" className="sidebar-item">
            <FaNotesMedical />
            <span>Triagem</span>
          </Link>

          <Link to="/cadastro-profissional" className="sidebar-item active">
            <FaUserMd />
            <span>Profissional</span>
          </Link>
        </div>

        <div className="sidebar-logo">
          <img src={logoInstituto} alt="Logo Instituto" />
        </div>
      </aside>

      <main className="cadastro-content">
        <section className="cadastro-area">
          <div className="cadastro-titulo">
            <h1>CADASTRO PROFISSIONAL</h1>
            <p>Cadastre profissionais de saude para acesso ao sistema de triagem.</p>
          </div>

          <div className="cadastro-card">
            <div className="cadastro-card-header">
              <h2>Dados do Profissional</h2>
              <p>Preencha as informacoes abaixo para criar um novo acesso.</p>
            </div>

            <form onSubmit={cadastrarProfissional} className="form-profissional">
              <div className="form-grupo">
                <label>Nome</label>
                <input
                  name="nome"
                  placeholder="Digite o nome completo"
                  value={profissional.nome}
                  onChange={atualizarCampo}
                />
              </div>

              <div className="form-grupo">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Digite o email"
                  value={profissional.email}
                  onChange={atualizarCampo}
                />
              </div>

              <div className="form-grupo">
                <label>Senha</label>
                <input
                  name="senha"
                  type="password"
                  placeholder="Digite a senha"
                  value={profissional.senha}
                  onChange={atualizarCampo}
                />
              </div>

              <div className="form-grupo">
                <label>Especialidade</label>
                <select
                  name="especialidade"
                  value={profissional.especialidade}
                  onChange={atualizarCampo}
                >
                  <option value="">Selecione a especialidade</option>
                  <option value="MÃ‰DICO(A)">Medico(a)</option>
                  <option value="ENFERMEIRO(A)">Enfermeiro(a)</option>
                </select>
              </div>

              <div className="cadastro-footer">
                <p>Apos cadastrar, o profissional podera acessar o sistema pelo login.</p>

                <button type="submit" className="btn-cadastrar">
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CadastroProfissional;
