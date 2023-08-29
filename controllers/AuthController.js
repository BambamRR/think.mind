const chalk = require("chalk");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class UserController {
  static async register(req, res) {
    res.render("auth/register");
  }
  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    console.log("SENHA:" + password);
    if (password != confirmpassword) {
      req.flash("message", "As senhas não conferem!, tente novamente");
      res.render("auth/register");

      return;
    }

    const userExists = await User.findOne({ raw: true, where: { email: email } });
    if (userExists) {
      req.flash("message", "Usuário com email cadastrado já existe");
      res.render("auth/register");

      return;
    }

    //senha
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    console.log("SENHA CRIPTO:" + hashedPassword);

    const user = {
      name,
      email,
      password: hashedPassword,
    };
    await User.create(user)
      .then((user) => {
        req.session.userid = user.id;

        req.session.save(() => {
          res.redirect("/");
        });
      })
      .catch((error) => {
        console.log(chalk.bgRed.black("Erro ao salvar sessão", error));
      });
  }
  static async login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    //find user
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash("message", "Usuário ou Senha incorretos");
      res.render("auth/login");

      return;
    }
    //check if passwords match

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash("message", "Usuário ou Senha incorretos");
      res.render("auth/login");

      return;
    }

    //initialize session

    try {
      req.session.userid = user.id;

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log("Erro ao autenticar: " + error);
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }
};
