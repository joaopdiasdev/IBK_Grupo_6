function FormPaciente({ paciente, setPaciente }) {
  const handleChange = (e) => {
    setPaciente({
      ...paciente,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h3>Dados do Paciente</h3>

      <input
        name="nome"
        placeholder="Nome"
        value={paciente.nome || ""}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={paciente.email || ""}
        onChange={handleChange}
      />

      <input
        name="data_nascimento"
        type="date"
        value={paciente.data_nascimento || ""}
        onChange={handleChange}
      />

      <select
        name="genero"
        value={paciente.genero || ""}
        onChange={handleChange}
      >
        <option value="">Selecione o gênero</option>
        <option value="MASCULINO">Masculino</option>
        <option value="FEMININO">Feminino</option>
        <option value="OUTRO">Outro</option>
        <option value="PREFERE_NAO_INFORMAR">Prefere não informar</option>
      </select>

      <select
        name="sexo_referencia_clinica"
        value={paciente.sexo_referencia_clinica || ""}
        onChange={handleChange}
      >
        <option value="">Sexo de referência clínica</option>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>

      <input
        name="nome_responsavel"
        placeholder="Nome do responsável"
        value={paciente.nome_responsavel || ""}
        onChange={handleChange}
      />
    </div>
  );
}

export default FormPaciente;