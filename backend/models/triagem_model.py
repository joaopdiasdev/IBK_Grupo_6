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
