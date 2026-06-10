function BotaoRelatorio({ idTriagem }) {
  return (
    <button 
    className="btn-relatorio"
    onClick={() => 
      window.open(`http://127.0.0.1:5000/relatorio/${idTriagem}`, "_blank")}>
      Gerar PDF
    </button>
  );
}

export default BotaoRelatorio;