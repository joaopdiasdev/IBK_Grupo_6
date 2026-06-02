from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def conectar_banco():
    return mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="7Limonad@",
        database="banco_ibk",
        port=3306
    )

@app.route("/")
def index():
    return jsonify({"status": "Backend rodando"})

@app.route("/sintomas")
def listar_sintomas():
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Sintoma")
    resultado = cursor.fetchall()
    cursor.close()
    conexao.close()
    return jsonify(resultado)

@app.route("/pacientes")
def listar_pacientes():
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Paciente")
    resultado = cursor.fetchall()
    cursor.close()
    conexao.close()
    return jsonify(resultado)

@app.route("/triagens")
def listar_triagens():
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Triagem")
    resultado = cursor.fetchall()
    cursor.close()
    conexao.close()
    return jsonify(resultado)

@app.route("/pessoas")
def listar_pessoas():
    conexao = conectar_banco()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT id_pessoa, nome, email, is_admin FROM Pessoa")
    resultado = cursor.fetchall()
    cursor.close()
    conexao.close()
    return jsonify(resultado)

if __name__ == "__main__":
    app.run(debug=True, port=5000)