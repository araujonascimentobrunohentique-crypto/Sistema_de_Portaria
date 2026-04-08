const http = require("http");
const express = require("express"); // Linha adicionada
const morgan = require("morgan");
const router = express.Router();
const app = express(); // Linha adicionada
require('dotenv').config();


const tarefasroutes = require("./rotes/estacionamento.routes");
// configurações iniciais
app.use(morgan("dev"));
app.set("views", "./view"); //adicionado
app.set("view engine", "ejs"); //adicionado
app.use(express.static("./public"));//adicionado

const porta = Number(process.env.PORTA);


app.use("/", tarefasroutes);

 app.use((req,res) => {
res.status(404).render("erro",{title:"erro"});
 });

// Coloca o servidor no ar
app.listen(porta, () => {
  console.log("Servidor rodando");
  console.log("Endereco: http://localhost:" + porta);
});
