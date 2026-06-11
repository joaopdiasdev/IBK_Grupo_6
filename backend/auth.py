import os
from functools import wraps

from flask import current_app, g, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from status_http import STATUS_ACESSO_NEGADO, STATUS_NAO_AUTORIZADO


TOKEN_SALT = "ibk-auth"
TOKEN_DURACAO_SEGUNDOS = 60 * 60 * 8


def _criar_serializador():
    chave_secreta = current_app.config["SECRET_KEY"]

    serializador = URLSafeTimedSerializer(
        secret_key=chave_secreta,
        salt=TOKEN_SALT
    )

    return serializador


def _extrair_token_do_header():
    auth_header = request.headers.get("Authorization", "")

    if auth_header == "":
        return None

    partes_do_header = auth_header.split(" ", 1)

    if len(partes_do_header) != 2:
        return None

    tipo_autorizacao = partes_do_header[0]
    token = partes_do_header[1].strip()

    if tipo_autorizacao != "Bearer":
        return None

    if token == "":
        return None

    return token


def gerar_token(usuario):
    # O token guarda so o essencial para o backend saber quem esta logado.
    serializador = _criar_serializador()

    dados_do_token = {
        "id_pessoa": usuario["id_pessoa"],
        "is_admin": usuario["is_admin"],
        "id_profissional": usuario.get("id_profissional")
    }

    token = serializador.dumps(dados_do_token)
    return token


def obter_usuario_autenticado():
    if not hasattr(g, "current_user"):
        return None

    return g.current_user


def autenticar_requisicao(admin_only=False):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(*args, **kwargs):
            token = _extrair_token_do_header()

            if token is None:
                return jsonify({"erro": "Autenticacao obrigatoria"}), STATUS_NAO_AUTORIZADO

            try:
                serializador = _criar_serializador()
                usuario_do_token = serializador.loads(
                    token,
                    max_age=TOKEN_DURACAO_SEGUNDOS
                )
            except SignatureExpired:
                return jsonify({"erro": "Sessao expirada"}), STATUS_NAO_AUTORIZADO
            except BadSignature:
                return jsonify({"erro": "Token invalido"}), STATUS_NAO_AUTORIZADO

            g.current_user = usuario_do_token

            if admin_only:
                is_admin = g.current_user.get("is_admin")

                if is_admin != 1:
                    return jsonify({"erro": "Acesso restrito a administradores"}), STATUS_ACESSO_NEGADO

            return view_func(*args, **kwargs)

        return wrapper

    return decorator


def configurar_chave_secreta(app):
    # Em producao, o ideal e definir IBK_SECRET_KEY no ambiente.
    chave_secreta = os.getenv(
        "IBK_SECRET_KEY",
        "ibk-dev-secret-key"
    )

    app.config["SECRET_KEY"] = chave_secreta
