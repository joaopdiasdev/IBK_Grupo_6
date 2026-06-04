from flask import Blueprint, jsonify, request

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
    salvar_triagem
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


@rotas.route("/triagens")
def listar_triagens():
    resultado = buscar_todas_triagens()
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


@rotas.route("/pessoas")
def listar_pessoas():
    resultado = buscar_todas_pessoas()
    return jsonify(resultado)

@rotas.route("/triagens", methods=["POST"])
def criar_triagem():
    dados = request.get_json()

    paciente = dados["paciente"]
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