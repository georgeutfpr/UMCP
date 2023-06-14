const express = require('express');
const router = express.Router();
const DepartamentoModel = require('../model/departamentos');

// Rota para listar todos os departamento
router.get('/departamentos', async (req, res) => {
  try {
    const departamentos = await DepartamentoModel.list();
    res.json(departamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar departamentos' });
  }
});

// Rota para cadastrar um novo departamento
router.post('/departamentos', async (req, res) => {
  const { nome } = req.body;

  try {
    const departamento = await DepartamentoModel.save(nome);
    res.json(departamento);
  } catch (error) {
    console.log("Erro ao cadastrar departamento:", error);
    res.status(500).json({ error: 'Erro ao cadastrar departamento' });
  }
});

module.exports = router;
