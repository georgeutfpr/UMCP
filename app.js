const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Configuração do Mustache como mecanismo de visualização
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Configuração do Body Parser para lidar com dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));

// Rota principal
app.get('/', (req, res) => {
  res.render('main');
});

// Roteador de Alunos
app.use("/api", require("./control/alunoAPI"));
app.use("/api", require("./control/materiaAPI"));
app.use("/api", require("./control/turmaAPI"));
app.use("/api", require("./control/cursoAPI"));
app.use("/api", require("./control/departamentoAPI"));

// Rota para popular tabela
app.use("/install", require('./control/installAPI'))

// Configuração da porta do servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
