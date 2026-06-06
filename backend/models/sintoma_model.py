from dataBase.conexao import conectar_banco

def buscar_todos_sintomas():
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Sintoma")
    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return resultado
