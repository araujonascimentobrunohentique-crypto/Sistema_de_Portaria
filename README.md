# Sistema_de_Portaria

-- 1. Criar o banco de dados (se não existir)
CREATE DATABASE sistema_portaria;
USE sistema_portaria;

-- 2. Criar a tabela de Moradores (O "Pai")
-- O AUTO_INCREMENT resolve aquele erro de 'Duplicate Entry' que tivemos!
CREATE TABLE Moradores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(255) NOT NULL,
    CPF VARCHAR(20) NOT NULL UNIQUE
);

-- 3. Criar a tabela de Acessos (A "Filha")
-- A Foreign Key garante que não exista acesso para um morador que não existe.
    CREATE TABLE Acessos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        Pessoas_id INT,
        data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_saida DATETIME NULL,
        FOREIGN KEY (Pessoas_id) REFERENCES Moradores(id) ON DELETE CASCADE
    );

# 🏢 Sistema de Portaria Digital

Projeto desenvolvido em **Node.js** para controle de entrada e saída de moradores, utilizando arquitetura **MVC** (Model-View-Controller) e banco de dados **MariaDB**.

## 🚀 Funcionalidades
- **Cadastro de Moradores**: Registro de nome e CPF.
- **Listagem em Tempo Real**: Visualização de todos os cadastrados.
- **Controle de Acessos**: Registro de entrada e saída com carimbo de data/hora.
- **Travas de Segurança**: Impede que um morador entre duas vezes ou saia sem ter entrado.
- **Histórico Completo**: Relatório cruzado (JOIN) mostrando nomes e horários.

## 🛠️ Tecnologias Utilizadas
- **Backend**: Node.js com Express
- **Banco de Dados**: MariaDB / MySQL
- **Frontend**: EJS (Embedded JavaScript templates) + Bootstrap 5
- **Conexão**: Driver `mariadb` com Pool de conexões

## 📋 Pré-requisitos
Antes de começar, você vai precisar ter instalado:
- [Node.js](https://nodejs.org/)
- [MariaDB](https://mariadb.org/) ou MySQL

## 🔧 Configuração do Projeto

1. **Clone o repositório ou baixe os arquivos.**

2. **Instale as dependências:**
   npm install ou npm i

Configure as Variáveis de Ambiente:
Crie um arquivo .env na raiz do projeto e adicione suas credenciais:
DBHOST=localhost
DBUSER=seu_usuario
DBPASS=sua_senha
DBNAME=sistema_portaria

Inicie o Servidor:
npm run dev


