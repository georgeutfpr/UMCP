const express = require('express');
const router = express.Router();
const AlunoModel = require('../model/alunos');

// Rota para listar todos os alunos
router.get('/alunos', async (req, res) => {
  try {
    const alunos = await AlunoModel.list();
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// Rota para cadastrar um novo aluno
router.post('/alunos', async (req, res) => {
  const { ra, nome, curso, periodo, turno } = req.body;

  try {
    const aluno = await AlunoModel.save(ra, nome, curso, periodo, turno);
    res.json(aluno);
  } catch (error) {
    console.log("Erro ao cadastrar aluno:", error);
    res.status(500).json({ error: 'Erro ao cadastrar aluno' });
  }
});

module.exports = router;
