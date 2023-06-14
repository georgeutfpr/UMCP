const express = require('express');
const router = express.Router();
const Curso = require('../model/cursos');
const Departamento = require('../model/departamentos');

// Rota para visualizar todos os cursos
router.get('/cursos', async (req, res) => {
  const cursos = await Curso.list();
  res.render('cursosView', { cursos: cursos });
});

// Rota para exibir o formulário de inserir curso
router.get('/cursos/form', async (req, res) => {
  try {
    // Obtenha todos os departamentos cadastrados
    const departamentos = await Departamento.list();

    // Renderize o template com os departamentos
    res.render('cursoForm', { departamentos });
  } catch (error) {
    console.error("Erro ao carregar departamentos:", error);
    res.status(500).send("Erro ao carregar departamentos");
  }
});

// Rota para processar o formulário de inserir curso
router.post('/cursos', async (req, res) => {
  const { nome, departamento, professor } = req.body;

  try {
    const curso = await Curso.save(nome, departamento, professor);
    res.redirect('/api/cursos'); // Redireciona para a página de visualização de cursos
  } catch (error) {
    console.error("Erro ao cadastrar curso:", error);
    res.status(500).json({ error: 'Erro ao cadastrar curso' });
  }
});

// Rota para exibir o formulário de atualização de curso
router.get('/cursos/update', async (req, res) => {
  try {
    const cursos = await Curso.list(); // Obtenha a lista de alunos
    const departamentos = await Departamento.list(); // Obtenha a lista de departamentos

    res.render('cursoUpdate', { cursos, departamentos }); // Renderize o formulário de atualização de curso com a lista de cursos e departamentos
  } catch (error) {
    console.error('Erro ao carregar cursos ou departamentos:', error);
    res.status(500).send('Erro ao carregar cursos ou departamentos');
  }
});

// Rota para processar o formulário de atualização de curso
router.post('/cursos/update', async (req, res) => {
  const { nome, departamento } = req.body;

  try {
    const cursoAtualizado = await Curso.update(nome, departamento); // Chame a função de atualização de curso com os novos dados

    res.redirect('/api/cursos');
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
  }
});

// Rota para exibir o formulário de deletar curso
router.get('/cursos/delete', async (req, res) => {
  try {
    // Buscar todos os cursos para popular o select no formulário
    const cursos = await Curso.list();
    // Renderizar o arquivo deleteCursos.mustache com os alunos
    res.render('deleteCursos', { cursos: cursos });
  } catch (error) {
    console.error("Erro ao carregar a página:", error);
    res.status(500).send("Erro ao carregar a página");
  }
});

// Rota para processar o formulário de deletar curso
router.post('/cursos/delete', async (req, res) => {
  try {
    const nome = req.body.nome; // Obtém o nome do curso a ser excluído
    // Chama a função delete do modelo Curso para excluir o aluno
    const resultadoCur = await Curso.delete(nome);

    // Verifica se a exclusão foi bem-sucedida
    if (resultadoCur) {
      res.redirect('/api/cursos'); // Redireciona para a página de visualização de cursos após a exclusão
    } else {
      res.status(404).send('Curso não encontrado'); // Retorna erro se o curso não for encontrado
    }
  } catch (error) {
    console.error('Erro ao excluir curso:', error);
    res.status(500).send('Erro ao excluir curso');
  }
});

module.exports = router;
