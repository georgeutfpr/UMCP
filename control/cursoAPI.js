const express = require('express');
const router = express.Router();
const CursoModel = require('../model/cursos');

// Rota para listar todos os cursos
router.get('/cursos', async (req, res) => {
  try {
    const cursos = await CursoModel.list();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cursos' });
  }
});

// Rota para cadastrar um novo curso
router.post('/cursos', async (req, res) => {
  const { nome, departamento } = req.body;

  try {
    const curso = await CursoModel.save(nome, departamento);
    res.json(curso);
  } catch (error) {
    console.log("Erro ao cadastrar curso:", error);
    res.status(500).json({ error: 'Erro ao cadastrar curso' });
  }
});

module.exports = router;
