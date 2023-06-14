const express = require('express');
const router = express.Router();
const TurmaModel = require('../model/turmas');

// Rota para listar todas as turmas
router.get('/turmas', async (req, res) => {
  try {
    const turmas = await TurmaModel.list();
    res.json(turmas);
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
});

// Rota para cadastrar uma nova turma
router.post('/turmas', async (req, res) => {
  const { codigo, nome, alunos_RA, materia_codigo } = req.body;

  try {
    const turma = await TurmaModel.save(codigo, nome, alunos_RA, materia_codigo);
    if (!turma) {
      res.status(400).json({ error: 'Turma não encontrado' });
    }
    res.json(turma);
  } catch (error) {
    console.error("Erro ao cadastrar turma:", error);
    res.status(500).json({ error: 'Erro ao cadastrar turma' });
  }
});

module.exports = router;
