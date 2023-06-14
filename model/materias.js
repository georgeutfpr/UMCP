const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/postgres");

// Cria a tabela 'Materia' com o Model
const MateriaModel = sequelize.define('materia', {
  codigo: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING
  },
  professor: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false // Desabilita os campos de timestamps
});

// Sincroniza com o BD
MateriaModel.sync({ alter: true }); // Atualiza o BD
console.log("A tabela materias foi atualizada!");

// Exporta as funções do Modelo
module.exports = {
  // SELECT dos dados da tabela
  list: async function() {
    const mat = await MateriaModel.findAll();
    return mat;
  },

  // INSERT de dados na tabela
  save: async function(codigo, nome, professor) {
    console.log("Dados recebidos:", codigo, nome);
    const matins = await MateriaModel.create({
      codigo: codigo,
      nome: nome,
      professor: professor
    });
    return matins;
  },

  // Método para exclusão de dados
  delete: async function(nome) {
    try {
      // Encontra o departamento pela sigla
      const materia = await MateriaModel.findOne({ where: { nome: nome } });

      if (!materia) {
        throw new Error('Materia não encontrado');
      }

      // Exclui o departamento
      await materia.destroy();

      // Retorna true para indicar que a exclusão foi bem-sucedida
      return true;
    } catch (error) {
      console.error("Erro ao excluir materia:", error);
      throw error;
    }
  },

  // Exporta o Model
  Model: MateriaModel
};
