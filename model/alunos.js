const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/postgres")
const Curso = require('./cursos');

//Cria a tabela 'Alunos' com o Model
const AlunoModel = sequelize.define('aluno', {
  ra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  nome: { type: DataTypes.STRING },
  periodo: { type: DataTypes.INTEGER },
  turno: { type: DataTypes.STRING(10) },
}, {
  timestamps: false // Desabilita os campos de timestamps
});

// Relação de chave estrangeira com a tabela cursos
AlunoModel.belongsTo(Curso.Model, {
  foreignKey: 'curso',
  as: 'cursoAssociado' // Renomeie a associação para evitar colisão de nomes
});
Curso.Model.hasMany(AlunoModel, {
  foreignKey: 'curso',
  as: 'alunosAssociados' // Renomeie a associação para evitar colisão de nomes
});

//Sincroniza com o BD
  AlunoModel.sync({ alter: true }); //Atualiza o BD
  console.log("A tabela alunos foi atualizada!");

//Exporta as funções do Modelo
module.exports = {

  // SELECT dos dados da tabela
  list: async function() {
    const alunos = await AlunoModel.findAll();
    return alunos;
  },

  // INSERT de dados na tabela
  save: async function(ra, nome, curso, periodo, turno) {
    try {
      const aluno = await AlunoModel.create({
        ra: ra,
        nome: nome,
        curso: curso,
        periodo: periodo,
        turno: turno
      });
      return aluno;
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      throw error;
    }
  },

  // DELETE de dados na tabela
  delete: async function(ra) {
    try {
      // Encontra o aluno pelo RA
      const aluno = await AlunoModel.findOne({ where: { ra: ra } });

      if (!aluno) {
        throw new Error('Aluno não encontrado');
      }

      // Exclui o aluno
      await aluno.destroy();

      // Retorna true para indicar que a exclusão foi bem sucedida
      return true;
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      throw error;
    }
  },

  //UPDATE de dados na tabela
  update: async function(ra, nome, curso, periodo, turno) {
    try {
      // Encontra o aluno pelo RA
      const aluno = await AlunoModel.findOne({ where: { ra: ra } });

      if (!aluno) {
        throw new Error('Aluno não encontrado');
      }

      // Atualiza os dados do aluno
      aluno.nome = nome;
      aluno.curso = curso;
      aluno.periodo = periodo;
      aluno.turno = turno;
      // Como são mais de um campo para atualização, se usa o método 'save'
      await aluno.save();

      // Retorna o aluno atualizado
      return aluno;
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      throw error;
    }
  },

  //Exporta o Model
  Model: AlunoModel
}
