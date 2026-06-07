from dataBase.conexao import conectar_banco

def buscar_todos_pacientes():
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            p.id_paciente,
            pe.nome,
            pe.email,
            p.genero,
            p.sexo_referencia_clinica,
            p.data_nascimento,
            p.nome_responsavel
        FROM Paciente p
        JOIN Pessoa pe
            ON p.id_pessoa_FK = pe.id_pessoa
        ORDER BY pe.nome
    """)

    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return resultado

from dataBase.conexao import conectar_banco


def cadastrar_paciente(nome, email, senha, genero, sexo_referencia_clinica, data_nascimento, nome_responsavel):
    conexao = conectar_banco()
    cursor = conexao.cursor()

    sql_pessoa = """
        INSERT INTO Pessoa (nome, email, senha, is_admin)
        VALUES (%s, %s, %s, 0)
    """

    valores_pessoa = (nome, email, senha)

    cursor.execute(sql_pessoa, valores_pessoa)

    id_pessoa = cursor.lastrowid

    sql_paciente = """
        INSERT INTO Paciente (
            id_pessoa_FK,
            genero,
            sexo_referencia_clinica,
            data_nascimento,
            nome_responsavel
        )
        VALUES (%s, %s, %s, %s, %s)
    """

    valores_paciente = (
        id_pessoa,
        genero,
        sexo_referencia_clinica,
        data_nascimento,
        nome_responsavel
    )

    cursor.execute(sql_paciente, valores_paciente)

    id_paciente = cursor.lastrowid

    conexao.commit()

    cursor.close()
    conexao.close()

    return id_paciente
