const express = require("express");
const router = express.Router();
const User = require("../model/users");
const passport = require("passport");
const jwt = require("jsonwebtoken");

/*
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token de autenticação não fornecido" });
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET);
    req.userId = payload.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token de autenticação inválido" });
  }
};
*/

router.post("/create", async (req, res, next) => {
  const { name, username, password, isAdmin } = req.body;
  try {
    const newUser = await User.create(name, username, password, isAdmin);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
});

router.put("/update/:id",/* authenticate,*/ async (req, res, next) => {
  const userId = req.params.id;
  const { name, username, password, isAdmin } = req.body;
  try {
    /*if (!req.user.isAdmin) {
      res.status(403).json({ message: "Acesso não autorizado" });
      return;
    }*/
    const userAtualizado = await User.update(userId, name, username, password, isAdmin);
    res.status(200).json(userAtualizado);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id",/* authenticate,*/ async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deleted = await User.delete(userId);
    res.json({ success: deleted });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
