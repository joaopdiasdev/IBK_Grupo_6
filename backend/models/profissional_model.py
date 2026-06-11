from dataBase.conexao import conectar_banco
from werkzeug.security import generate_password_hash

def cadastrar_profissional(nome, email, senha, especialidade):
    conexao = conectar_banco()
    cursor = conexao.cursor()

    senha_hash = generate_password_hash(senha)

    cursor.execute("""
        INSERT INTO Pessoa (nome, email, senha, is_admin)
        VALUES (%s, %s, %s, 1)
        """, (nome, email, senha_hash))

    id_pessoa = cursor.lastrowid

    cursor.execute("""
        INSERT INTO Profissional_Saude (
            especialidade,
            id_pessoa_FK
        )
        VALUES (%s, %s)
    """, (especialidade, id_pessoa))

    id_profissional = cursor.lastrowid

    conexao.commit()

    cursor.close()
    conexao.close()

    return id_profissional
