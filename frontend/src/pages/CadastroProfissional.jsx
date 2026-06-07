import { useState } from "react";
import { Link } from "react-router-dom";
import {FaUserInjured, FaClipboardList, FaNotesMedical, FaUserMd} from "react-icons/fa";
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

  const handleChange = (e) => {
    setProfissional({
      ...profissional,
      [e.target.name]: e.target.value
    });
  };

  const cadastrarProfissional = async (e) => {
    e.preventDefault();

    try {
      const resposta = await api.post("/profissionais", profissional);

      console.log(resposta.data);
      alert("Profissional cadastrado com sucesso!");
    } catch (erro) {
      console.error("Erro ao cadastrar profissional:", erro);
      alert("Erro ao cadastrar profissional");
    }
  };

  return (
    <div className="cadastro-page">
      <aside className="sidebar">
        <div className="sidebar-menu">
          <Link to="/pacientes" className="sidebar-item">
            <FaUserInjured />
            <span>pacientes</span>
          </Link>

          <Link to="/historico" className="sidebar-item">
            <FaClipboardList />
            <span>Histórico</span>
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
            <p>Cadastre profissionais de saúde para acesso ao sistema de triagem.</p>
          </div>

          <div className="cadastro-card">
            <div className="cadastro-card-header">
              <h2>Dados do Profissional</h2>
              <p>Preencha as informações abaixo para criar um novo acesso.</p>
            </div>

            <form onSubmit={cadastrarProfissional} className="form-profissional">
              <div className="form-grupo">
                <label>Nome</label>
                <input
                  name="nome"
                  placeholder="Digite o nome completo"
                  value={profissional.nome}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grupo">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Digite o email"
                  value={profissional.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grupo">
                <label>Senha</label>
                <input
                  name="senha"
                  type="password"
                  placeholder="Digite a senha"
                  value={profissional.senha}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grupo">
                <label>Especialidade</label>
                <select
                  name="especialidade"
                  value={profissional.especialidade}
                  onChange={handleChange}
                >
                  <option value="">Selecione a especialidade</option>
                  <option value="MÉDICO(A)">Médico(a)</option>
                  <option value="ENFERMEIRO(A)">Enfermeiro(a)</option>
                </select>
              </div>

              <div className="cadastro-footer">
                <p>Após cadastrar, o profissional poderá acessar o sistema pelo login.</p>

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