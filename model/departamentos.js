const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/postgres")

//Cria a tabela "Departamentos" com o Model
const DepartamentoModel = sequelize.define("departamento", {
  sigla: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING
  },
}, {
  timestamps: false // Desabilita os campos de timestamps
});

//Sincroniza com o BD
DepartamentoModel.sync({ alter: true }); //Atualiza o BD
console.log("A tabela departamentos foi atualizada!");

//Exporta as funções do Modelo
module.exports = {
  //SELECT dos dados da tabela
  list: async function() {
    const departamentos = await DepartamentoModel.findAll();
    return departamentos;
  },

  //INSERT de dados na tabela
  save: async function(sigla, nome) {
    try {
      const departamento = await DepartamentoModel.create({
        sigla: sigla,
        nome: nome
      });
      return departamento;
    } catch (error) {
      console.error("Erro ao salvar departamento:", error);
      throw error;
    }
  },

  // UPDATE de dados na tabela
  update: async function(sigla, nome) {
    try {
      const departamento = await DepartamentoModel.findOne({
        where: { sigla: sigla }
      });
      if (departamento) {
        departamento.sigla = sigla;
        departamento.nome = nome;
        await departamento.save();
        return departamento;
      } else {
        throw new Error("Departamento não encontrado");
      }
    } catch (error) {
      console.error("Erro ao salvar departamento:", error);
      throw error;
    }
  },

  // DELETE de dados na tabela
  delete: async function(sigla) {
    try {
      const departamento = await DepartamentoModel.findOne({ where: { sigla: sigla } });
      if (!departamento) {
        throw new Error("Departamento não encontrado");
      }
      await departamento.destroy();
      return departamento;
    } catch (error) {
      console.error("Erro ao excluir departamento:", error);
      throw error;
    }
  },

  //Exporta o Model
  Model: DepartamentoModel
};
