const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');
const Aluno = require('./model/alunos');
const Materia = require('./model/materias');
const Turma = require('./model/turmas');

const app = express();

// Configuração do Mustache como mecanismo de visualização
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Configuração do Body Parser para lidar com dados do formulário
app.use(bodyParser.urlencoded({ extended: false }));

// Roteador de Alunos
app.use("/api", require("./control/alunoAPI"));
app.use("/api", require("./control/materiaAPI"));
app.use("/api", require("./control/turmaAPI"));
app.use("/install", require('./control/installAPI'))

// Rota principal
app.get('/', (req, res) => {
  res.render('main');
});

// Rota para visualizar todos os alunos
app.get('/alunos', async (req, res) => {
  const alunos = await Aluno.list();
  res.render('alunosView', { alunos });
});

// Rota para visualizar todas as matérias
app.get('/materias', async (req, res) => {
  const materias = await Materia.list();
  res.render('materiasView', { materias });
});

// Rota para visualizar todas as turmas
app.get('/turmas', async (req, res) => {
  const turmas = await Turma.list();
  res.render('turmasView', { turmas: turmas });
});

// Rota para exibir o formulário de inserir aluno
app.get('/alunos/form', (req, res) => {
  res.render('alunoForm');
});

// Rota para exibir o formulário de inserir matéria
app.get('/materias/form', (req, res) => {
  res.render('materiaForm');
});

// Rota para exibir o formulário de inserir turma
app.get('/turmas/form', async (req, res) => {
  try {
    const turmas = await Turma.list();
    const alunos = await Aluno.list();
    const materias = await Materia.list();
    res.render('turmaForm', { turmas: turmas, alunos: alunos, materias: materias });
  } catch (error) {
    console.error("Erro ao buscar turmas, alunos e matérias:", error);
    res.status(500).send("Erro ao buscar turmas, alunos e matérias");
  }
});


// Rota para processar o formulário de inserir aluno
app.post('/alunos', async (req, res) => {
  const { ra, nome, curso, periodo, turno } = req.body;

  try {
    const aluno = await Aluno.save(ra, nome, curso, periodo, turno);
    res.redirect('/alunos'); // Redireciona para a página de visualização de alunos
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    res.status(500).json({ error: 'Erro ao cadastrar aluno' });
  }
});

// Rota para processar o formulário de inserir matéria
app.post('/materias', async (req, res) => {
  const { codigo, nome } = req.body;

  try {
    const materia = await Materia.save(codigo, nome);
    res.redirect('/materias'); // Redireciona para a página de visualização de matérias
  } catch (error) {
    console.error("Erro ao cadastrar matéria:", error);
    res.status(500).json({ error: 'Erro ao cadastrar matéria' });
  }
});

// Rota para processar o formulário de inserir turma
app.post('/turmas', async (req, res) => {
  const { codigo, nome, alunos_RA, materia_codigo } = req.body;

  try {
    const turma = await Turma.save(codigo, nome, alunos_RA, materia_codigo);
    res.redirect('/turmas'); // Redireciona para a página de visualização de turmas
  } catch (error) {
    console.error("Erro ao cadastrar turma:", error);
    res.status(500).json({ error: 'Erro ao cadastrar turma' });
  }
});

// Configuração da porta do servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
