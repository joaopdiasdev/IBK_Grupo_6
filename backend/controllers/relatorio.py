from flask import Blueprint, send_file
from dataBase.conexao import conectar_banco
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image, KeepTogether
import io, os
from datetime import datetime

relatorio_bp = Blueprint("relatorio", __name__)

AZUL   = colors.HexColor("#2c2f6b")
LILAS  = colors.HexColor("#f4f4fb")
LINHA  = colors.HexColor("#d8daf0")
CINZA  = colors.HexColor("#666666")
PRETO  = colors.HexColor("#1a1a1a")
BRANCO = colors.white
VERM   = colors.HexColor("#b03030")
VERDE  = colors.HexColor("#1e6e42")
PAGE_W, PAGE_H = A4
L = 16.6*cm

def rodape(c, doc):
    c.saveState()
    c.setStrokeColor(LINHA)
    c.setLineWidth(0.4)
    c.line(2.2*cm, 1.7*cm, PAGE_W - 2.2*cm, 1.7*cm)
    c.setFont("Helvetica", 7)
    c.setFillColor(colors.HexColor("#aaaaaa"))
    c.drawString(2.2*cm, 1.2*cm, "Instituto Buko Kaesemodel  —  Documento clínico confidencial")
    c.drawRightString(PAGE_W - 2.2*cm, 1.2*cm, f"Página {doc.page}")
    c.restoreState()

