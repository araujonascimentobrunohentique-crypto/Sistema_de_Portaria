// importado as bibliotecas
const http = require("http");
const express = require("express"); 
const morgan = require("morgan");
const router = express.Router();
const app = express();
require('dotenv').config();


const portariaroutes = require("./routes/portaria.route");
// configurações iniciais
app.use(morgan("dev"));
app.set("views", "./view"); 
app.set("view engine", "ejs");
app.use(express.static("./public"));

const porta = Number(process.env.PORTA);


app.use("/", portariaroutes);

 app.use((req,res) => {
res.status(404).render("erro",{title:"erro"});
 });

// Coloca o servidor no ar
app.listen(porta, () => {
  console.log("Servidor rodando");
  console.log("Endereco: http://localhost:" + porta);
});
