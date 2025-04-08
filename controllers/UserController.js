const { User } = require("../models");
const bcrypt = require("bcryptjs");

class UserController {
  static loginForm(req, res) {
    const { error } = req.query;

    res.render("login-form", { error });
  }

  static registerForm(req, res) {
    res.render("register-form");
  }
  static postRegister(req, res) {
    // console.log(req.body);
    const { email, password, role } = req.body;

    User.create({ email, password, role })
      .then((newUser) => {
        res.redirect("/login");
      })
      .catch((err) => res.send(err));
  }

  static postLogin(req, res) {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password);

          if (isValidPassword) {
            //case berhasil login

            req.session.userId = user.id; //set session di controller login
            req.session.role = user.role;
            return res.redirect("/");
          } else {
            const error = "invalid username/password";
            return res.redirect(`/login?error=${error}`);
          }
        } else {
          const error = "invalid username/password";
          return res.redirect(`/login?error=${error}`);
        }
      })
      .catch((err) => res.send(err));
  }

  static getLogOut(req, res) {
    req.session.destroy((err) => {
      if (err) res.send(err);
      else {
        res.redirect("/login");
      }
    });
  }
}

module.exports = UserController;
