COMO RODAR O PROJETO AEROCODE (DO ZERO)
=======================================

PRÉ-REQUISITOS:
1. Node.js instalado.
2. MySQL instalado e rodando.

PASSO 1: CONFIGURAR O BACKEND (SERVIDOR)
----------------------------------------
1. Abra o terminal e entre na pasta do servidor:
   cd backend/server

2. Instale as ferramentas (dependências):
   npm install

3. Configure o acesso ao Banco de Dados:
   - Certifique-se de que o arquivo .env existe dentro de "backend/server".
   - Verifique se a URL do banco está correta (ex: mysql://root:senha@localhost:3306/aerocode_db).

4. Crie o Banco de Dados e as Tabelas (RODAR O SCHEMA):
   npx prisma migrate dev --name init

   (Se perguntar se pode apagar dados existentes, digite "y" e dê Enter).

5. Ligue o servidor:
   npx ts-node server.ts

   > Deve aparecer: "🔥 Servidor rodando em http://localhost:3001"

PASSO 2: CONFIGURAR O FRONTEND (SITE)
-------------------------------------
1. Abra um NOVO terminal (mantenha o anterior aberto).

2. Entre na pasta do site:
   cd frontend

3. Instale as ferramentas:
   npm install

4. Ligue o site:
   npm run dev

PASSO 3: ACESSAR
----------------
1. Abra o navegador e acesse o link mostrado no terminal (geralmente http://localhost:5173).
2. Como o banco foi recriado (Passo 1.4), ele estará vazio. Cadastre novos dados para testar.