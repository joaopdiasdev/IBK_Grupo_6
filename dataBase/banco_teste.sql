/* Criação do  SCHEMA de tabelas para estruturação do banco */

-- 1. Criação da tabela Pessoa
CREATE TABLE Pessoa (
    id_pessoa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) DEFAULT 0
);

-- 2. Criação da tabela Profissional_Saude
CREATE TABLE Profissional_Saude (
    id_profissional INT AUTO_INCREMENT PRIMARY KEY,
    especialidade ENUM('MÉDICO(A)', 'ENFERMEIRO(A)') NOT NULL,
    id_pessoa_FK INT NOT NULL,
    FOREIGN KEY (id_pessoa_FK) REFERENCES Pessoa(id_pessoa) ON DELETE CASCADE
);

-- 3. Criação da tabela Paciente
CREATE TABLE Paciente (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    id_pessoa_FK INT UNIQUE, -- Se o paciente não fizer login, PODERÁ SER REMOVIDO.
    sexo ENUM('M', 'F') NOT NULL,
    data_nascimento DATE,
    nome_responsavel VARCHAR(150),
    FOREIGN KEY (id_pessoa_FK) REFERENCES Pessoa(id_pessoa) ON DELETE CASCADE
);

-- 4. Criação da tabela Sintoma COM DICINÁRIO DE PESOS (FEITAS NO INSERT)
CREATE TABLE Sintoma (
    id_sintoma INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    peso_masculino DECIMAL(5,2) NOT NULL,
    peso_feminino DECIMAL(5,2) NOT NULL
);

-- 5. Criação da tabela Triagem 
CREATE TABLE Triagem (
    id_triagem INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente_FK INT NOT NULL,
    id_profissional_FK INT NOT NULL,
    observacoes TEXT,
    data_triagem DATETIME NOT NULL,
    score_triagem DECIMAL(5,2) NOT NULL,
    recomendacao ENUM('ENCAMINHAR_TESTE_GENETICO', 'NAO_ENCAMINHAR') NOT NULL,
    FOREIGN KEY (id_paciente_FK) REFERENCES Paciente(id_paciente) ON DELETE CASCADE,
    FOREIGN KEY (id_profissional_FK) REFERENCES Profissional_Saude(id_profissional) ON DELETE CASCADE
);

-- 6. Criação da tabela Resposta_Sintoma (Quais sintomas o médico marcou)
CREATE TABLE Resposta_Sintoma (
    id_resposta_sintoma INT AUTO_INCREMENT PRIMARY KEY,
    id_triagem_FK INT NOT NULL,
    id_sintoma_FK INT NOT NULL,
    resposta TINYINT(1) NOT NULL, -- 1 para Sim (PRESENTE), 0 para Não (AUSENTE)
    FOREIGN KEY (id_triagem_FK) REFERENCES Triagem(id_triagem) ON DELETE CASCADE,
    FOREIGN KEY (id_sintoma_FK) REFERENCES Sintoma(id_sintoma) ON DELETE CASCADE
);

/* OBS: Utilização do ON DELETE CASCADE para não sobrar lixo no banco. */

INSERT INTO Sintoma (descricao, peso_masculino, peso_feminino) VALUES
('Deficiência intelectual', 0.32, 0.20),
('Face alongada, mandíbula proeminente e/ou orelhas grandes', 0.29, 0.09),
('Macroorquidismo (Testículos aumentados)', 0.26, 0.00),
('Hipermobilidade articular', 0.19, 0.04),
('Dificuldades de aprendizagem', 0.18, 0.28),
('Déficit de atenção', 0.17, 0.12),
('Movimentos intencionais, repetitivos e rítmicos', 0.17, 0.05),
('Atraso na fala', 0.14, 0.01),
('Hiperatividade', 0.12, 0.04),
('Evita contato visual', 0.06, 0.08),
('Evita contato físico', 0.04, 0.07),
('Agressividade', 0.01, 0.02);

/*  Insert feito com base no artigo científico, pesos validados conforme a tabela do mesmo
respectivamente masculino e feminino. */

-- Seed.sql com dados fictícios para a validação do Banco

-- 1. Cadastrando a Pessoa que será o Médico
INSERT INTO Pessoa (nome, email, senha, is_admin) 
VALUES ('Dr. Carlos Almeida', 'carlos.almeida@clinica.com', 'hash_senha_segura', 0);

-- 2. Vinculando o Dr. CARLOS como Profissional de Saúde
INSERT INTO Profissional_Saude (especialidade, id_pessoa_FK) 
VALUES ('MÉDICO(A)', 1);

-- 3. Cadastrando a Pessoa que será o Paciente 
INSERT INTO Pessoa (nome, email, senha, is_admin) 
VALUES ('Joãozinho da Silva', 'joao@paciente.com', 'senha_aleatoria', 0);

-- 4. Vinculando os dados médicos do Paciente Joãozinho (Sexo Masculino 'M')
INSERT INTO Paciente (id_pessoa_FK, sexo, data_nascimento, nome_responsavel) 
VALUES (2, 'M', '2015-08-20', 'Maria da Silva');

-- 5. Simulando a Triagem do Joãozinho feita pelo Dr. Carlos
-- Vamos supor que a soma dos pesos que marcaremos abaixo dê 0.93 (maior que o limiar de 0.56)
INSERT INTO Triagem (id_paciente_FK, id_profissional_FK, observacoes, data_triagem, score_triagem, recomendacao) 
VALUES (1, 1, 'Paciente muito agitado durante a consulta. Apresenta características faciais marcantes.', NOW(), 0.93, 'ENCAMINHAR_TESTE_GENETICO');

-- 6. Preenchendo o Formulário (O médico marcou "Sim" para 4 sintomas)
-- IDs: 1 (Deficiência Intelectual), 3 (Macroorquidismo), 5 (Dificuldades de Aprendizagem), 6 (Déficit de Atenção)
INSERT INTO Resposta_Sintoma (id_triagem_FK, id_sintoma_FK, resposta) VALUES
(1, 1, 1),
(1, 3, 1),
(1, 5, 1),
(1, 6, 1);

