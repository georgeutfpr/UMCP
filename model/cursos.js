const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/postgres");
const Departamento = require("./departamentos");

// Cria a tabela "Cursos" com o Model
const CursoModel = sequelize.define("curso", {
  nome: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  }
}, {
    timestamps: false
}); // Desabilita os campos de timestamps

// Relação de chave estrangeira com a tabela Departamentos
CursoModel.belongsTo(Departamento.Model, {
  foreignKey: "departamento",
  as: "departamentoAssociado"
});
Departamento.Model.hasMany(CursoModel, {
  foreignKey: "departamento",
  as: "cursoAssociados"
});

// Sincroniza com o BD
CursoModel.sync({ alter: true }); // Atualiza o BD
console.log("A tabela cursos foi atualizada!");

// Exporta as funções do Modelo
module.exports = {
  // SELECT dos dados da tabela
  list: async function() {
    const cursos = await CursoModel.findAll();
    return cursos;
  },

  // INSERT de dados na tabela
  save: async function(nome, departamento) {
    //console.log("Dados recebidos:", nome, departamento);
    try {
      const curso = await CursoModel.create({
        nome: nome,
        departamento: departamento
      });
      return curso;
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      throw error;
    }
  },

  // UPDATE de dados na tabela
  update: async function(nome, departamento) {
    try {
      const curso = await CursoModel.findOne({
        where: { nome: nome }
      });
      if (curso) {
        curso.nome = nome;
        curso.departamento = departamento;
        await curso.save();
        return curso;
      } else {
        throw new Error("Curso não encontrado");
      }
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      throw error;
    }
  },

  // DELETE de dados na tabela
  delete: async function(nome) {
    try {
      const curso = await CursoModel.findOne({ where: { nome: nome } });
      if (!curso) {
        throw new Error("Curso não encontrado");
      }
      await curso.destroy();
      return curso;
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      throw error;
    }
  },

  // Exporta o Model
  Model: CursoModel
};
