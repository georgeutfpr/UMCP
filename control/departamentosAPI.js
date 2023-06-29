const express = require("express");
const router = express.Router();
const {sucess, fail} = require("../helpers/resposta")
const Departamento = require("../model/departamentos");

router.get("/list", async (req, res) => {
  const departamentos = await Departamento.list();
  res.json(sucess(departamentos, "departamentos"))
});

router.post("/insert", async (req, res) => {
  try {
    const { sigla, nome } = req.body;
    const departamento = await Departamento.save(sigla, nome);
    res.status(201).json({ message: "Departamento criado com sucesso", departamento });
  } catch (error) {
    console.error("Erro ao criar departamento:", error);
    res.status(500).json({ error: "Erro ao criar departamento" });
  }
});

router.put("/update/:sigla", async (req, res) => {
  try {
    const sigla = req.params.sigla;
    const { nome } = req.body;
    const departamentoAtualizado = await Departamento.update(sigla, nome);
    res.status(200).json({ message: "Departamento atualizado com sucesso", departamento: departamentoAtualizado });
  } catch (error) {
    console.error("Erro ao atualizar departamento:", error);
    res.status(500).json({ error: "Erro ao atualizar departamento" });
  }
});

router.delete("/delete/:sigla", async (req, res) => {
  try {
    const sigla = req.params.sigla;
    const departamentoExcluido = await Departamento.delete(sigla);
    res.json({ message: "Departamento excluído com sucesso", departamento: departamentoExcluido });
  } catch (error) {
    console.error("Erro ao excluir departamento:", error);
    res.status(500).json({ error: "Erro ao excluir departamento" });
  }
});

module.exports = router;
