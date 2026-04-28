// Carrega as variáveis do arquivo .env para o objeto process.env (segurança de credenciais)
require("dotenv").config();

// Importa o driver do MariaDB para permitir a comunicação com o banco de dados
const mariadb = require("mariadb");

// Cria um "Pool" de conexões. É como uma fila de conexões prontas para serem usadas
const pool = mariadb.createPool({
    host: process.env.DBHOST,     // Endereço do servidor (ex: localhost)
    user: process.env.DBUSER,     // Usuário do banco
    password: process.env.DBPASS, // Senha do banco
    database: process.env.DBNAME, // Nome do banco de dados do sistema de portaria
    connectionLimit: 5,           // Máximo de 5 conexões simultâneas abertas
});

// Função assíncrona que simplifica a execução de comandos SQL no projeto
async function executarQuery(query, params = []) {
    // Logs de debug para você ver no terminal o que está acontecendo
    console.log("============================================================================");
    console.log("dbconnect.js", "executarQuery()");
    console.log(arguments); // Mostra o SQL e os dados (nome, cpf) enviados

    let conn; // Declara a variável da conexão fora para usá-la no finally
    try {
        // Pega uma conexão disponível do Pool
        conn = await pool.getConnection();

        // Executa a query SQL de fato, passando os parâmetros para evitar SQL Injection
        const rows = await conn.query(query, params);

        console.log("============================================================");

        // Retorna o resultado do banco (os dados encontrados ou confirmação de inserção)
        return rows;
    } catch (err) {
        // Se algo der errado (senha errada, tabela inexistente), exibe o erro no terminal
        console.error("erro ao executar query:", err);
        throw err; // Repassa o erro para quem chamou a função tratar
    } finally {
        // IMPORTANTE: Devolve a conexão para o Pool, independente de ter dado erro ou sucesso
        if (conn) conn.release();
    }
}

// Exporta a função para que os seus "Models" possam usá-la
module.exports = { executarQuery };