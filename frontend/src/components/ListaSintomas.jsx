function ListaSintomas({
  sintomas = [],
  sintomasSelecionados,
  setSintomasSelecionados
}) {
  function sintomaJaFoiSelecionado(idSintoma) {
    return sintomasSelecionados.includes(idSintoma);
  }

  function removerSintoma(idSintoma) {
    const novaLista = sintomasSelecionados.filter(function (idAtual) {
      return idAtual !== idSintoma;
    });

    setSintomasSelecionados(novaLista);
  }

  function adicionarSintoma(idSintoma) {
    const novaLista = [...sintomasSelecionados, idSintoma];
    setSintomasSelecionados(novaLista);
  }

  function toggleSintoma(idSintoma) {
    if (sintomaJaFoiSelecionado(idSintoma)) {
      removerSintoma(idSintoma);
      return;
    }

    adicionarSintoma(idSintoma);
  }

  return (
    <div className="lista-sintomas-container">
      <div className="lista-sintomas">
        {sintomas.map(function (sintoma) {
          const selecionado = sintomaJaFoiSelecionado(sintoma.id_sintoma);

          return (
            <label className="sintoma-item" key={sintoma.id_sintoma}>
              <input
                type="checkbox"
                checked={selecionado}
                onChange={() => toggleSintoma(sintoma.id_sintoma)}
              />

              <span>{sintoma.descricao}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default ListaSintomas;
