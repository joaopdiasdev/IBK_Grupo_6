import api from "../services/api";

function BotaoRelatorio({ idTriagem }) {
  async function gerarPDF() {
    const aba = window.open("", "_blank");

    try {
      const { data } = await api.get(`/relatorio/${idTriagem}`, {
        responseType: "blob"
      });

      const pdf = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdf);

      if (aba) {
        aba.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (erro) {
      if (aba) {
        aba.close();
      }

      console.error("Erro ao gerar PDF:", erro);

      alert("Erro ao gerar PDF. Verifique se você está logado.");
    }
  }

  return (
    <button className="btn-relatorio" onClick={gerarPDF}>
      Gerar PDF
    </button>
  );
}

export default BotaoRelatorio;
