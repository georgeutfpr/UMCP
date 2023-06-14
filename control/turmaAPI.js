const express = require('express');
const router = express.Router();
const Turma = require('../model/turmas');
const Aluno = require('../model/alunos');
const Materia = require('../model/materias');

// Rota para visualizar todas as turmas
router.get('/turmas', async (req, res) => {
  const turmas = await Turma.list();
  res.render('turmasView', { turmas: turmas });
});

// Rota para exibir o formulário de inserir turma
router.get('/turmas/form', async (req, res) => {
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

// Rota para processar o formulário de inserir turma
router.post('/turmas', async (req, res) => {
  const { codigo, nome, alunos_RA, materia_codigo } = req.body;

  try {
    const turma = await Turma.save(codigo, nome, alunos_RA, materia_codigo);
    res.redirect('/api/turmas'); // Redireciona para a página de visualização de turmas
  } catch (error) {
    console.error("Erro ao cadastrar turma:", error);
    res.status(500).json({ error: 'Erro ao cadastrar turma' });
  }
});

// Rota para exibir o formulário de deletar turma
router.get('/turmas/delete', async (req, res) => {
  try {
    // Buscar todos as turmas para popular o select no formulário
    const turmas = await Turma.list();
    // Renderizar o arquivo deleteTurmas.mustache com os alunos
    res.render('deleteTurmas', { turmas: turmas });
  } catch (error) {
  console.error("Erro ao carregar a página:", error);
    res.status(500).send("Erro ao carregar a página");
  }
});

// Rota para processar o formulário de deletar turma
router.post('/turmas/delete', async (req, res) => {
  try {
    const codigo = req.body.codigo; // Obtém o código da turma a ser excluído
    // Chama a função delete do modelo Turmas para excluir o aluno
    const resultadoTur = await Turma.delete(codigo);

    // Verifica se a exclusão foi bem-sucedida
    if (resultadoTur) {
      res.redirect('/api/turmas'); // Redireciona para a página de visualização de turmas após a exclusão
    } else {
      res.status(404).send('Turma não encontrada'); // Retorna erro se a turma não for encontrado
    }
  } catch (error) {
    console.error('Erro ao excluir turma:', error);
    res.status(500).send('Erro ao excluir turma');
  }
});

module.exports = router;
