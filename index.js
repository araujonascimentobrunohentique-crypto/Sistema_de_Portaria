// 1. Importação de bibliotecas fundamentais
const http = require("http");
const express = require("express"); 
const morgan = require("morgan");
const path = require("path"); // Necessário para gerenciar caminhos de pastas
const app = express();
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ESSA LINHA É OBRIGATÓRIA!


// 2. Importação das rotas do sistema
const portariaroutes = require("./routes/portaria.route");

// 3. Configurações de Middleware e Visualização
app.use(morgan("dev")); // Loga no console todas as requisições (GET, POST, etc)
app.use(express.urlencoded({ extended: true })); // Permite que o Express leia dados vindos de formulários

// Define que as páginas (views) estão dentro da pasta APP/views
app.set("views", path.join(__dirname, "APP", "views")); 
app.set("view engine", "ejs"); // Define o EJS como motor de renderização HTML
app.use(express.static("./public")); // Define a pasta para arquivos estáticos (CSS, imagens)

// 4. Definição da Porta (vinda do .env)
const porta = Number(process.env.PORTA);

// 5. Uso das Rotas definidas no arquivo externo
app.use("/", portariaroutes);

// 6. Rota de Erro (Middleware de 404)
// Se o usuário tentar acessar uma rota que não existe, renderiza a página de erro
app.use((req, res) => {
    res.status(404).render("erro", { title: "erro" });
});

// 7. Inicialização do Servidor
app.listen(porta, () => {
    console.log("Servidor rodando");
    console.log("Endereco: http://localhost:" + porta);
});