def buscar_dados_triagem(id_triagem):
    conn = conectar_banco()
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT t.*, p.data_nascimento, p.genero, p.sexo_referencia_clinica, p.nome_responsavel,
               pe.nome AS nome_paciente, pe.email AS email_paciente
        FROM Triagem t
        JOIN Paciente p ON t.id_paciente_FK = p.id_paciente
        LEFT JOIN Pessoa pe ON p.id_pessoa_FK = pe.id_pessoa
        WHERE t.id_triagem = %s
    """, (id_triagem,))
    triagem = cur.fetchone()
    cur.execute("""
        SELECT s.descricao, rs.resposta FROM Resposta_Sintoma rs
        JOIN Sintoma s ON rs.id_sintoma_FK = s.id_sintoma
        WHERE rs.id_triagem_FK = %s ORDER BY rs.resposta DESC
    """, (id_triagem,))
    sintomas = cur.fetchall()
    cur.close(); conn.close()
    return triagem, sintomas

def st(**kw):
    return ParagraphStyle("_", **kw)

@relatorio_bp.route("/relatorio/<int:id_triagem>")
def gerar_relatorio(id_triagem):
    triagem, sintomas = buscar_dados_triagem(id_triagem)
    if not triagem:
        return {"erro": "Triagem não encontrada"}, 404

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
        rightMargin=2.2*cm, leftMargin=2.2*cm,
        topMargin=2*cm, bottomMargin=2.5*cm)
    story = []

    logo_path = os.path.normpath(os.path.join(
        os.path.dirname(__file__), "..", "..", "frontend", "src", "assets", "LOGO_IBK.png"))

    # ── Cabeçalho ────────────────────────────────────
    data_tr  = triagem.get("data_triagem")
    data_fmt = data_tr.strftime("%d de %B de %Y") if hasattr(data_tr, "strftime") else str(data_tr)

    logo = Image(logo_path, width=3.5*cm, height=1.4*cm) if os.path.exists(logo_path) else \
           Paragraph("Instituto Buko\nKaesemodel", st(fontName="Helvetica-Bold", fontSize=9, textColor=AZUL))

    cab = Table([[
        logo,
        [Paragraph("Instituto Buko Kaesemodel", st(fontName="Helvetica-Bold", fontSize=9, textColor=AZUL, spaceAfter=1)),
         Paragraph("Genética Clínica e Triagem Populacional", st(fontName="Helvetica", fontSize=7.5, textColor=CINZA, spaceAfter=1)),
         Paragraph("contato@institutobk.org.br  |  https://institutobk.org.br/", st(fontName="Helvetica", fontSize=7.5, textColor=CINZA))],
        Paragraph("Curitiba — PR", st(fontName="Helvetica", fontSize=8, textColor=CINZA, alignment=TA_RIGHT)),
    ]], colWidths=[4*cm, 9*cm, 3.6*cm])
    cab.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"MIDDLE"),("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    story.append(cab)
    story.append(Spacer(1,6))
    story.append(HRFlowable(width="100%", thickness=2, color=AZUL, spaceAfter=2))
    story.append(HRFlowable(width="100%", thickness=0.4, color=LINHA, spaceAfter=10))

    # ── Dados principais ─────────────────────────────
    nome      = triagem.get("nome_paciente") or "Não identificado"
    nasc      = str(triagem.get("data_nascimento") or "—")
    genero    = (triagem.get("genero") or "—").replace("_"," ").title()
    resp      = triagem.get("nome_responsavel") or "—"
    sexo_calc = "masculino" if triagem.get("sexo_referencia_calculo") == "M" else "feminino"
    score     = float(triagem.get("score_triagem") or 0)
    rec       = triagem.get("recomendacao") or ""
    encaminhar= rec == "ENCAMINHAR_TESTE_GENETICO"
    rec_txt   = "ENCAMINHAR PARA TESTE GENÉTICO MOLECULAR" if encaminhar else "NÃO ENCAMINHAR"
    rec_cor   = VERM if encaminhar else VERDE
    obs       = triagem.get("observacoes") or ""

    corpo = st(fontName="Helvetica", fontSize=9, textColor=PRETO, leading=14, alignment=TA_JUSTIFY, spaceAfter=8)

    story.append(Paragraph(f"<b>Ref.:</b> Triagem Clínica Nº {id_triagem:04d}  &nbsp;|&nbsp;  <b>Assunto:</b> Resultado de Triagem — Síndrome do X Frágil (SXF)",
        st(fontName="Helvetica", fontSize=8, textColor=CINZA, spaceAfter=10)))
    story.append(Paragraph("Prezado(a) Profissional de Saúde,", corpo))
    story.append(Paragraph(
        f"Encaminhamos o resultado da triagem clínica para rastreamento da <b>Síndrome do X Frágil (SXF)</b>, "
        f"realizada pelo Instituto Buko Kaesemodel conforme os protocolos vigentes.", corpo))

    # Paciente
    def secao(titulo):
        return KeepTogether([
            Paragraph(titulo, st(fontName="Helvetica-Bold", fontSize=9, textColor=AZUL, spaceBefore=6, spaceAfter=4)),
            HRFlowable(width="100%", thickness=0.4, color=LINHA, spaceAfter=5),
        ])

    story.append(secao("1. Identificação do Paciente"))

    def cell(txt, bold=False):
        return Paragraph(txt, st(fontName="Helvetica-Bold" if bold else "Helvetica",
                                  fontSize=8.5, textColor=CINZA if bold else PRETO))

    id_t = Table([
        [cell("Nome:", True), cell(nome), cell("Nascimento:", True), cell(nasc)],
        [cell("Gênero:", True), cell(genero), cell("Responsável:", True), cell(resp)],
    ], colWidths=[3*cm, 5.3*cm, 3*cm, 5.3*cm])
    id_t.setStyle(TableStyle([
        ("ROWBACKGROUNDS",(0,0),(-1,-1),[LILAS,BRANCO]),
        ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("LEFTPADDING",(0,0),(-1,-1),8),("LINEBELOW",(0,0),(-1,-2),0.3,LINHA),
    ]))
    story.append(id_t)
    story.append(Spacer(1,8))

    # Resultado
    story.append(secao("2. Resultado da Triagem"))
    story.append(Paragraph(
        f"A triagem utilizou referência clínica para o sexo <b>{sexo_calc}</b>, "
        f"com base no dicionário de pesos validado pela literatura. Score obtido: <b>{score:.2f}</b>.", corpo))

    rec_t = Table([[
        Paragraph("RECOMENDAÇÃO:", st(fontName="Helvetica-Bold", fontSize=7.5, textColor=CINZA)),
        Paragraph(rec_txt, st(fontName="Helvetica-Bold", fontSize=10, textColor=AZUL)),
    ]], colWidths=[3.8*cm, 12.8*cm])
    rec_t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),LILAS),
        ("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9),
        ("LEFTPADDING",(0,0),(-1,-1),12),
        ("LINEBEFORE",(0,0),(0,-1),3,AZUL),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ]))
    story.append(rec_t)
    story.append(Spacer(1,8))

    # Sintomas
    story.append(secao("3. Critérios Clínicos Avaliados"))
    sint_rows = [[
        Paragraph("Critério Clínico", st(fontName="Helvetica-Bold", fontSize=8, textColor=BRANCO)),
        Paragraph("Resultado", st(fontName="Helvetica-Bold", fontSize=8, textColor=BRANCO)),
    ]]
    for i, si in enumerate(sintomas):
        presente = si["resposta"] == 1
        sint_rows.append([
            Paragraph(si["descricao"], st(fontName="Helvetica", fontSize=8, textColor=PRETO)),
            Paragraph("Presente" if presente else "Ausente",
                st(fontName="Helvetica-Bold" if presente else "Helvetica",
                   fontSize=8, textColor=VERM if presente else VERDE)),
        ])
    bg = [LILAS if i % 2 == 0 else BRANCO for i in range(len(sint_rows)-1)]
    st_t = Table(sint_rows, colWidths=[13.3*cm, 3.3*cm])
    st_t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),AZUL),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),bg),
        ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("LEFTPADDING",(0,0),(-1,-1),8),
        ("LINEBELOW",(0,1),(-1,-2),0.3,LINHA),
        ("ALIGN",(1,0),(1,-1),"CENTER"),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ]))
    story.append(st_t)

    if obs:
        story.append(Spacer(1,8))
        story.append(secao("4. Observações Clínicas"))
        ot = Table([[Paragraph(obs, st(fontName="Helvetica-Oblique", fontSize=8.5, textColor=CINZA, leading=13))]], colWidths=[L])
        ot.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(-1,-1),LILAS),
            ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
            ("LEFTPADDING",(0,0),(-1,-1),12),("LINEBEFORE",(0,0),(0,-1),3,AZUL),
        ]))
        story.append(ot)

    story.append(Spacer(1,10))
    story.append(Paragraph("Permanecemos à disposição para esclarecimentos adicionais.", corpo))
    story.append(Paragraph("Atenciosamente,", st(fontName="Helvetica", fontSize=9, textColor=PRETO, spaceAfter=6)))
    story.append(Paragraph(f"Instituto Buko Kaesemodel  —  Documento Nº {id_triagem:04d}",
        st(fontName="Helvetica", fontSize=8, textColor=CINZA)))
    story.append(Spacer(1,14))
    story.append(HRFlowable(width="100%", thickness=0.4, color=LINHA, spaceAfter=4))
    story.append(Paragraph(
        "Este documento é um instrumento de triagem clínica e não substitui diagnóstico médico. "
        "O diagnóstico definitivo requer confirmação por exame genético molecular (PCR e/ou Southern Blotting).",
        st(fontName="Helvetica-Oblique", fontSize=7, textColor=colors.HexColor("#aaaaaa"), alignment=TA_CENTER)))

    doc.build(story, onFirstPage=rodape, onLaterPages=rodape)
    buf.seek(0)
    return send_file(buf, mimetype="application/pdf",
                     download_name=f"relatorio_triagem_{id_triagem:04d}.pdf",
                     as_attachment=False)