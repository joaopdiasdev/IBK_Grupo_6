import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logoInstituto from "../assets/LOGO_IBK.png";


function Home() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();



  const fazerLogin = async (e) => {
    e.preventDefault();

    try {
      const resposta = await api.post("/login", {
        email,
        senha
       });

        localStorage.setItem(
          "usuario",
          JSON.stringify(resposta.data.usuario)
        );

        navigate("/nova-triagem");

  } catch (erro) {
      console.error("Erro:", erro);
      alert("Email ou senha inválidos");
  }
};



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
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="login-grupo">
        <label>Senha</label>
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
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