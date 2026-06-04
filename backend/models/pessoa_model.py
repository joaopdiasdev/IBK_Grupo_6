from dataBase.conexao import conectar_banco

def buscar_todas_pessoas():
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT id_pessoa, nome, email, is_admin FROM Pessoa")
    resultado = cursor.fetchall()

    cursor.close()
    conexao.close()

    return resultado
