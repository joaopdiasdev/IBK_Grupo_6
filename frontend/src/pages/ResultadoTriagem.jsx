import { useLocation, Link } from "react-router-dom";

function ResultadoTriagem() {
  const location = useLocation();
  const resultado = location.state;

  if (!resultado) {
    return (
      <div>
        <h1>Nenhum resultado encontrado</h1>
        <Link to="/nova-triagem">Fazer nova triagem</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Resultado da Triagem</h1>

      <p>ID Paciente: {resultado.id_paciente}</p>
      <p>ID Triagem: {resultado.id_triagem}</p>
      <p>Score: {resultado.score}</p>
      <p>Recomendação: {resultado.recomendacao}</p>
      <p>{resultado.mensagem}</p>

      <Link to="/nova-triagem">Fazer nova triagem</Link>
    </div>
  );
}

export default ResultadoTriagem;