const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/postgres");
const bcrypt = require("bcrypt");

const UserModel = sequelize.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  timestamps: false
});

UserModel.sync({ alter: true });
console.log("A tabela users foi atualizada!");

module.exports = {

  create: async function (name, username, password, isAdmin) {
    console.log("Dados recebidos:", name, username, password, isAdmin);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        name: name,
        username: username,
        password: hashedPassword,
        isAdmin: isAdmin
      });
      return newUser;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  },

  update: async function(id, name, username, password, isAdmin) {
    console.log("Dados recebidos:", name, username, password, isAdmin);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.findByPk(id);
      if (user) {
        user.name = name;
        user.username = username;
        user.password = hashedPassword;
        user.isAdmin = isAdmin;
        await user.save();
        return user;
      } else {
        throw new Error("Usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  },

  delete: async function (id) {
    try {
      const user = await UserModel.findByPk(id);
      if (user) {
        await user.destroy();
        return true;
      } else {
        throw new Error("Usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }
  },

  Model: UserModel
};
