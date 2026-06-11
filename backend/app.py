from flask import Flask, jsonify
from flask_cors import CORS
from auth import configurar_chave_secreta
from controllers.rotas import rotas
from controllers.relatorio import relatorio_bp

app = Flask(__name__)
configurar_chave_secreta(app)
CORS(app)

app.register_blueprint(rotas)
app.register_blueprint(relatorio_bp)

@app.route("/")
def index():
    return jsonify({
        "status": "ok",
        "mensagem": "Backend SXF funcionando!"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
