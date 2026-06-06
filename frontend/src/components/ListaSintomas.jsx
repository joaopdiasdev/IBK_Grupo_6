function ListaSintomas({
  sintomas = [],
  sintomasSelecionados,
  setSintomasSelecionados
}) {

  const toggleSintoma = (idSintoma) => {

    if (sintomasSelecionados.includes(idSintoma)) {

      setSintomasSelecionados(
        sintomasSelecionados.filter(id => id !== idSintoma)
      );

    } else {

      setSintomasSelecionados([
        ...sintomasSelecionados,
        idSintoma
      ]);

    }

  };

  return (
    <div className="lista-sintomas-container">
      <div className="lista-sintomas">
        {sintomas.map(sintoma => (
          <label className="sintoma-item" key={sintoma.id_sintoma}>
            <input
              type="checkbox"
              checked={sintomasSelecionados.includes(sintoma.id_sintoma)}
              onChange={() => toggleSintoma(sintoma.id_sintoma)}
            />

            <span>{sintoma.descricao}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default ListaSintomas;