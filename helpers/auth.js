const createUserModel = require("../model/users");
const UserModel = createUserModel.Model;
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcrypt");

module.exports = function(passport) {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UserModel.findOne({ where: { username } });
      if (!user) {
        return done(null, false, { message: "Username invalido" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: "Senha invalida" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
