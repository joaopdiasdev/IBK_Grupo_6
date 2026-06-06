import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";



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
    <div>

      <h1>Sistema de Triagem SXF</h1>

      <form onSubmit={fazerLogin}>

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Senha</label>
          <br />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Entrar
        </button>

      </form>

    </div>
  );
}

export default Home;