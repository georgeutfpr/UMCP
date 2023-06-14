const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/postgres")

//Cria a tabela 'Departamentos' com o Model
const DepartamentoModel = sequelize.define('departamento', {
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
      const departamentoins = await DepartamentoModel.create({
        sigla: sigla,
        nome: nome
      });
      return departamentoins;
    } catch (error) {
      console.error("Erro ao salvar departamento:", error);
      throw error;
    }
  },

  //UPDATE de dados na tabela
  update: async function(sigla, nome) {
    try {
      // Encontra o departamento pela sigla
      const departamento = await DepartamentoModel.findOne({ where: { sigla: sigla } });

      if (!departamento) {
        throw new Error('Departamento não encontrado');
      }

      // Atualiza os dados do departamento
      departamento.sigla = sigla;
      departamento.nome = nome;
      // Como são mais de um campo para atualização, se usa o método 'save'
      await departamento.save();

      // Retorna o departamento atualizado
      return departamento;
    } catch (error) {
      console.error("Erro ao atualizar departamento:", error);
      throw error;
    }
  },

  // DELETE de dados na tabela
  delete: async function(nome) {
    try {
      // Encontra o departamento pela sigla
      const departamento = await DepartamentoModel.findOne({ where: { nome: nome } });

      if (!departamento) {
        throw new Error('Departamento não encontrado');
      }

      // Exclui o departamento
      await departamento.destroy();

      // Retorna true para indicar que a exclusão foi bem-sucedida
      return true;
    } catch (error) {
      console.error("Erro ao excluir departamento:", error);
      throw error;
    }
  },

  //Exporta o Model
  Model: DepartamentoModel
}
