const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/postgres");

// Cria a tabela 'Cursos' com o Model
const CursoModel = sequelize.define('curso', {
  nome: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
  }, {
    timestamps: false
  }); // Desabilita os campos de timestamps

// Sincroniza com o BD
CursoModel.sync({ alter: true }); // Atualiza o BD
console.log("A tabela cursos foi atualizada!");

// Exporta as funções do Modelo
module.exports = {
  // SELECT dos dados da tabela
  list: async function() {
    const curso = await CursoModel.findAll();
    return curso;
  },
  // INSERT de dados na tabela
  save: async function(nome) {
    console.log("Dados recebidos:", nome);
    const cursoins = await CursoModel.create({
      nome: nome
    });
    return cursoins;
  },
  // Exporta o Model
  Model: CursoModel
};
