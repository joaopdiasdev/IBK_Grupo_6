import { useState } from "react";
import api from "../services/api";

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
    <div>
      <h1>Cadastro de Profissional de Saúde</h1>

      <form onSubmit={cadastrarProfissional}>
        <input
          name="nome"
          placeholder="Nome"
          value={profissional.nome}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={profissional.email}
          onChange={handleChange}
        />

        <input
          name="senha"
          type="password"
          placeholder="Senha"
          value={profissional.senha}
          onChange={handleChange}
        />

        <select
          name="especialidade"
          value={profissional.especialidade}
          onChange={handleChange}
        >
          <option value="">Selecione a especialidade</option>
          <option value="MÉDICO(A)">Médico(a)</option>
          <option value="ENFERMEIRO(A)">Enfermeiro(a)</option>
        </select>

        <button type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default CadastroProfissional;