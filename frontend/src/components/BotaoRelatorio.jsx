function BotaoRelatorio({ idTriagem }) {
  return (
    <button onClick={() => window.open(`http://127.0.0.1:5000/relatorio/${idTriagem}`, "_blank")}>
      Ver PDF
    </button>
  );
}

export default BotaoRelatorio;
