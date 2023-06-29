const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/postgres")
const Curso = require("./cursos");

//Cria a tabela "Alunos" com o Model
const AlunoModel = sequelize.define("aluno", {
  ra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  nome: { type: DataTypes.STRING },
}, {
  timestamps: false // Desabilita os campos de timestamps
});

// Relação de chave estrangeira com a tabela cursos
AlunoModel.belongsTo(Curso.Model, {
  foreignKey: "curso",
  as: "cursoAssociado"
});
Curso.Model.hasMany(AlunoModel, {
  foreignKey: "curso",
  as: "alunosAssociados"
});

//Sincroniza com o BD
AlunoModel.sync({ alter: true }); //Atualiza o BD
console.log("A tabela alunos foi atualizada!");

//Exporta as funções do Modelo
module.exports = {

  // SELECT dos dados da tabela
  list: async function(page) {
    const pageSize = 5; // Número de registros por página
    const offset = (page - 1) * pageSize; // Cálculo do deslocamento (offset) com base no número da página
    const alunos = await AlunoModel.findAll({
      limit: pageSize,
      offset: offset
    });
    return alunos;
  },

  // INSERT de dados na tabela
  save: async function(ra, nome, curso) {
    try {
      const aluno = await AlunoModel.create({
        ra: ra,
        nome: nome,
        curso: curso
      });
      return aluno;
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      throw error;
    }
  },

  // UPDATE de dados na tabela
  update: async function(ra, nome, curso) {
    try {
      const aluno = await AlunoModel.findOne({
        where: { ra: ra }
      });
      if (aluno) {
        aluno.nome = nome;
        aluno.curso = curso;
        await aluno.save();
        return aluno;
      } else {
        throw new Error("Aluno não encontrado");
      }
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      throw error;
    }
  },

  // DELETE de dados na tabela
  delete: async function(ra) {
    try {
      const aluno = await AlunoModel.findOne({ where: { ra: ra } });
      if (!aluno) {
        throw new Error("Aluno não encontrado");
      }
      await aluno.destroy();
      return aluno;
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      throw error;
    }
  },

  //Exporta o Model
  Model: AlunoModel
};
