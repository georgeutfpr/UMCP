const express = require('express');
const router = express.Router();
const Materia = require('../model/materias');

// Rota para visualizar todas as matérias
router.get('/materias', async (req, res) => {
  const materias = await Materia.list();
  res.render('materiasView', { materias });
});

// Rota para exibir o formulário de inserir matéria
router.get('/materias/form', (req, res) => {
  res.render('materiaForm');
});

// Rota para processar o formulário de inserir matéria
router.post('/materias', async (req, res) => {
  const { codigo, nome } = req.body;

  try {
    const materia = await Materia.save(codigo, nome);
    res.redirect('/api/materias'); // Redireciona para a página de visualização de matérias
  } catch (error) {
    console.error("Erro ao cadastrar matéria:", error);
    res.status(500).json({ error: 'Erro ao cadastrar matéria' });
  }
});

// Rota para exibir o formulário de deletar matéria
router.get('/materias/delete', async (req, res) => {
  try {
    // Buscar todas as matérias para popular o select no formulário
    const materias = await Materia.list();
    // Renderizar o arquivo deleteMaterias.mustache com as matérias
    res.render('deleteMaterias', { materias: materias });
  } catch (error) {
    console.error("Erro ao carregar a página:", error);
    res.status(500).send("Erro ao carregar a página");
  }
});

// Rota para processar o formulário de deletar matéria
router.post('/materias/delete', async (req, res) => {
  try {
    const nome = req.body.nome; // Obtém o nome da matéria a ser excluída
    // Chama a função delete do modelo Materias para excluir a matéria
    const resultadoMat = await Materia.delete(nome);

    // Verifica se a exclusão foi bem-sucedida
    if (resultadoMat) {
      res.redirect('/api/materias'); // Redireciona para a página de visualização de matérias após a exclusão
    } else {
      res.status(404).send('Materia não encontrada'); // Retorna erro se a matéria não for encontrada
    }
  } catch (error) {
    console.error('Erro ao excluir materia:', error);
    res.status(500).send('Erro ao excluir materia');
  }
});

module.exports = router;
