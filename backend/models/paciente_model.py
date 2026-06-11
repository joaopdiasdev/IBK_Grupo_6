from dataBase.conexao import conectar_banco
from werkzeug.security import generate_password_hash


def gerar_hash_da_senha(senha):
    return generate_password_hash(senha)


def buscar_todos_pacientes(id_profissional=None, is_admin=0):
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    if str(is_admin) == "1":
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
    else:
        cursor.execute("""
            SELECT DISTINCT
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
            JOIN Triagem t
                ON t.id_paciente_FK = p.id_paciente
            JOIN Triagem_Profissional tp
                ON tp.id_triagem_FK = t.id_triagem
            WHERE tp.id_profissional_FK = %s
            ORDER BY pe.nome
        """, (id_profissional,))

    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return resultado


def cadastrar_paciente(nome, email, senha, genero, sexo_referencia_clinica, data_nascimento, nome_responsavel):
    conexao = conectar_banco()
    cursor = conexao.cursor()

    cursor.execute("""
        SELECT
            p.id_pessoa,
            p.is_admin,
            pa.id_paciente
        FROM Pessoa p
        LEFT JOIN Paciente pa
            ON pa.id_pessoa_FK = p.id_pessoa
        WHERE p.email = %s
    """, (email,))

    pessoa_existente = cursor.fetchone()

    if pessoa_existente:
        id_pessoa = pessoa_existente[0]
        is_admin = pessoa_existente[1]
        id_paciente_existente = pessoa_existente[2]

        if id_paciente_existente:
            cursor.execute("""
                UPDATE Pessoa
                SET nome = %s
                WHERE id_pessoa = %s
            """, (nome, id_pessoa))

            cursor.execute("""
                UPDATE Paciente
                SET genero = %s,
                    sexo_referencia_clinica = %s,
                    data_nascimento = %s,
                    nome_responsavel = %s
                WHERE id_pessoa_FK = %s
            """, (
                genero,
                sexo_referencia_clinica,
                data_nascimento,
                nome_responsavel,
                id_pessoa
            ))

            conexao.commit()
            cursor.close()
            conexao.close()
            return {
                "sucesso": True,
                "id_paciente": id_paciente_existente
            }

        if is_admin == 1:
            cursor.close()
            conexao.close()
            return {
                "sucesso": False,
                "erro": "Este email ja pertence a um profissional ou administrador"
            }

        cursor.close()
        conexao.close()
        return {
            "sucesso": False,
            "erro": "Este email ja esta em uso"
        }

    senha_hash = gerar_hash_da_senha(senha)

    cursor.execute("""
        INSERT INTO Pessoa (nome, email, senha, is_admin)
        VALUES (%s, %s, %s, 0)
    """, (nome, email, senha_hash))

    # lastrowid guarda o id do ultimo registro inserido.
    id_pessoa_criada = cursor.lastrowid

    cursor.execute("""
        INSERT INTO Paciente (
            id_pessoa_FK,
            genero,
            sexo_referencia_clinica,
            data_nascimento,
            nome_responsavel
        )
        VALUES (%s, %s, %s, %s, %s)
    """, (
        id_pessoa_criada,
        genero,
        sexo_referencia_clinica,
        data_nascimento,
        nome_responsavel
    ))

    # lastrowid guarda o id do paciente criado agora.
    id_paciente_criado = cursor.lastrowid

    conexao.commit()

    cursor.close()
    conexao.close()

    return {
        "sucesso": True,
        "id_paciente": id_paciente_criado
    }
