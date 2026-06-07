from flask import Blueprint, jsonify, request
from models.profissional_model import cadastrar_profissional

# mudança geral para o projeto ficar mais organizado utilizando MVC
from models.sintoma_model import buscar_todos_sintomas
from models.paciente_model import (
    buscar_todos_pacientes,
    cadastrar_paciente
)

from models.triagem_model import (
    buscar_todas_triagens,
    calcular_score_triagem,
    gerar_recomendacao,
    salvar_triagem,
    buscar_triagem_por_id,
    buscar_historico_triagens
)

from models.pessoa_model import buscar_todas_pessoas

# vai guardar agr as rotas, não é mais o app
rotas = Blueprint("rotas", __name__)


@rotas.route("/")
def index():
    return jsonify({"status": "Backend rodando"})


@rotas.route("/sintomas")
def listar_sintomas():
    resultado = buscar_todos_sintomas()
    return jsonify(resultado)


@rotas.route("/pacientes")
def listar_pacientes():
    resultado = buscar_todos_pacientes()
    return jsonify(resultado)

@rotas.route("/pessoas")
def listar_pessoas():
    resultado = buscar_todas_pessoas()
    return jsonify(resultado)



@rotas.route("/triagens")
def listar_triagens():
    resultado = buscar_historico_triagens()
    return jsonify(resultado)

@rotas.route("/triagens/calcular", methods=["POST"])
def calcular_triagem():
    dados = request.get_json()

    sexo = dados["sexo_referencia_clinica"]
    sintomas = dados["sintomas"]

    score = calcular_score_triagem(sexo, sintomas)
    recomendacao = gerar_recomendacao(score)

    return jsonify({
        "score": score,
        "recomendacao": recomendacao
    })

@rotas.route("/triagens/<int:id_triagem>")
def buscar_triagem(id_triagem):

    resultado = buscar_triagem_por_id(id_triagem)

    if resultado is None:
        return jsonify({
            "erro": "Triagem não encontrada"
        }), 404

    return jsonify(resultado)

@rotas.route("/triagens", methods=["POST"])
def criar_triagem():

    dados = request.get_json()

    paciente = dados["paciente"]

    if not paciente.get("nome"):
        return jsonify({
            "erro": "Nome é obrigatório"
        }), 400

    sintomas = dados["sintomas"]
    observacoes = dados.get("observacoes", "")


    id_paciente = cadastrar_paciente(
        paciente["nome"],
        paciente["email"],
        paciente.get("senha", "123456"),
        paciente["genero"],
        paciente["sexo_referencia_clinica"],
        paciente["data_nascimento"],
        paciente.get("nome_responsavel")
    )

    score = calcular_score_triagem(
        paciente["sexo_referencia_clinica"],
        sintomas
    )

    recomendacao = gerar_recomendacao(score)

    id_triagem = salvar_triagem(
        id_paciente,
        observacoes,
        paciente["sexo_referencia_clinica"],
        score,
        recomendacao,
        sintomas
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

    email = dados.get("email")
    senha = dados.get("senha")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    from dataBase.conexao import conectar_banco

    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("""
        SELECT id_pessoa, nome, email, is_admin
        FROM Pessoa
        WHERE email = %s AND senha = %s
    """, (email, senha))

    usuario = cursor.fetchone()

    cursor.close()
    conexao.close()

    if usuario is None:
        return jsonify({"erro": "Credenciais inválidas"}), 401

    return jsonify({
        "mensagem": "Login realizado com sucesso",
        "usuario": usuario
    })
@rotas.route("/profissionais", methods=["POST"])
def criar_profissional():
    dados = request.get_json()

    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")
    especialidade = dados.get("especialidade")

    if not nome or not email or not senha or not especialidade:
        return jsonify({"erro": "Todos os campos são obrigatórios"}), 400

    id_profissional = cadastrar_profissional(
        nome,
        email,
        senha,
        especialidade
    )

    return jsonify({
        "mensagem": "Profissional cadastrado com sucesso",
        "id_profissional": id_profissional
    })