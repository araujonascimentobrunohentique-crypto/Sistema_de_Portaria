// Importa a função mágica que conecta e executa comandos no MariaDB
const { executarQuery } = require("../../BD/bdconnect");

class portaria {
    
    // === BUSCAR TODOS OS MORADORES ===
    // Pega a lista completa pra mostrar na tabela da Home
    static async ReadAllPortaria() {
        const query = "select * from Moradores";
        const dados = await executarQuery(query);
        return dados;
    } 
    
    // === PESQUISAR NO HISTÓRICO POR NOME ===
    // Filtra os acessos usando o nome do morador via LIKE
    static async SearchAcessosByName(nome) {
        const query = `
            SELECT A.id, M.Nome, A.data_entrada, A.data_saida 
            FROM Acessos A 
            INNER JOIN Moradores M ON A.Pessoas_id = M.id 
            WHERE M.Nome LIKE ? 
            ORDER BY A.data_entrada DESC
        `;
        // O valor entre % % permite encontrar o nome em qualquer parte do texto
        return await executarQuery(query, [`%${nome}%`]);
    }

    // === CADASTRAR MORADOR ===
    // Salva o novo vizinho. O '?' evita que algum engraçadinho tente hackear via SQL Injection
    static async CreateMorador(Nome, CPF) {
        const query = "INSERT INTO Moradores (Nome, CPF) VALUES (?, ?)";
        const params = [Nome, CPF];
        return await executarQuery(query, params);
    }

    // === LISTAR HISTÓRICO (O famoso JOIN) ===
    // Aqui a gente cruza a tabela de Acessos com a de Moradores pra trocar o 'ID' pelo 'Nome'
    static async ReadAllAcessos() {
        const query = `
            SELECT A.id, M.Nome, A.data_entrada, A.data_saida 
            FROM Acessos A 
            INNER JOIN Moradores M ON A.Pessoas_id = M.id 
            ORDER BY A.data_entrada DESC
        `;
        return await executarQuery(query);
    }

    // === REGISTRAR ENTRADA ===
    // Cria um novo registro com a data e hora de agora (NOW())
    static regisEntrada = (id_morador) => {
        const sql = "INSERT INTO Acessos (Pessoas_id, data_entrada) VALUES (?, NOW())";
        return executarQuery(sql, [id_morador]);
    }

    // === REGISTRAR SAÍDA ===
    // Procura o registro que tá aberto (data_saida IS NULL) e carimba o horário de saída
    static regisSaida = (id_morador) => {
        const sql ="UPDATE Acessos SET data_saida = NOW() WHERE Pessoas_id = ? AND data_saida IS NULL";
        return executarQuery(sql, [id_morador]);
    }

    // === VALIDAÇÃO DE STATUS ===
    // Verifica se o morador já tá "pendurado" no sistema (entrou e não saiu)
    static async buscarAcessoAberto(id_morador) {
        const sql = "SELECT * FROM Acessos WHERE Pessoas_id = ? AND data_saida IS NULL";
        const resultado = await executarQuery(sql, [id_morador]);
        // Se o tamanho da lista for maior que 0, significa que ele tá lá dentro
        return resultado.length > 0; 
    }
}

// Exporta a classe pra ser usada como ferramenta lá no Controller
module.exports = portaria;