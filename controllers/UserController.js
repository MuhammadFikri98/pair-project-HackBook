const { User } = require("../models");
const bcryptjs = require("bcryptjs");

class UserController {
  static loginForm(req, res) {
    res.render("login-form");
  }

  static registerForm(req, res) {
    console.log(req.body);

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
    console.log(req.body);

    const { email, password } = req.body;
    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password);

          if (isValidPassword) {
            return res.redirect("/");
          } else {
            const error = "invalid username/password";
            return res.redirect(`/login?error=${error}`);
          }
        }
      })
      .catch((err) => res.send(err));
  }
}

module.exports = UserController;
