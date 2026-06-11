from dataBase.conexao import conectar_banco
from werkzeug.security import generate_password_hash


def gerar_hash_da_senha(senha):
    return generate_password_hash(senha)


def cadastrar_profissional(nome, email, senha, especialidade):
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("""
        SELECT id_pessoa
        FROM Pessoa
        WHERE email = %s
    """, (email,))

    pessoa_existente = cursor.fetchone()

    if pessoa_existente:
        cursor.close()
        conexao.close()
        return {
            "sucesso": False,
            "erro": "Este email ja esta em uso"
        }

    senha_hash = gerar_hash_da_senha(senha)

    cursor.execute("""
        INSERT INTO Pessoa (nome, email, senha, is_admin)
        VALUES (%s, %s, %s, 1)
        """, (nome, email, senha_hash))

    # lastrowid guarda o id da pessoa que acabou de ser criada.
    id_pessoa_criada = cursor.lastrowid

    cursor.execute("""
        INSERT INTO Profissional_Saude (
            especialidade,
            id_pessoa_FK
        )
        VALUES (%s, %s)
    """, (especialidade, id_pessoa_criada))

    # lastrowid guarda o id do profissional criado agora.
    id_profissional_criado = cursor.lastrowid

    conexao.commit()

    cursor.close()
    conexao.close()

    return {
        "sucesso": True,
        "id_profissional": id_profissional_criado
    }
