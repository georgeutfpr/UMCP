// Sequelize (Conexão com o BD)
const Sequelize = require("sequelize");
// Conecta com o BD
const sequelize = new Sequelize("UMCP", "postgres", "senha123", { //Ou usuario = host, root(?)
  host: "localhost",
  dialect: "postgres"
});

sequelize
  .authenticate()
  .then(() => console.log("Conectado ao PostgreSQL!"))
  .catch(error => console.log(error));

module.exports = sequelize;
