from flask import Flask, jsonify
from flask_cors import CORS
from controllers.rotas import rotas

app = Flask(__name__)
CORS(app)

app.register_blueprint(rotas)

@app.route("/")
def index():
    return jsonify({
        "status": "ok",
        "mensagem": "Backend SXF funcionando!"
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)