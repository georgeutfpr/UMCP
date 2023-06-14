const express = require('express');
const router = express.Router();
const MateriaModel = require('../model/materias');

// Rota para listar todas as matérias
router.get('/materias', async (req, res) => {
  try {
    const materias = await MateriaModel.list();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar matérias' });
  }
});

// Rota para cadastrar uma nova matéria
router.post('/materias', async (req, res) => {
  const { codigo, nome } = req.body;

  try {
    const materia = await MateriaModel.save(codigo, nome);
    res.json(materia);
  } catch (error) {
    console.log("Erro ao cadastrar matéria:", error);
    res.status(500).json({ error: 'Erro ao cadastrar matéria' });
  }
});

module.exports = router;
