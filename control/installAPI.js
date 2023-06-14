const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/postgres");

const AlunoModel = require('../model/alunos');
const MateriaModel = require('../model/materias');
const TurmaModel = require('../model/turmas');
const CursoModel = require('../model/cursos');
const DepartamentoModel = require('../model/departamentos');

router.get('/', async (req, res) => {
    await sequelize.sync({ force: true });

    let departamento01 = await DepartamentoModel.save('DECOM', 'Departamento de Computacao');
    let departamento02 = await DepartamentoModel.save('DESOF', 'Departamento de Software');
    let departamento03 = await DepartamentoModel.save('DEADS', 'Departamento de ADS');
    let departamento04 = await DepartamentoModel.save('DEMAT', 'Departamento de Matematica');
    let departamento05 = await DepartamentoModel.save('DEBLG', 'Departamento de Biologia');

    let curso01 = await CursoModel.save('Computacao', departamento01.nome);
    let curso02 = await CursoModel.save('Software', departamento02.nome);
    let curso03 = await CursoModel.save('ADS', departamento03.nome);
    let curso04 = await CursoModel.save('Matematica', departamento04.nome);
    let curso05 = await CursoModel.save('Biologia', departamento05.nome);

    let aluno01 = await AlunoModel.save(2000, "George", curso01.nome, 1, "Manha");
    let aluno02 = await AlunoModel.save(2001, "Remy", curso05.nome, 3, "Tarde");
    let aluno03 = await AlunoModel.save(2002, "Maria", curso03.nome, 2, "Noite");
    let aluno04 = await AlunoModel.save(2003, "Guilherme", curso01.nome, 4, "Manha");
    let aluno05 = await AlunoModel.save(2004, "Neide", curso04.nome, 3, "Manha");
    let aluno06 = await AlunoModel.save(2005, "Pedro", curso02.nome, 3, "Noite");

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
    let cursos = [curso01, curso02, curso03, curso04, curso05];
    let departamentos = [departamento01, departamento02, departamento03, departamento04, departamento05];

    res.json({ status: true, alunos: alunos, materias: materias, turmas: turmas, cursos: cursos, departamentos: departamentos });
});

module.exports = router;
