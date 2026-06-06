import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import FormPaciente from "../components/FormPaciente";
import ListaSintomas from "../components/ListaSintomas";



function NovaTriagem() {

  const navigate = useNavigate();

  const [paciente, setPaciente] = useState({});

  const [sintomasSelecionados, setSintomasSelecionados] = useState([]);

  const [sintomas, setSintomas] = useState([]);
  useEffect(() => {

  async function carregarSintomas() {

    try {

      const resposta = await api.get("/sintomas");

      setSintomas(resposta.data);

    } catch (erro) {

      console.error("Erro ao buscar sintomas:", erro);

    }

  }

  carregarSintomas();

}, []);
  const salvarTriagem = async () => {
  try {
    const resposta = await api.post("/triagens", {
      paciente,
      sintomas: sintomasSelecionados,
      observacoes: ""
    });

    navigate("/resultado", {
      state: resposta.data
    });

  } catch (erro) {
    console.error("Erro:", erro);
  }
};

  return (
     <div>
    <h1>Nova Triagem</h1>

    <p>Quantidade: {sintomas.length}</p>

    <FormPaciente
      paciente={paciente}
      setPaciente={setPaciente}
    />

    <ListaSintomas
      sintomas={sintomas}
      sintomasSelecionados={sintomasSelecionados}
      setSintomasSelecionados={setSintomasSelecionados}
    />

    <p>
      Sintomas selecionados:
      {JSON.stringify(sintomasSelecionados)}
    </p>
    <button onClick={salvarTriagem}>
    Salvar Triagem
    </button>

  </div>
  );
}

export default NovaTriagem;