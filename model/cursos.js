const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/postgres");
const Departamento = require('./departamentos');

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

  // Relação de chave estrangeira com a tabela Departamentos
  CursoModel.belongsTo(Departamento.Model, {
    foreignKey: 'departamento',
    as: 'departamentoAssociado' // Renomeie a associação para evitar colisão de nomes
  });
  Departamento.Model.hasMany(CursoModel, {
    foreignKey: 'departamento',
    as: 'cursoAssociados' // Renomeie a associação para evitar colisão de nomes
  });

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
  //save: async function(nome, departamento) {
  //  console.log("Dados recebidos:", nome, departamento);
  //  const cursoins = await CursoModel.create({
  //    nome: nome,
  //    departamento: departamento
  //  });
  //  return cursoins;
  //},
  save: async function (nome, departamento) {
  console.log("Dados recebidos:", nome, departamento);
  try {
    let departamentoObj;

    if (typeof departamento === 'string') {
      departamentoObj = await Departamento.Model.findOne({ where: { nome: departamento } });
      if (!departamentoObj) {
        throw new Error('Departamento não encontrado');
      }
    } else {
      departamentoObj = departamento;
    }

    const curso = await CursoModel.create({
      nome: nome,
      departamento: departamentoObj.sigla
    });

    return curso;
  } catch (error) {
    console.error("Erro ao cadastrar curso:", error);
    throw error;
  }
},
  // Exporta o Model
  Model: CursoModel
};
