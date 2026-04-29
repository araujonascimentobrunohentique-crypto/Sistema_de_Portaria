const express = require('express'); 
// Importa o Controller que contém a lógica de negócios
const portariaController = require('../APP/controler/portaria.controler'); 
// Inicializa o roteador do Express para gerenciar os caminhos
const router = express.Router();

// === PÁGINA INICIAL ===
// Quando o porteiro abre o sistema, lista todo mundo na Home
router.get("/", portariaController.mostrarinfo);

// === CADASTRO DE MORADOR ===
// Recebe os dados do formulário de 'Nome' e 'CPF' e salva no banco
router.post("/adicionar", portariaController.criarinfo);

// === CONTROLE DE ACESSO (MÁQUINA DO TEMPO) ===
// Rota que carimba a entrada do morador (gera o registro inicial)
router.post("/entrada", portariaController.registrarEntrada);

// Rota que carimba a saída (fecha o registro que estava aberto)
router.post("/saida", portariaController.registrarSaida);

// === PÁGINAS DE SUPORTE ===
// Tela de seleção: mostra o dropdown (select) para escolher quem vai entrar/sair
router.get("/registro", portariaController.carregarPaginaRegistro);

// Tela de relatório: exibe a tabela com o histórico cruzado (JOIN) de acessos
router.get("/historico", portariaController.exibirHistorico);

router.get("/", (req, res) => {
    // Rota principal (home)
    res.render("index", {
        dados: lista, 
        // Envia a lista de moradores para o EJS (usado na tabela)
        query: req.query
        // Envia os parâmetros da URL (ex: ?erro=... ou ?sucesso=...)
        // Isso permite mostrar mensagens no front
    });
});

// Exporta o router pra galera lá do index.js (arquivo principal) conseguir usar
module.exports = router;