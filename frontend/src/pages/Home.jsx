import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logoInstituto from "../assets/LOGO_IBK.png";
import "./Home.css";

function salvarSessaoUsuario(token, usuario) {
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

function limparSessaoUsuario() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function fazerLogin(evento) {
    evento.preventDefault();

    try {
      const resposta = await api.post("/login", {
        email: email,
        senha: senha
      });

      const token = resposta.data.token;
      const usuario = resposta.data.usuario;

      salvarSessaoUsuario(token, usuario);
      navigate("/nova-triagem");
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);
      limparSessaoUsuario();
      alert("Email ou senha invalidos");
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={fazerLogin}>
        <div className="login-logo">
          <img src={logoInstituto} alt="Logo IBK" />
        </div>

        <div className="login-header">
          <h1>Sistema de Triagem SXF</h1>
          <p>Acesse com suas credenciais para iniciar uma triagem.</p>
        </div>

        <div className="login-grupo">
          <label>Email</label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </div>

        <div className="login-grupo">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
          />
        </div>

        <button className="login-botao" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Home;
