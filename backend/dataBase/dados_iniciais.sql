USE banco_ibk; -- COLOCAR O NOME CORRETO NA IMPLEMENTAÇÃO.

INSERT INTO Pessoa (nome, email, senha, is_admin)
SELECT
    'Administrador',
    'admin@ibk.com',
    'scrypt:32768:8:1$yCXR2mAYQ7TWwHCd$4fc76ae579f8166ef6c216522e6271b94fabd75106ffea6780bdd14f0cfaf59d5590ec797428c955c14b59e574cdd27d3bba45d947cf0d583295427fc1d9c725',
    1
WHERE NOT EXISTS (
    SELECT 1
    FROM Pessoa
    WHERE email = 'admin@ibk.com'
);

INSERT INTO Profissional_Saude (especialidade, id_pessoa_FK)
SELECT
    'MÉDICO(A)',
    p.id_pessoa
FROM Pessoa p
WHERE p.email = 'admin@ibk.com'
  AND NOT EXISTS (
      SELECT 1
      FROM Profissional_Saude ps
      WHERE ps.id_pessoa_FK = p.id_pessoa
  );

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
