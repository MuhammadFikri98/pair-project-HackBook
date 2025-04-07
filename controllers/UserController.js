const { User } = require("../models");
const bcryptjs = require("bcryptjs");

class UserController {
  static loginForm(req, res) {
    res.render("login-form");
  }

  static registerForm(req, res) {
    res.render("register-form");
  }
  static postRegister(req, res) {
    console.log(req.body);
    const { email, password, role } = req.body;

    User.create({ email, password, role })
      .then((newUser) => {
        res.redirect("/login");
      })
      .catch((err) => res.send(err));
  }
}

module.exports = UserController;
