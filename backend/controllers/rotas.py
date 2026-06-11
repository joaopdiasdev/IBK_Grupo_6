from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from auth import autenticar_requisicao, gerar_token, obter_usuario_autenticado
from models.paciente_model import buscar_todos_pacientes, cadastrar_paciente
from models.pessoa_model import buscar_todas_pessoas
from models.profissional_model import cadastrar_profissional
from models.sintoma_model import buscar_todos_sintomas
from models.triagem_model import (
    buscar_historico_triagens,
    buscar_triagem_por_id,
    calcular_score_triagem,
    gerar_recomendacao,
    salvar_triagem,
    usuario_pode_acessar_triagem,
    vincular_profissional_triagem,
)
from status_http import (
    STATUS_ACESSO_NEGADO,
    STATUS_CONFLITO,
    STATUS_NAO_AUTORIZADO,
    STATUS_NAO_ENCONTRADO,
    STATUS_REQUISICAO_INVALIDA,
)


rotas = Blueprint("rotas", __name__)


def _usuario_tem_acesso_clinico(usuario):
    return usuario.get("is_admin") == 1 or bool(usuario.get("id_profissional"))


def _resposta_acesso_clinico_negado():
    return jsonify({"erro": "Acesso restrito a profissionais e administradores"}), STATUS_ACESSO_NEGADO


def _buscar_campos_paciente_faltando(paciente):
    campos_obrigatorios = [
        "nome",
        "email",
        "genero",
        "sexo_referencia_clinica",
        "data_nascimento",
    ]

    campos_faltando = []

    for campo in campos_obrigatorios:
        if not paciente.get(campo):
            campos_faltando.append(campo)

    return campos_faltando


def _senha_esta_em_hash(senha_salva):
    return senha_salva.startswith(("pbkdf2:", "scrypt:"))


def _validar_senha_login(cursor, conexao, usuario, senha_digitada):
    senha_salva = usuario["senha"] or ""

    if _senha_esta_em_hash(senha_salva):
        return check_password_hash(senha_salva, senha_digitada)

    if senha_salva != senha_digitada:
        return False

    # Atualiza senhas antigas em texto puro para hash moderno.
    nova_senha_hash = generate_password_hash(senha_digitada)
    cursor.execute("""
        UPDATE Pessoa
        SET senha = %s
        WHERE id_pessoa = %s
    """, (nova_senha_hash, usuario["id_pessoa"]))
    conexao.commit()
    return True


@rotas.route("/")
def index():
    return jsonify({"status": "Backend rodando"})


@rotas.route("/sintomas")
@autenticar_requisicao()
def listar_sintomas():
    resultado = buscar_todos_sintomas()
    return jsonify(resultado)


@rotas.route("/pacientes")
@autenticar_requisicao()
def listar_pacientes():
    usuario = obter_usuario_autenticado()

    if not _usuario_tem_acesso_clinico(usuario):
        return _resposta_acesso_clinico_negado()

    resultado = buscar_todos_pacientes(
        usuario.get("id_profissional"),
        usuario.get("is_admin", 0)
    )
    return jsonify(resultado)


@rotas.route("/pessoas")
@autenticar_requisicao(admin_only=True)
def listar_pessoas():
    resultado = buscar_todas_pessoas()
    return jsonify(resultado)


@rotas.route("/triagens")
@autenticar_requisicao()
def listar_triagens():
    usuario = obter_usuario_autenticado()

    if not _usuario_tem_acesso_clinico(usuario):
        return _resposta_acesso_clinico_negado()

    resultado = buscar_historico_triagens(
        usuario.get("id_profissional"),
        usuario.get("is_admin", 0)
    )

    return jsonify(resultado)


@rotas.route("/triagens/calcular", methods=["POST"])
@autenticar_requisicao()
def calcular_triagem():
    dados = request.get_json()

    if dados is None:
        dados = {}

    sexo = dados.get("sexo_referencia_clinica")
    sintomas = dados.get("sintomas", [])

    if sexo != "M" and sexo != "F":
        return jsonify({"erro": "Sexo de referencia clinica invalido"}), STATUS_REQUISICAO_INVALIDA

    score = calcular_score_triagem(sexo, sintomas)
    recomendacao = gerar_recomendacao(score, sexo)

    return jsonify({
        "score": score,
        "recomendacao": recomendacao
    })


