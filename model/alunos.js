const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/postgres")

//Cria a tabela 'Alunos' com o Model
const AlunoModel = sequelize.define('aluno', {
  ra: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  nome: { type: DataTypes.STRING },
  curso: { type: DataTypes.STRING(45) },
  periodo: { type: DataTypes.INTEGER },
  turno: { type: DataTypes.STRING(10) },
}, {
  timestamps: false // Desabilita os campos de timestamps
});

//Sincroniza com o BD
  AlunoModel.sync({ alter: true }); //Atualiza o BD
  console.log("A tabela alunos foi atualizada!");

//Exporta as funções do Modelo
module.exports = {
  //SELECT dos dados da tabela
  list: async function() {
    const alunos = await AlunoModel.findAll();
    return alunos;
  },
  //INSERT de dados na tabela
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
  //Exporta o Model
  Model: AlunoModel
}
