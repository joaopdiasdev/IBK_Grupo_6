export default function BotaoRelatorio({ idTriagem }) {
  const handleDownload = () => {
    window.open(`http://127.0.0.1:5000/relatorio/${idTriagem}`, "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        padding: "10px 20px",
        background: "#2c3462",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      Gerar Relatório PDF
    </button>
  );
}