import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {FaUserInjured, FaClipboardList, FaNotesMedical, FaUserMd} from "react-icons/fa";
import api from "../services/api";
import logoInstituto from "../assets/logo-IBK-branco.png";
import "./CadastroProfissional.css";

function CadastroProfissional() {
  const [profissionais, setProfissionais] = useState([]);
  const [profissional, setProfissional] = useState({
    nome: "",
    email: "",
    senha: "",
    especialidade: ""
  });

  async function carregarProfissionais() {
    try {
      const resposta = await api.get("/profissionais");
      setProfissionais(resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar profissionais:", erro);
    }
  }

  useEffect(() => {
    carregarProfissionais();
  }, []);

  function atualizarCampo(evento) {
    const nomeDoCampo = evento.target.name;
    const valorDoCampo = evento.target.value;

    setProfissional({
      ...profissional,
      [nomeDoCampo]: valorDoCampo
    });
  }

  const cadastrarProfissional = async (e) => {
    e.preventDefault();

    try {
      await api.post("/profissionais", profissional);
      await carregarProfissionais();
      setProfissional({
        nome: "",
        email: "",
        senha: "",
        especialidade: ""
      });

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

          <div className="profissionais-card">
            <div className="cadastro-card-header">
              <h2>Profissionais cadastrados</h2>
              <p>Lista de profissionais de saude com acesso ao sistema.</p>
            </div>

            {profissionais.length === 0 ? (
              <p className="profissionais-vazio">Nenhum profissional cadastrado.</p>
            ) : (
              <div className="tabela-wrapper">
                <table className="profissionais-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Especialidade</th>
                      <th>Perfil</th>
                    </tr>
                  </thead>

                  <tbody>
                    {profissionais.map((item) => (
                      <tr key={item.id_profissional}>
                        <td>{item.id_profissional}</td>
                        <td className="nome-profissional">{item.nome}</td>
                        <td>{item.email}</td>
                        <td>{item.especialidade}</td>
                        <td>{item.is_admin === 1 ? "Administrador" : "Profissional"}</td>
                      </tr>
                    ))}
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

export default CadastroProfissional;
