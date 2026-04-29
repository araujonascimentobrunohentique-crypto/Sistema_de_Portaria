const portariaModel = require("../Models/Portaria.model");

// === EXIBIÇÃO DA HOME ===
// Puxa a lista de moradores e renderiza a página principal
const mostrarinfo = (req, res) => {
    portariaModel.ReadAllPortaria()
        .then((dados) => {
            // Passa os dados do banco para o EJS sob o nome 'dados'
            res.render("index", { title: "principal", dados: dados,  query: req.query  });
        })
        .catch(err => res.status(500).send("Erro ao carregar a home: " + err)); 
}

// === CADASTRO DE MORADOR ===
// Recebe os dados do form e cria um novo vizinho no banco
const criarinfo = (req, res) => {
    const { Nome, CPF } = req.body; // Desestrutura o que veio do formulário

    portariaModel.CreateMorador(Nome, CPF)  // novo morador na lista
        .then(() => {
            res.redirect("/?sucesso=Morador cadastrado com sucesso");
        })
        .catch(err => {
            console.error(err);
            res.redirect("/?erro=Erro ao salvar morador");
        });
}

// === REGISTRO DE ENTRADA ===
// A lógica aqui é: só entra se não estiver lá dentro
const registrarEntrada = async (req, res) => {
    const { id_morador } = req.body;
    
    // Chama o model pra ver se tem algum registro sem data_saida
    const jaEstaDentro = await portariaModel.buscarAcessoAberto(id_morador);
    
    if (jaEstaDentro) {
        // Se o cara já tá no prédio, barra a entrada duplicada
        return res.status(400).send("Este morador já possui uma entrada ativa. Registre a saída primeiro!");
    }

    // Se passou na checagem, carimba a entrada
    portariaModel.regisEntrada(id_morador)
        .then(() => res.redirect("/"))
        .catch(err => res.status(500).send("Erro ao registrar entrada."));
}

// === REGISTRO DE SAÍDA ===
// Só sai se tiver entrado antes (óbvio, né?)
const registrarSaida = async (req, res) => {
    const { id_morador } = req.body;
    
    // Verifica se existe uma entrada aberta pra esse morador
    const estaNoPredio = await portariaModel.buscarAcessoAberto(id_morador);
    
    if (!estaNoPredio) {
        // Se não tem entrada, não tem como dar saída
        return res.status(400).send("Este morador não está no prédio (não possui entrada aberta).");
    }

    // Tudo ok? Atualiza o registro com a data_saida de agora
    portariaModel.regisSaida(id_morador)
        .then(() => res.redirect("/"))
        .catch(err => res.status(500).send("Erro ao registrar saída."));
}

// === PÁGINA DE SELEÇÃO ===
// Renderiza a tela de registro buscando a lista de moradores pro <select>
const carregarPaginaRegistro = async (req, res) => {
    try {
        const moradores = await portariaModel.ReadAllPortaria();
        res.render("registro", { moradores: moradores });
    } catch (err) {
        res.status(500).send("Erro ao carregar página de registro.");
    }
}

// === RELATÓRIO DE ACESSOS ===
// Mostra quem entrou e saiu usando o JOIN
const exibirHistorico = async (req, res) => {
    try {
        const listaAcessos = await portariaModel.ReadAllAcessos();
        res.render("historico", { acessos: listaAcessos });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao carregar histórico.");
    }
}

// Exporta tudo pro arquivo de rotas usar
module.exports = {
    mostrarinfo,
    criarinfo,
    registrarSaida,
    registrarEntrada,
    carregarPaginaRegistro,
    exibirHistorico
};