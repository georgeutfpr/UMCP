const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/postgres");
const Materia = require('./materias');
const Aluno = require('./alunos');

// Cria a tabela 'Turma' com o Model
const TurmaModel = sequelize.define('turma', {
  codigo: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false // Desabilita os campos de timestamps
});

// Define as associações entre os modelos
TurmaModel.belongsTo(Materia.Model, {
  foreignKey: 'materia_codigo'
});
Materia.Model.hasMany(TurmaModel, {
  foreignKey: 'materia_codigo'
});

TurmaModel.belongsTo(Aluno.Model, {
  foreignKey: 'alunos_RA'
});
Aluno.Model.hasMany(TurmaModel, {
  foreignKey: 'alunos_RA'
});

// Sincroniza com o BD
(async () => {
  try {
    // Sincroniza os modelos Materia e Aluno primeiro
    await Materia.Model.sync();
    await Aluno.Model.sync();

    // Sincroniza a tabela Turma
    await TurmaModel.sync({ force: true });
    console.log("A tabela turmas foi atualizada!");
  } catch (error) {
    console.error("Erro ao sincronizar a tabela turmas:", error);
  }
})();

// Exporta as funções do Modelo
module.exports = {
  // SELECT dos dados da tabela
  list: async function () {
    try {
      const turmas = await TurmaModel.findAll({ include: Materia.Model });
      return turmas;
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      throw error;
    }
  },
  // INSERT de dados na tabela
  save: async function (codigo, nome, alunos_RA, materia_codigo) {
    console.log("Dados recebidos:", codigo, nome, alunos_RA, materia_codigo);
    try {
      if (typeof alunos_RA === 'string' && typeof materia_codigo === 'string') {
        const obj = await Aluno.Model.findOne({ where: { ra: alunos_RA } });
        if (!obj) {
          return null;
        }
        alunos_RA = obj.ra;
      }

      const turma = await TurmaModel.create({
        codigo: codigo,
        materia_codigo: materia_codigo,
        alunos_RA: alunos_RA
      });

      return turma;
    } catch (error) {
      console.error("Erro ao cadastrar turma:", error);
      throw error;
    }
  },
  // Exporta o Model
  Model: TurmaModel
};
