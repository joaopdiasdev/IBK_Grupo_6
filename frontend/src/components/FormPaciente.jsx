function FormPaciente({ paciente, setPaciente }) {
  const handleChange = (e) => {
    setPaciente({
      ...paciente,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="form-paciente">
      <div className="form-grupo">
        <label>Nome</label>
        <input
          name="nome"
          placeholder="Digite o nome"
          value={paciente.nome || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-grupo">
        <label>Email</label>
        <input
          name="email"
          placeholder="Digite o email"
          value={paciente.email || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-grupo">
        <label>Data de nascimento</label>
        <input
          name="data_nascimento"
          type="date"
          value={paciente.data_nascimento || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-grupo">
        <label>Gênero</label>
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
      </div>

      <div className="form-grupo">
        <label>Sexo de referência clínica</label>
        <select
          name="sexo_referencia_clinica"
          value={paciente.sexo_referencia_clinica || ""}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>

      <div className="form-grupo">
        <label>Nome do responsável</label>
        <input
          name="nome_responsavel"
          placeholder="Digite o nome do responsável"
          value={paciente.nome_responsavel || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default FormPaciente;