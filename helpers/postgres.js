// Sequelize (Conexão com o BD)
const Sequelize = require("sequelize");
// Conecta com o BD
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER_1, process.env.DB_PASSWORD_1, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

sequelize
  .authenticate()
  .then(() => console.log("Conectado ao PostgreSQL!"))
  .catch(error => console.log(error));

module.exports = sequelize;
