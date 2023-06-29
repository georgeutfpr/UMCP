const express = require("express");
const router = express.Router();
const {sucess, fail} = require("../helpers/resposta")
const Curso = require("../model/cursos");

router.get("/list", async (req, res) => {
  const cursos = await Curso.list();
  res.json(sucess(cursos, "cursos"))
});

router.post("/insert", async (req, res) => {
  try {
    const { nome, departamento } = req.body;
    const curso = await Curso.save(nome, departamento);
    res.status(201).json({ message: "Curso criado com sucesso", curso });
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    res.status(500).json({ error: "Erro ao criar curso" });
  }
});

router.put("/update/:nome", async (req, res) => {
  try {
    const nome = req.params.nome;
    const { departamento } = req.body;
    const cursoAtualizado = await Curso.update(nome, departamento);
    res.status(200).json({ message: "Curso atualizado com sucesso", curso: cursoAtualizado });
  } catch (error) {
    console.error("Erro ao atualizar curso:", error);
    res.status(500).json({ error: "Erro ao atualizar curso" });
  }
});

router.delete("/delete/:nome", async (req, res) => {
  try {
    const nome = req.params.nome;
    const cursoExcluido = await Curso.delete(nome);
    res.json({ message: "Curso excluído com sucesso", curso: cursoExcluido });
  } catch (error) {
    console.error("Erro ao excluir curso:", error);
    res.status(500).json({ error: "Erro ao excluir curso" });
  }
});

module.exports = router;
