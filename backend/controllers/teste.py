import requests

dados = {
  "paciente": {
    "nome": "João Teste",
    "email": "joao123@gmail.com",
    "genero": "Masculino",
    "sexo_referencia_clinica": "M",
    "data_nascimento": "2010-05-10",
    "nome_responsavel": "Maria Teste"
  },
  "sintomas": [1, 2, 5],
  "observacoes": "Paciente apresentou alguns sinais"
}

resposta = requests.post(
    "http://localhost:5000/triagens",
    json=dados
)

print(resposta.json())