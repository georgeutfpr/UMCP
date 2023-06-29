const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/postgres");

const AlunoModel = require("../model/alunos");
const CursoModel = require("../model/cursos");
const DepartamentoModel = require("../model/departamentos");
const UserModel =  require("../model/users");

router.get("/", async (req, res) => {
  await sequelize.sync({ force: true });

  let departamento01 = await DepartamentoModel.save("DECOM", "Departamento de Computacao");
  let departamento02 = await DepartamentoModel.save("DESOF", "Departamento de Software");
  let departamento03 = await DepartamentoModel.save("DEADS", "Departamento de ADS");
  let departamento04 = await DepartamentoModel.save("DEMAT", "Departamento de Matematica");
  let departamento05 = await DepartamentoModel.save("DEBLG", "Departamento de Biologia");

  let curso01 = await CursoModel.save("Computacao", departamento01.sigla);
  let curso02 = await CursoModel.save("Software", departamento02.sigla);
  let curso03 = await CursoModel.save("ADS", departamento01.sigla);
  let curso04 = await CursoModel.save("Matematica", departamento04.sigla);
  let curso05 = await CursoModel.save("Biologia", departamento05.sigla);

  let aluno01 = await AlunoModel.save(2000, "George", curso01.nome);
  let aluno02 = await AlunoModel.save(2001, "Remy", curso05.nome);
  let aluno03 = await AlunoModel.save(2002, "Maria", curso03.nome);
  let aluno04 = await AlunoModel.save(2003, "Guilherme", curso01.nome);
  let aluno05 = await AlunoModel.save(2004, "Neide", curso04.nome);
  let aluno06 = await AlunoModel.save(2005, "Pedro", curso02.nome);

  let admin = await UserModel.create("Admin", "admin", "admin", true);
  let georg = await UserModel.create("George", "george", "giba", false);

  let departamentos = [departamento01, departamento02, departamento03, departamento04, departamento05];
  let cursos = [curso01, curso02, curso03, curso04, curso05];
  let alunos = [aluno01, aluno02, aluno03, aluno04, aluno05, aluno06];
  let users = [admin, georg];

  res.json({ status: true, departamentos: departamentos, cursos: cursos, alunos: alunos, users: users });
});

module.exports = router;
