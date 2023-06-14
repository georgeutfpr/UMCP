const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/postgres");
const Aluno = require('./alunos');
const Curso = require('./cursos');

const DadosAlunosModel = sequelize.define('DadosAlunos', {
  ra: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'DadosAlunos',
  modelName: 'DadosAlunosModel'
});

//Sincroniza com o BD
  DadosAlunosModel.sync({ alter: true }); //Atualiza o BD
  console.log("A view foi atualizada!");

module.exports = {
  // SELECT dos dados da view
  list: async function() {
    try {
      const result = await sequelize.query('SELECT ra, departamento FROM DadosAlunos', { type: sequelize.QueryTypes.SELECT });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //INSERT de dados na view
  save: async function(ra, departamento) {
    try {
      const viewins = await DadosAlunosModel.create({
        ra: ra,
        departamento: departamento
      });
      return viewins;
    } catch (error) {
      console.error("Erro ao salvar departamento:", error);
      throw error;
    }
  },

  Model: DadosAlunosModel
};
