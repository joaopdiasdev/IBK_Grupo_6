/* Criação do  SCHEMA de tabelas para estruturação do banco */

CREATE DATABASE IF NOT EXISTS banco_ibk;
USE banco_ibk;

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
    genero ENUM('MASCULINO', 'FEMININO', 'OUTRO', 'PREFERE_NAO_INFORMAR') NOT NULL,
	sexo_referencia_clinica ENUM('M', 'F') NOT NULL,
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
    observacoes TEXT,
    sexo_referencia_calculo ENUM('M', 'F') NOT NULL,
    data_triagem DATETIME NOT NULL,
    score_triagem DECIMAL(5,2) NOT NULL,
    recomendacao ENUM('ENCAMINHAR_TESTE_GENETICO', 'NAO_ENCAMINHAR') NOT NULL,
    FOREIGN KEY (id_paciente_FK) REFERENCES Paciente(id_paciente) ON DELETE CASCADE
);

-- 6. Criação da tabela intermediária Triagem_profissional
CREATE TABLE Triagem_Profissional(
	id_triagem_profissional INT AUTO_INCREMENT PRIMARY KEY,
    id_triagem_FK INT NOT NULL,
	id_profissional_FK INT NOT NULL,
    papel ENUM('RESPONSAVEL_INICIAL', 'RESPONSAVEL_ATUAL', 'PARTICIPANTE') NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    observacao TEXT,
    FOREIGN KEY (id_triagem_FK) REFERENCES Triagem(id_triagem) ON DELETE CASCADE,
    FOREIGN KEY (id_profissional_FK) REFERENCES Profissional_Saude(id_profissional) ON DELETE CASCADE
);

-- 7. Criação da tabela Resposta_Sintoma (Quais sintomas o médico marcou)
CREATE TABLE Resposta_Sintoma (
    id_resposta_sintoma INT AUTO_INCREMENT PRIMARY KEY,
    id_triagem_FK INT NOT NULL,
    id_sintoma_FK INT NOT NULL,
    resposta TINYINT(1) NOT NULL, -- 1 para Sim (PRESENTE), 0 para Não (AUSENTE)
    FOREIGN KEY (id_triagem_FK) REFERENCES Triagem(id_triagem) ON DELETE CASCADE,
	FOREIGN KEY (id_sintoma_FK) REFERENCES Sintoma(id_sintoma) ON DELETE CASCADE,
    UNIQUE (id_triagem_FK, id_sintoma_FK) -- EVITAR O MESMO SINTOMA NA MESMA TRIAGEM
);

/* OBS: Utilização do ON DELETE CASCADE para não sobrar lixo no banco. */