@rotas.route("/triagens/<int:id_triagem>")
@autenticar_requisicao()
def buscar_triagem(id_triagem):
    usuario = obter_usuario_autenticado()

    if not usuario_pode_acessar_triagem(id_triagem, usuario):
        return jsonify({"erro": "Acesso negado"}), STATUS_ACESSO_NEGADO

    resultado = buscar_triagem_por_id(id_triagem)

    if resultado is None:
        return jsonify({"erro": "Triagem nao encontrada"}), STATUS_NAO_ENCONTRADO

    return jsonify(resultado)


@rotas.route("/triagens", methods=["POST"])
@autenticar_requisicao()
def criar_triagem():
    usuario = obter_usuario_autenticado()

    if not _usuario_tem_acesso_clinico(usuario):
        return _resposta_acesso_clinico_negado()

    dados = request.get_json()

    if dados is None:
        dados = {}

    paciente = dados.get("paciente")

    if paciente is None:
        paciente = {}

    campos_faltando = _buscar_campos_paciente_faltando(paciente)

    if campos_faltando:
        return jsonify({
            "erro": "Campos obrigatorios ausentes",
            "campos": campos_faltando
        }), STATUS_REQUISICAO_INVALIDA

    sintomas = dados.get("sintomas", [])
    observacoes = dados.get("observacoes", "")

    resultado_cadastro_paciente = cadastrar_paciente(
        paciente["nome"],
        paciente["email"],
        paciente.get("senha", "123456"),
        paciente["genero"],
        paciente["sexo_referencia_clinica"],
        paciente["data_nascimento"],
        paciente.get("nome_responsavel")
    )

    if resultado_cadastro_paciente["sucesso"] is False:
        return jsonify({"erro": resultado_cadastro_paciente["erro"]}), STATUS_CONFLITO

    id_paciente = resultado_cadastro_paciente["id_paciente"]

    score = calcular_score_triagem(
        paciente["sexo_referencia_clinica"],
        sintomas
    )

    recomendacao = gerar_recomendacao(
        score,
        paciente["sexo_referencia_clinica"]
    )

    id_triagem = salvar_triagem(
        id_paciente,
        observacoes,
        paciente["sexo_referencia_clinica"],
        score,
        recomendacao,
        sintomas
    )

    if usuario.get("id_profissional"):
        vincular_profissional_triagem(
            id_triagem,
            usuario["id_profissional"]
        )

    return jsonify({
        "mensagem": "Triagem cadastrada com sucesso",
        "id_paciente": id_paciente,
        "id_triagem": id_triagem,
        "score": score,
        "recomendacao": recomendacao
    })


@rotas.route("/login", methods=["POST"])
def login():
    dados = request.get_json()

    if dados is None:
        dados = {}

    email = dados.get("email")
    senha = dados.get("senha")

    if not email or not senha:
        return jsonify({"erro": "Email e senha sao obrigatorios"}), STATUS_REQUISICAO_INVALIDA

    from dataBase.conexao import conectar_banco

    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            p.id_pessoa,
            p.nome,
            p.email,
            p.senha,
            p.is_admin,
            ps.id_profissional,
            ps.especialidade
        FROM Pessoa p
        LEFT JOIN Profissional_Saude ps
            ON p.id_pessoa = ps.id_pessoa_FK
        WHERE p.email = %s
    """, (email,))

    usuario = cursor.fetchone()

    if usuario is None:
        cursor.close()
        conexao.close()
        return jsonify({"erro": "Credenciais invalidas"}), STATUS_NAO_AUTORIZADO

    senha_valida = _validar_senha_login(
        cursor,
        conexao,
        usuario,
        senha
    )

    cursor.close()
    conexao.close()

    if not senha_valida:
        return jsonify({"erro": "Credenciais invalidas"}), STATUS_NAO_AUTORIZADO

    usuario.pop("senha")

    return jsonify({
        "mensagem": "Login realizado com sucesso",
        "usuario": usuario,
        "token": gerar_token(usuario)
    })


@rotas.route("/profissionais", methods=["POST"])
@autenticar_requisicao(admin_only=True)
def criar_profissional():
    dados = request.get_json()

    if dados is None:
        dados = {}

    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")
    especialidade = dados.get("especialidade")

    if not nome or not email or not senha or not especialidade:
        return jsonify({"erro": "Todos os campos sao obrigatorios"}), STATUS_REQUISICAO_INVALIDA

    resultado_cadastro_profissional = cadastrar_profissional(
        nome,
        email,
        senha,
        especialidade
    )

    if resultado_cadastro_profissional["sucesso"] is False:
        return jsonify({"erro": resultado_cadastro_profissional["erro"]}), STATUS_CONFLITO

    id_profissional = resultado_cadastro_profissional["id_profissional"]

    return jsonify({
        "mensagem": "Profissional cadastrado com sucesso",
        "id_profissional": id_profissional
    })
