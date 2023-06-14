const express = require('express');
const router = express.Router();
const DadosAlunos = require('../model/dadosAlunos');

// Rota para visualizar todos os dados da view
router.get('/view', async (req, res) => {
  const dadosView = await DadosAlunos.list();
  res.render('viewView', { dadosView: dadosView });
});

// Rota para exibir o formulário de inserir dados na view
router.get('/view/form', async (req, res) => {
  try {
    // Obtenha todos os departamentos cadastrados
    const departamentos = await Departamento.list();

    // Renderize o template com os departamentos
    res.render('viewForm', { departamentos });
  } catch (error) {
    console.error("Erro ao carregar departamentos:", error);
    res.status(500).send("Erro ao carregar departamentos");
  }
});

// Rota para processar o formulário de inserir dados na view
router.post('/views', async (req, res) => {
  const { ra, departamento } = req.body;

  try {
    const view = await DadosAlunos.save(ra, departamento);
    res.redirect('/api/view'); // Redireciona para a página de visualização
  } catch (error) {
    console.error("Erro ao registrar dados:", error);
    res.status(500).json({ error: 'Erro ao registrar dados' });
  }
});

module.exports = router;
