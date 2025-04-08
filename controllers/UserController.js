const { Post, User, Tag, UserProfile, Post_Tag } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

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

  static async home(req, res) {
    try {
      let { error, search } = req.query;

      let post = await Post.findPost(search, Op);

      res.render("home", { post, session: req.session, error });
    } catch (error) {
      res.send(error);
    }
  }

  static async addPost(req, res) {
    try {
      const { title, content, imgUrl } = req.body;
      const UserId = req.session.userId;

      await Post.create({
        title,
        content,
        imgUrl,
        like: 0,
        UserId,
      });

      res.redirect("/");
    } catch (error) {
       if (error.name === "SequelizeValidationError") {
        let msg = error.errors.map((el) => el.message);
        res.redirect(`/?error=${msg}`);
      } else {
        res.send(error);
      }
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      await Post.destroy({ where: { id } });
      res.redirect("/");
    } catch (err) {
      res.send(err);
    }
  }

  static async profile(req, res) {
    try {
      // console.log(req.params);
      let { id } = req.params;

      let user = await User.findByPk(id, {
        include: [
          UserProfile,
          {
            model: Post,
            order: [["createdAt", "DESC"]],
          },
        ],
      });
      // console.log(user);

      res.render("profile", { user });
    } catch (error) {
      res.send(error);
    }
  }

  static async addBio(req, res) {
    try {
      console.log(req.body);
      console.log(req.params);

      const { id } = req.params;
      const { bio } = req.body;

      // apakah profil user sudah ada
      const userProfile = await UserProfile.findOne({ where: { UserId: id } });

      if (userProfile) {
        // Update bio
        await userProfile.update({ bio });
      } else {
        // Buat bio baru
        await UserProfile.create({ bio, UserId: id });
      }

      res.redirect(`/profile/${id}`);
    } catch (err) {
      res.send(err);
    }
  }

  static async addLike(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id);

      await post.increment("like");

      res.redirect("/");
    } catch (err) {
      res.send(err);
    }
  }
}

module.exports = UserController;
