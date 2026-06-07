from dataBase.conexao import conectar_banco

def buscar_todas_triagens():
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Triagem")
    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return resultado

def calcular_score_triagem(sexo, sintomas):
    if len(sintomas) == 0:
        return 0

    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    placeholders = ",".join(["%s"] * len(sintomas))

    sql = f"""
        SELECT 
            SUM(
                CASE 
                    WHEN %s = 'M' THEN peso_masculino
                    WHEN %s = 'F' THEN peso_feminino
                    ELSE 0
                END
            ) AS score
        FROM Sintoma
        WHERE id_sintoma IN ({placeholders})
    """

    # serve para preencher os %s da query
    valores = [sexo, sexo] + sintomas

    cursor.execute(sql, valores)
    resultado = cursor.fetchone()

    cursor.close()
    conexao.close()

    if resultado["score"] is None:
        return 0

    return float(resultado["score"])


def gerar_recomendacao(score):
    #valor só pra teste, trocar para o valor do artigo
    if score >= 0.50:
        return "ENCAMINHAR_TESTE_GENETICO"
    else:
        return "NAO_ENCAMINHAR"

def salvar_triagem(id_paciente, observacoes, sexo, score, recomendacao, sintomas):
    conexao = conectar_banco()
    cursor = conexao.cursor()

    # Salva a triagem
    cursor.execute("""
        INSERT INTO Triagem (
            id_paciente_FK,
            observacoes,
            sexo_referencia_calculo,
            data_triagem,
            score_triagem,
            recomendacao
        )
        VALUES (%s, %s, %s, NOW(), %s, %s)
    """, (
        id_paciente,
        observacoes,
        sexo,
        score,
        recomendacao
    ))

    # Guarda o id gerado da triagem
    id_triagem = cursor.lastrowid

    # Salva cada sintoma marcado
    for id_sintoma in sintomas:
        cursor.execute("""
            INSERT INTO Resposta_Sintoma (
                id_triagem_FK,
                id_sintoma_FK,
                resposta
            )
            VALUES (%s, %s, %s)
        """, (
            id_triagem,
            id_sintoma,
            1
        ))

    conexao.commit()

    cursor.close()
    conexao.close()

    return id_triagem

def buscar_triagem_por_id(id_triagem):
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    # Busca dados da triagem e do paciente
    cursor.execute("""
        SELECT
            t.id_triagem,
            t.data_triagem,
            t.observacoes,
            t.score_triagem,
            t.recomendacao,
            t.sexo_referencia_calculo,

            p.id_paciente,
            p.genero,
            p.data_nascimento,
            p.nome_responsavel,

            pe.nome,
            pe.email

        FROM Triagem t

        JOIN Paciente p
            ON t.id_paciente_FK = p.id_paciente

        JOIN Pessoa pe
            ON p.id_pessoa_FK = pe.id_pessoa

        WHERE t.id_triagem = %s
    """, (id_triagem,))

    triagem = cursor.fetchone()

    if not triagem:
        cursor.close()
        conexao.close()
        return None

    # Busca sintomas da triagem
    cursor.execute("""
        SELECT
            s.id_sintoma,
            s.descricao

        FROM Resposta_Sintoma rs

        JOIN Sintoma s
            ON rs.id_sintoma_FK = s.id_sintoma

        WHERE rs.id_triagem_FK = %s
    """, (id_triagem,))

    sintomas = cursor.fetchall()

    triagem["sintomas"] = sintomas

    cursor.close()
    conexao.close()

    return triagem

def buscar_historico_triagens():
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            t.id_triagem,
            t.data_triagem,
            t.score_triagem,
            t.recomendacao,
            t.observacoes,

            pe.nome

        FROM Triagem t

        JOIN Paciente p
            ON t.id_paciente_FK = p.id_paciente

        JOIN Pessoa pe
            ON p.id_pessoa_FK = pe.id_pessoa

        ORDER BY t.data_triagem DESC
    """)

    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return resultado