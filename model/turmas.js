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
TurmaModel.sync({ alter: true }); // Atualiza o BD
console.log("A tabela turmas foi atualizada!");

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

  // Método para exclusão de dados
  delete: async function(codigo) {
    try {
      // Encontra o departamento pela sigla
      const turma = await TurmaModel.findOne({ where: { codigo: codigo } });

      if (!codigo) {
        throw new Error('Codigo não encontrado');
      }

      // Exclui o departamento
      await turma.destroy();

      // Retorna true para indicar que a exclusão foi bem-sucedida
      return true;
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
      throw error;
    }
  },

  // Exporta o Model
  Model: TurmaModel
};
