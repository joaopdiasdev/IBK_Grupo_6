function FormPaciente({ paciente, setPaciente }) {
  function atualizarCampo(evento) {
    const nomeDoCampo = evento.target.name;
    const valorDoCampo = evento.target.value;

    setPaciente({
      ...paciente,
      [nomeDoCampo]: valorDoCampo
    });
  }

  function buscarValorDoCampo(nomeDoCampo) {
    if (paciente[nomeDoCampo]) {
      return paciente[nomeDoCampo];
    }

    return "";
  }

  return (
    <div className="form-paciente">
      <div className="form-grupo">
        <label>Nome</label>
        <input
          name="nome"
          placeholder="Digite o nome"
          value={buscarValorDoCampo("nome")}
          onChange={atualizarCampo}
        />
      </div>

      <div className="form-grupo">
        <label>Email</label>
        <input
          name="email"
          placeholder="Digite o email"
          value={buscarValorDoCampo("email")}
          onChange={atualizarCampo}
        />
      </div>

      <div className="form-grupo">
        <label>Data de nascimento</label>
        <input
          name="data_nascimento"
          type="date"
          value={buscarValorDoCampo("data_nascimento")}
          onChange={atualizarCampo}
        />
      </div>

      <div className="form-grupo">
        <label>Genero</label>
        <select
          name="genero"
          value={buscarValorDoCampo("genero")}
          onChange={atualizarCampo}
        >
          <option value="">Selecione o genero</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMININO">Feminino</option>
          <option value="OUTRO">Outro</option>
          <option value="PREFERE_NAO_INFORMAR">Prefere nao informar</option>
        </select>
      </div>

      <div className="form-grupo">
        <label>Sexo de referencia clinica</label>
        <select
          name="sexo_referencia_clinica"
          value={buscarValorDoCampo("sexo_referencia_clinica")}
          onChange={atualizarCampo}
        >
          <option value="">Selecione</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>

      <div className="form-grupo">
        <label>Nome do responsavel</label>
        <input
          name="nome_responsavel"
          placeholder="Digite o nome do responsavel"
          value={buscarValorDoCampo("nome_responsavel")}
          onChange={atualizarCampo}
        />
      </div>
    </div>
  );
}

export default FormPaciente;
