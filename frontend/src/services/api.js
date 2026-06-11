import axios from "axios";

const enderecoBackend = "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: enderecoBackend
});

function adicionarTokenNaRequisicao(config) {
  const tokenSalvo = localStorage.getItem("token");

  if (tokenSalvo) {
    config.headers.Authorization = "Bearer " + tokenSalvo;
  }

  return config;
}

api.interceptors.request.use(adicionarTokenNaRequisicao);

export default api;
