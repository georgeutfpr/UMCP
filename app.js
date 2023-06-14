const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');
const Aluno = require('./model/alunos');
const Materia = require('./model/materias');
const Turma = require('./model/turmas');
const Curso = require('./model/cursos');
const Departamento = require('./model/departamentos')

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
app.use("/api", require("./control/cursoAPI"));
app.use("/api", require("./control/departamentoAPI"));

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

// Rota para visualizar todos os cursos
app.get('/cursos', async (req, res) => {
  const cursos = await Curso.list();
  res.render('cursosView', { cursos: cursos });
});

// Rota para visualizar todos os departamentos
app.get('/departamentos', async (req, res) => {
  const departamentos = await Departamento.list();
  res.render('departamentosView', { departamentos });
});

// Rota para exibir o formulário de inserir aluno
app.get('/alunos/form', async (req, res) => {
  try {
    // Obtenha todos os cursos cadastrados
    const cursos = await Curso.list();

    // Renderize o template com os cursos
    res.render('alunoForm', { cursos });
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    res.status(500).send("Erro ao carregar cursos");
  }
});

// Rota para exibir o formulário de inserir matéria
app.get('/materias/form', (req, res) => {
  res.render('materiaForm');
});

// Rota para exibir o formulário de inserir curso
app.get('/cursos/form', async (req, res) => {
  try {
    // Obtenha todos os departamentos cadastrados
    const departamentos = await Departamento.list();

    // Renderize o template com os cursos
    res.render('cursoForm', { departamentos });
  } catch (error) {
    console.error("Erro ao carregar departamentos:", error);
    res.status(500).send("Erro ao carregar departamentos");
  }
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

// Rota para exibir o formulário de inserir departamento
app.get('/departamentos/form', (req, res) => {
  res.render('departamentoForm');
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

// Rota para processar o formulário de inserir curso
app.post('/cursos', async (req, res) => {
  const { nome, departamento } = req.body;

  try {
    const curso = await Curso.save(nome, departamento);
    res.redirect('/cursos'); // Redireciona para a página de visualização de matérias
  } catch (error) {
    console.error("Erro ao cadastrar curso:", error);
    res.status(500).json({ error: 'Erro ao cadastrar curso' });
  }
});

// Rota para processar o formulário de inserir departamento
app.post('/departamentos', async (req, res) => {
  const { sigla, nome } = req.body;

  try {
    const departamento = await Departamento.save(sigla, nome);
    res.redirect('/departamentos'); // Redireciona para a página de visualização de departamentos
  } catch (error) {
    console.error("Erro ao cadastrar departamento:", error);
    res.status(500).json({ error: 'Erro ao cadastrar departamento' });
  }
});

// Rota para deletar alunos
app.get('/alunos/delete', async (req, res) => {
  try {
    // Buscar todos os alunos para popular o select no formulário
    const alunos = await Aluno.list();

    // Renderizar o arquivo deletealunos.mustache com os alunos
    res.render('deleteAlunos', { alunos: alunos });
  } catch (error) {
    console.error("Erro ao carregar a página:", error);
    res.status(500).send("Erro ao carregar a página");
  }
});

app.post('/alunos/delete', async (req, res) => {
  try {
    const ra = req.body.ra; // Obtém o RA do aluno a ser excluído

    // Chama a função delete do modelo Aluno para excluir o aluno
    const resultado = await Aluno.delete(ra);

    // Verifica se a exclusão foi bem-sucedida
    if (resultado) {
      res.redirect('/alunos'); // Redireciona para a página de alunos após a exclusão
    } else {
      res.status(404).send('Aluno não encontrado'); // Retorna erro se o aluno não for encontrado
    }
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    res.status(500).send('Erro ao excluir aluno');
  }
});

// Configuração da porta do servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
