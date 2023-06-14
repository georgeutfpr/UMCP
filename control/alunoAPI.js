const express = require('express');
const router = express.Router();
const Aluno = require('../model/alunos');
const Curso = require('../model/cursos');

// Rota para visualizar todos os alunos
router.get('/alunos', async (req, res) => {
  const alunos = await Aluno.list();
  res.render('alunosView', { alunos });
});

// Rota para exibir o formulário de inserir aluno
router.get('/alunos/form', async (req, res) => {
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

// Rota para processar o formulário de inserir aluno
router.post('/alunos', async (req, res) => {
  const { ra, nome, curso, periodo, turno } = req.body;

  try {
    const aluno = await Aluno.save(ra, nome, curso, periodo, turno);
    res.redirect('/api/alunos'); // Redireciona para a página de visualização de alunos
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    res.status(500).json({ error: 'Erro ao cadastrar aluno' });
  }
});

// Rota para exibir o formulário de atualização de aluno
router.get('/alunos/update', async (req, res) => {
  try {
    const alunos = await Aluno.list(); // Obtenha a lista de alunos
    const cursos = await Curso.list();

    res.render('alunoUpdate', { alunos, cursos }); // Renderize o formulário de atualização de aluno com a lista de alunos
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
    res.status(500).send('Erro ao carregar alunos');
  }
});

// Rota para processar o formulário de atualização de aluno
router.post('/alunos/update', async (req, res) => {
  const { ra, nome, curso, periodo, turno } = req.body;

  try {
    const alunoAtualizado = await Aluno.update(ra, nome, curso, periodo, turno); // Chame a função de atualização de aluno com os novos dados

    res.redirect('/api/alunos');
  } catch (error) {
    res.render('erro', { mensagem: 'Erro ao atualizar aluno: ' + error.message });
  }
});

// Rota para exibir o formulário de deletar aluno
router.get('/alunos/delete', async (req, res) => {
  try {
    // Buscar todos os alunos para popular o select no formulário
    const alunos = await Aluno.list();
    // Renderizar o arquivo deletealunos.mustache com os alunos
    res.render('deleteAlunos', { alunos: alunos });
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
  }
});

// Rota para processar o formulário de deletar aluno
router.post('/alunos/delete', async (req, res) => {
  try {
    const ra = req.body.ra; // Obtém o RA do aluno a ser excluído
    // Chama a função delete do modelo Alunos para excluir o aluno
    const resultadoAlu = await Aluno.delete(ra);

    // Verifica se a exclusão foi bem-sucedida
    if (resultadoAlu) {
      res.redirect('/api/alunos'); // Redireciona para a página de visualização de alunos após a exclusão
    } else {
      res.status(404).send('Aluno não encontrado'); // Retorna erro se o aluno não for encontrado
    }
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    res.status(500).send('Erro ao excluir aluno');
  }
});

module.exports = router;
