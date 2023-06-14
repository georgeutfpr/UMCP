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

  //UPDATE de dados na tabela
  update: async function(nome, departamento) {
    try {
      // Encontra o curso pelo nome
      const curso = await CursoModel.findOne({ where: { nome: nome } });

      if (!curso) {
        throw new Error('Curso não encontrado');
      }

      // Atualiza os dados do curso
      curso.nome = nome;
      curso.departamento = departamento;
      // Como são mais de um campo para atualização, se usa o método 'save'
      await curso.save();

      // Retorna o aluno atualizado
      return curso;
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      throw error;
    }
  },

  // Método para exclusão de dados
  delete: async function(nome) {
    try {
      // Encontra o departamento pela sigla
      const curso = await CursoModel.findOne({ where: { nome: nome } });

      if (!curso) {
        throw new Error('Curso não encontrado');
      }

      // Exclui o departamento
      await curso.destroy();

      // Retorna true para indicar que a exclusão foi bem-sucedida
      return true;
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      throw error;
    }
  },

  // Exporta o Model
  Model: CursoModel
};
