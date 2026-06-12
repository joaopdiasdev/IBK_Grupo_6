from dataBase.conexao import conectar_banco
from werkzeug.security import generate_password_hash


def buscar_todos_profissionais():
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            ps.id_profissional,
            ps.especialidade,
            p.id_pessoa,
            p.nome,
            p.email,
            p.is_admin
        FROM Profissional_Saude ps
        JOIN Pessoa p ON ps.id_pessoa_FK = p.id_pessoa
        ORDER BY p.nome
    """)

    profissionais = cursor.fetchall()

    cursor.close()
    conexao.close()

    return profissionais


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
