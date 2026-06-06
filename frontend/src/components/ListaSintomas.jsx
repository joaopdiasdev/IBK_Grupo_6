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
    <div>

      <h3>Sintomas</h3>

      {sintomas.map(sintoma => (

        <div key={sintoma.id_sintoma}>

          <input
            type="checkbox"
            checked={
              sintomasSelecionados.includes(
                sintoma.id_sintoma
              )
            }
            onChange={() =>
              toggleSintoma(
                sintoma.id_sintoma
              )
            }
          />

          {sintoma.descricao}

        </div>

      ))}

    </div>
  );
}

export default ListaSintomas;