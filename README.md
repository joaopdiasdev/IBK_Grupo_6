<div align="center">

```
███████╗██╗  ██╗███████╗
██╔════╝╚██╗██╔╝██╔════╝
███████╗ ╚███╔╝ █████╗  
╚════██║ ██╔██╗ ██╔══╝  
███████║██╔╝ ██╗██║     
╚══════╝╚═╝  ╚═╝╚═╝     
```

# 🧬 Checklist Clínico de Triagem para Síndrome do X Frágil

**Uma ferramenta web para reduzir o subdiagnóstico da principal causa hereditária de deficiência intelectual no Brasil**

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge)](.)
[![Grupo](https://img.shields.io/badge/grupo-6-purple?style=for-the-badge)](.)
[![Área](https://img.shields.io/badge/área-saúde%20%2F%20genética-red?style=for-the-badge)](.)

</div>

---

## 📌 Sobre o Projeto

A **Síndrome do X Frágil (SXF)** é a principal causa hereditária de deficiência intelectual no mundo, causada por uma mutação no gene *FMR1* do cromossomo X. Apesar de sua relevância, o Brasil enfrenta um **alto índice de subdiagnóstico**, decorrente de dois fatores críticos:

- 🔬 **Variabilidade fenotípica**: os sintomas são heterogêneos e se sobrepõem a outras condições, dificultando o reconhecimento clínico;
- 💸 **Barreiras de acesso**: os exames confirmatórios (PCR e Southern Blotting) possuem alto custo e disponibilidade limitada no SUS.

Este projeto propõe uma solução prática: uma **aplicação web de checklist clínico de triagem populacional**, capaz de auxiliar profissionais de saúde a identificar pacientes com suspeita de SXF, calcular um score de risco e gerar recomendação clínica antes de indicar os exames genéticos confirmatórios.

---

## 🎯 Funcionalidades

- ✅ Checklist interativo com critérios clínicos (físico, comportamental, neurológico)
- 📊 Cálculo automático de score e classificação de risco (baixo / moderado / alto)
- 🧒 Perfis diferenciados para pacientes do sexo masculino e feminino
- 📝 Geração de relatório em PDF para anexar ao prontuário
- 📱 Interface responsiva para celular, tablet e computador

> ⚠️ **Aviso**: Esta ferramenta é um instrumento de **triagem**, não de diagnóstico. O diagnóstico definitivo requer confirmação por exame genético molecular (PCR e/ou Southern Blotting).

---

## 🛠️ Tech Stack

### Backend
| Tecnologia | Função |
|------------|--------|
| Python + Flask | Framework principal e rotas da API |
| Flask-SQLAlchemy | ORM para o banco de dados |
| Flask-CORS | Comunicação com o frontend React |
| PyMySQL | Conector com o MySQL |
| ReportLab | Geração de relatórios em PDF |
| python-dotenv | Gerenciamento de variáveis de ambiente |

### Frontend
| Tecnologia | Função |
|------------|--------|
| React.js | Interface dinâmica e interativa |
| Axios | Comunicação com a API Flask |
| MUI (Material UI) | Componentes visuais prontos e responsivos |
| Recharts | Gráficos do score de triagem |
| React Router | Navegação entre páginas |

### Banco de Dados
| Tecnologia | Função |
|------------|--------|
| MySQL | Banco de dados relacional principal |

---

## ⚙️ Documento Técnico de Implantação

### Requisitos de Sistema

| Item | Versão |
|------|--------|
| Sistema Operacional | Windows 10+ / Ubuntu 22.04+ / macOS 12+ |
| Python | `a definir` |
| Node.js | `a definir` |
| MySQL | `a definir` |
| npm | `a definir` |

### Instalação

**1. Clone o repositório**
```bash
git clone https://github.com/joaopdiasdev/IBK_Grupo_6.git
cd IBK_Grupo_6
```

**2. Configure as variáveis de ambiente**
```bash
# Crie o arquivo .env na pasta backend/
cp backend/.env.example backend/.env
# Edite com suas credenciais do MySQL
```

**3. Instale e execute o backend**
```bash
cd backend
pip install flask flask-sqlalchemy flask-cors python-dotenv reportlab pymysql
flask run
```

**4. Instale e execute o frontend**
```bash
cd frontend
npm install axios @mui/material @emotion/react @emotion/styled recharts react-router-dom
npm start
```

**5. Configure o banco de dados**
```bash
# Acesse o MySQL e crie o banco
CREATE DATABASE sxf_checklist;
# As tabelas são criadas automaticamente pelo SQLAlchemy na primeira execução
```

---

## 📖 Tutorial de Uso

> Guia passo a passo para o profissional de saúde

**`🚧 A ser escrito após a conclusão do sistema`**

Seções previstas:
1. Acessando o sistema
2. Cadastrando um novo paciente
3. Preenchendo o checklist clínico
4. Interpretando o score e a recomendação
5. Gerando e salvando o relatório em PDF

---

## 🎥 Vídeo Demonstrativo

> **`🚧 A ser adicionado após a conclusão do sistema`**

---

## 📁 Organização do Projeto

- 📋 **Gestão de tarefas**: Trello — divisão por sprints com responsáveis e prazos
- 🔀 **Versionamento**: GitHub — branches por feature, commits padronizados

---

## 👨‍💻 Equipe — Grupo 6

| Nome | GitHub |
|------|--------|
| **João Pedro Schmidt Dias** | [@joaopdiasdev](https://github.com/joaopdiasdev) |
| **Felipe Krupa Sokulski** | [@felipesokulskidev](https://github.com/felipesokulskidev) |
| **Tiago Augusto Miglioli** | [@tiagomiglioli](https://github.com/tiagomiglioli) |
| **Victor Schroeder** | [@SchroederVictor](https://github.com/SchroederVictor) |

---

<div align="center">

**Desenvolvido pensando em contribuir com a saúde brasileira**

*"O diagnóstico precoce muda vidas."*

</div>