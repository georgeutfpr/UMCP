const express = require('express');
const router = express.Router();
const Departamento = require('../model/departamentos');

// Rota para visualizar todos os departamentos
router.get('/departamentos', async (req, res) => {
  const departamentos = await Departamento.list();
  res.render('departamentosView', { departamentos });
});

// Rota para exibir o formulário de inserir departamento
router.get('/departamentos/form', (req, res) => {
  res.render('departamentoForm');
});

// Rota para processar o formulário de inserir departamento
router.post('/departamentos', async (req, res) => {
  const { sigla, nome } = req.body;

  try {
    const departamento = await Departamento.save(sigla, nome);
    res.redirect('/api/departamentos'); // Redireciona para a página de visualização de departamentos
  } catch (error) {
    console.error("Erro ao cadastrar departamento:", error);
    res.status(500).json({ error: 'Erro ao cadastrar departamento' });
  }
});

// Rota para exibir o formulário de atualização de departamento
router.get('/departamentos/update', async (req, res) => {
  try {
    const departamentos = await Departamento.list(); // Obtém a lista de departamentos

    res.render('departamentoUpdate', { departamentos }); // Renderize o formulário de atualização de aluno com a lista de departamentos
  } catch (error) {
    console.error('Erro ao carregar departamentos:', error);
    res.status(500).send('Erro ao carregar departamentos');
  }
});

// Rota para processar o formulário de atualização de departamento
router.post('/departamentos/update', async (req, res) => {
  const { sigla, nome } = req.body;

  try {
    const departamentoAtualizado = await Departamento.update(sigla, nome); // Chame a função de atualização de departamento com os novos dados

    res.redirect('/api/departamentos');
  } catch (error) {
    console.error('Erro ao atualizar departamento:', error);
  }
});

// Rota para exibir o formulário de deletar departamentos
router.get('/departamentos/delete', async (req, res) => {
  try {
    // Buscar todos os departamentos para popular o select no formulário
    const departamentos = await Departamento.list();
    // Renderizar o arquivo deleteDepartamentos.mustache com os departamentos
    res.render('deleteDepartamentos', { departamentos: departamentos });
  } catch (error) {
    console.error("Erro ao carregar a página:", error);
    res.status(500).send("Erro ao carregar a página");
  }
});

// Rota para processar o formulário de deletar departamento
router.post('/departamentos/delete', async (req, res) => {
  try {
    const nome = req.body.nome; // Obtém o nome do departamento a ser excluído
    // Chama a função delete do modelo Departamentos para excluir o departamento
    const resultadoDep = await Departamento.delete(nome);

    // Verifica se a exclusão foi bem-sucedida
    if (resultadoDep) {
      res.redirect('/api/departamentos'); // Redireciona para a página de visualização de departamentos após a exclusão
    } else {
      res.status(404).send('Departamento não encontrado'); // Retorna erro se o departamento não for encontrado
    }
  } catch (error) {
    console.error('Erro ao excluir departamento:', error);
    res.status(500).send('Erro ao excluir departamento');
  }
});

module.exports = router;
