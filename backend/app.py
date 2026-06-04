from flask import Flask
from flask_cors import CORS
from controllers.rotas import rotas

app = Flask(__name__)
CORS(app)

app.register_blueprint(rotas)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    