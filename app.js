//Config
//Gerais
const path = require("path");
require("dotenv").config();
//Express
const express = require("express");
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));
//Session
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
  })
);
//Passport
const passport = require("passport");
const configPassport = require("./helpers/auth");
configPassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
//Sequelize
const sequelize = require("./helpers/postgres");
//API
app.use("/api/alunos", require("./control/alunosAPI"))
app.use("/api/departamentos", require("./control/departamentosAPI"))
app.use("/api/cursos", require("./control/cursosAPI"))
app.use("/api/users", require("./control/usersAPI"));
app.use("/install", require("./control/installAPI"))

app.listen(3000, () => {
  console.log("Listenning...")
})
