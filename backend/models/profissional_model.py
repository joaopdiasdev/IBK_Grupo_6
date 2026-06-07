from dataBase.conexao import conectar_banco

def cadastrar_profissional(nome, email, senha, especialidade):
    conexao = conectar_banco()
    cursor = conexao.cursor()

    cursor.execute("""
        INSERT INTO Pessoa (nome, email, senha, is_admin)
        VALUES (%s, %s, %s, 1)
    """, (nome, email, senha))

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