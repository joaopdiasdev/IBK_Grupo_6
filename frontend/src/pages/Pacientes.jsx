import { useEffect, useState } from "react";
import api from "../services/api";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);

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
    <div>
      <h1>Pacientes</h1>

      <table border="1" cellPadding="8">
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
              <td>{paciente.nome}</td>
              <td>{paciente.email}</td>
              <td>{paciente.genero}</td>
              <td>{paciente.sexo_referencia_clinica}</td>
              <td>{calcularIdade(paciente.data_nascimento)}</td>
              <td>{paciente.nome_responsavel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pacientes;