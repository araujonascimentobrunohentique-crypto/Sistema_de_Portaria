const portariaModel = require("../Models/Portaria.model");

// === EXIBIÇÃO DA HOME ===
// Puxa a lista de moradores e renderiza a página principal
const mostrarinfo = (req, res) => {
    portariaModel.ReadAllPortaria()
        .then((dados) => {
            // Passa os dados do banco para o EJS sob o nome 'dados'
            res.render("index", { title: "principal", dados: dados, query: req.query });
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

    try {
        // Chama o model pra ver se tem algum registro sem data_saida
        const jaEstaDentro = await portariaModel.buscarAcessoAberto(id_morador);

        if (jaEstaDentro) {
            // Se o cara já tá no prédio, redireciona com a mensagem de erro
           // Guarda a mensagem no flash e redireciona limpo![]
            req.flash('erro', 'Este morador já possui uma entrada ativa. Registre a saída primeiro!');
            return res.redirect("/registro");
        }

        // Se passou na checagem, carimba a entrada
        await portariaModel.regisEntrada(id_morador);
        res.redirect("/"); // Sucesso vai para a home

    } catch (err) {
        // Se der erro no banco (catch), manda para a tela de registro com o erro
       req.flash('erro', 'Erro ao registrar entrada no banco de dados.');
        res.redirect("/registro");
    }
}

// === REGISTRO DE SAÍDA ===
const registrarSaida = async (req, res) => {
    const { id_morador } = req.body;

    try {
        // Verifica se existe uma entrada aberta pra esse morador
        const estaNoPredio = await portariaModel.buscarAcessoAberto(id_morador);

        if (!estaNoPredio) {
            // Se não tem entrada, redireciona avisando
            req.flash('erro', 'Este morador não está no prédio (não possui entrada aberta).');
            return res.redirect("/registro");
        }

        // Tudo ok? Atualiza o registro com a data_saida de agora
        await portariaModel.regisSaida(id_morador);
        res.redirect("/"); // Sucesso vai para a home

    } catch (err) {
        req.flash('erro', 'Erro ao registrar saída no banco de dados.');
        res.redirect("/registro");
    }
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
// === RELATÓRIO DE ACESSOS (COM BUSCA) ===
const exibirHistorico = async (req, res) => {
    try {
        const termoBusca = req.query.busca || ""; // Se for undefined, vira string vazia
        let listaAcessos;

        if (termoBusca) {
            // Se o usuário digitou algo, chama o novo método de busca
            listaAcessos = await portariaModel.SearchAcessosByName(termoBusca);
        } else {
            // Se não, mantém o comportamento padrão de listar tudo
            listaAcessos = await portariaModel.ReadAllAcessos();
        }
        // Passamos 'acessos' e também a variável 'busca' para o EJS não dar erro
        res.render("historico", {
            acessos: listaAcessos,
            busca: termoBusca
        });
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