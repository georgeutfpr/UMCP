const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/postgres");

const AlunoModel = require('../model/alunos');
const MateriaModel = require('../model/materias');
const TurmaModel = require('../model/turmas');
const CursoModel = require('../model/cursos');

router.get('/', async (req, res) => {
    await sequelize.sync({ force: true });

    let curso01 = await CursoModel.save('Computacao');
    let curso02 = await CursoModel.save('Software');
    let curso03 = await CursoModel.save('ADS');
    let curso04 = await CursoModel.save('Matematica');

    let aluno01 = await AlunoModel.save(2000, "George", curso01.nome, 1, "Manha");
    let aluno02 = await AlunoModel.save(2001, "Pedro", curso02.nome, 3, "Noite");
    let aluno03 = await AlunoModel.save(2002, "Maria", curso03.nome, 2, "Noite");
    let aluno04 = await AlunoModel.save(2003, "Guilherme", curso01.nome, 4, "Manha");
    let aluno05 = await AlunoModel.save(2004, "Neide", curso04.nome, 3, "Manha");

    let materia01 = await MateriaModel.save("AS63A", "Programacao Web BackEnd");
    let materia02 = await MateriaModel.save("EC35B", "Banco de Dados 2");
    let materia03 = await MateriaModel.save("MT22A", "Calculo Aplicado");
    let materia04 = await MateriaModel.save("EC35A", "Teoria da Computacao");
    let materia05 = await MateriaModel.save("AS63C", "Desenvolvimento Agil");

    let turma01_1 = await TurmaModel.save("C51", "Turma A", aluno01.ra, materia03.codigo);
    let turma01_2 = await TurmaModel.save("C51", "Turma A", aluno02.ra, materia03.codigo);
    let turma02_1 = await TurmaModel.save("D51", "Turma F", aluno03.ra, materia05.codigo);
    let turma03_1 = await TurmaModel.save("M12", "Turma C", aluno04.ra, materia02.codigo);
    let turma03_2 = await TurmaModel.save("M12", "Turma C", aluno05.ra, materia02.codigo);
    let turma04_1 = await TurmaModel.save("S50", "Turma B", aluno01.ra, materia01.codigo);
    let turma05_1 = await TurmaModel.save("C51", "Turma B", aluno03.ra, materia04.codigo);

    let alunos = [aluno01, aluno02, aluno03, aluno04, aluno05];
    let materias = [materia01, materia02, materia03, materia04, materia05];
    let turmas = [turma01_1, turma01_2, turma02_1, turma03_1, turma03_2, turma04_1, turma05_1];

    res.json({ status: true, alunos: alunos, materias: materias, turmas: turmas });
});

module.exports = router;
