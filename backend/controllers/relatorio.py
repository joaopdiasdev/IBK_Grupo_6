import io
import os

from flask import Blueprint, send_file
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Image, Paragraph, SimpleDocTemplate, Spacer

from auth import autenticar_requisicao, obter_usuario_autenticado
from dataBase.conexao import conectar_banco
from models.triagem_model import usuario_pode_acessar_triagem
from status_http import STATUS_ACESSO_NEGADO, STATUS_NAO_ENCONTRADO


relatorio_bp = Blueprint("relatorio", __name__)


@relatorio_bp.route("/relatorio/<int:id_triagem>")
@autenticar_requisicao()
def gerar_relatorio(id_triagem):
    usuario = obter_usuario_autenticado()

    if not usuario_pode_acessar_triagem(id_triagem, usuario):
        return {"erro": "Acesso negado"}, STATUS_ACESSO_NEGADO

    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("""
        SELECT t.*, pe.nome, p.data_nascimento, p.genero, p.nome_responsavel
        FROM Triagem t
        JOIN Paciente p ON t.id_paciente_FK = p.id_paciente
        LEFT JOIN Pessoa pe ON p.id_pessoa_FK = pe.id_pessoa
        WHERE t.id_triagem = %s
    """, (id_triagem,))
    triagem = cursor.fetchone()

    cursor.execute("""
        SELECT s.descricao
        FROM Resposta_Sintoma rs
        JOIN Sintoma s ON rs.id_sintoma_FK = s.id_sintoma
        WHERE rs.id_triagem_FK = %s
    """, (id_triagem,))
    sintomas = cursor.fetchall()

    cursor.close()
    conexao.close()

    if not triagem:
        return {"erro": "Triagem nao encontrada"}, STATUS_NAO_ENCONTRADO

    arquivo_pdf = io.BytesIO()
    documento = SimpleDocTemplate(
        arquivo_pdf,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm
    )

    estilos = getSampleStyleSheet()
    titulo = estilos["Title"]
    normal = estilos["Normal"]

    deve_encaminhar = triagem.get("recomendacao") == "ENCAMINHAR_TESTE_GENETICO"
    recomendacao = "Encaminhar para teste genetico" if deve_encaminhar else "Nao encaminhar"

    logo_path = os.path.normpath(os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "frontend",
        "src",
        "assets",
        "LOGO_IBK.png"
    ))

    conteudo = []

    if os.path.exists(logo_path):
        conteudo.append(Image(logo_path, width=3 * cm, height=1.2 * cm))
        conteudo.append(Spacer(1, 8))

    conteudo.extend([
        Paragraph(f"Relatorio de Triagem #{id_triagem:04d}", titulo),
        Spacer(1, 12),
        Paragraph(f"<b>Paciente:</b> {triagem.get('nome') or '-'}", normal),
        Paragraph(f"<b>Nascimento:</b> {triagem.get('data_nascimento') or '-'}", normal),
        Paragraph(
            f"<b>Genero:</b> {(triagem.get('genero') or '-').replace('_', ' ').title()}",
            normal
        ),
        Paragraph(f"<b>Responsavel:</b> {triagem.get('nome_responsavel') or '-'}", normal),
        Spacer(1, 12),
        Paragraph(f"<b>Score:</b> {float(triagem.get('score_triagem') or 0):.2f}", normal),
        Paragraph(f"<b>Recomendacao:</b> {recomendacao}", normal),
        Spacer(1, 12),
        Paragraph("<b>Sintomas presentes:</b>", normal),
    ])

    for sintoma in sintomas:
        conteudo.append(Paragraph(f"- {sintoma['descricao']}", normal))

    if triagem.get("observacoes"):
        conteudo.append(Spacer(1, 12))
        conteudo.append(Paragraph(f"<b>Observacoes:</b> {triagem['observacoes']}", normal))

    documento.build(conteudo)
    arquivo_pdf.seek(0)

    return send_file(
        arquivo_pdf,
        mimetype="application/pdf",
        download_name=f"relatorio_{id_triagem:04d}.pdf",
        as_attachment=False
    )
