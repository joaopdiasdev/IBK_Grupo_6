from flask import Blueprint, send_file
from dataBase.conexao import conectar_banco
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
import io, os

relatorio_bp = Blueprint("relatorio", __name__)

@relatorio_bp.route("/relatorio/<int:id_triagem>")
def gerar_relatorio(id_triagem):

    # Busca os dados no banco
    conn = conectar_banco()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT t.*, pe.nome, p.data_nascimento, p.genero, p.nome_responsavel
        FROM Triagem t
        JOIN Paciente p ON t.id_paciente_FK = p.id_paciente
        LEFT JOIN Pessoa pe ON p.id_pessoa_FK = pe.id_pessoa
        WHERE t.id_triagem = %s
    """, (id_triagem,))
    triagem = cur.fetchone()

    cur.execute("""
        SELECT s.descricao FROM Resposta_Sintoma rs
        JOIN Sintoma s ON rs.id_sintoma_FK = s.id_sintoma
        WHERE rs.id_triagem_FK = %s
    """, (id_triagem,))
    sintomas = cur.fetchall()
    cur.close()
    conn.close()

    if not triagem:
        return {"erro": "Triagem não encontrada"}, 404

    # Monta o PDF
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm)

    estilos = getSampleStyleSheet()
    titulo = estilos["Title"]
    normal = estilos["Normal"]

    enc = triagem.get("recomendacao") == "ENCAMINHAR_TESTE_GENETICO"
    recomendacao = "Encaminhar para teste genético" if enc else "Não encaminhar"

    # Caminho da logo
    logo_path = os.path.normpath(os.path.join(
        os.path.dirname(__file__), "..", "..", "frontend", "src", "assets", "LOGO_IBK.png"
    ))

    conteudo = []

    # Adiciona a logo se existir
    if os.path.exists(logo_path):
        conteudo.append(Image(logo_path, width=3*cm, height=1.2*cm))
        conteudo.append(Spacer(1, 8))

    conteudo += [
        Paragraph(f"Relatório de Triagem #{id_triagem:04d}", titulo),
        Spacer(1, 12),
        Paragraph(f"<b>Paciente:</b> {triagem.get('nome') or '—'}", normal),
        Paragraph(f"<b>Nascimento:</b> {triagem.get('data_nascimento') or '—'}", normal),
        Paragraph(f"<b>Gênero:</b> {(triagem.get('genero') or '—').replace('_', ' ').title()}", normal),
        Paragraph(f"<b>Responsável:</b> {triagem.get('nome_responsavel') or '—'}", normal),
        Spacer(1, 12),
        Paragraph(f"<b>Score:</b> {float(triagem.get('score_triagem') or 0):.2f}", normal),
        Paragraph(f"<b>Recomendação:</b> {recomendacao}", normal),
        Spacer(1, 12),
        Paragraph("<b>Sintomas presentes:</b>", normal),
    ]

    for s in sintomas:
        conteudo.append(Paragraph(f"• {s['descricao']}", normal))

    if triagem.get("observacoes"):
        conteudo.append(Spacer(1, 12))
        conteudo.append(Paragraph(f"<b>Observações:</b> {triagem['observacoes']}", normal))

    doc.build(conteudo)
    buf.seek(0)

    return send_file(buf, mimetype="application/pdf",
        download_name=f"relatorio_{id_triagem:04d}.pdf",
        as_attachment=False)