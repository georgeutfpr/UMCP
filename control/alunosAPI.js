const express = require("express");
const router = express.Router();
const {sucess, fail} = require("../helpers/resposta")
const Aluno = require("../model/alunos");

router.get("/list/:page", async (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const alunos = await Aluno.list(page);
  res.json(sucess(alunos, "alunos"));
});

router.post("/insert", async (req, res) => {
  try {
    const { ra, nome, curso } = req.body;
    const aluno = await Aluno.save(ra, nome, curso);
    res.status(201).json({ message: "Aluno criado com sucesso", aluno });
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    res.status(500).json({ error: "Erro ao criar aluno" });
  }
});

router.put("/update/:ra", async (req, res) => {
  try {
    const ra = req.params.ra;
    const { nome, curso } = req.body;
    const alunoAtualizado = await Aluno.update(ra, nome, curso);
    res.status(200).json({ message: "Aluno atualizado com sucesso", aluno: alunoAtualizado });
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    res.status(500).json({ error: "Erro ao atualizar aluno" });
  }
});

router.delete("/delete/:ra", async (req, res) => {
  try {
    const ra = req.params.ra;
    const alunoExcluido = await Aluno.delete(ra);
    res.json({ message: "Aluno excluído com sucesso", aluno: alunoExcluido });
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    res.status(500).json({ error: "Erro ao excluir aluno" });
  }
});

module.exports = router;
