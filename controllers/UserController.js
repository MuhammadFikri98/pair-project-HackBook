const { Post, User, Tag, UserProfile, Post_Tag } = require("../models");
const { formatLike, getUsernameFromEmail } = require("../helpers/helper");
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
      let { notif, search } = req.query;

      let post = await Post.findPost(search, Op);

      // notification format
      const notification = notif
        ? `Post with Title: ${notif} has been removed`
        : null;

      res.render("home", {
        post,
        session: req.session,
        formatLike,
        getUsernameFromEmail,
        notification,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async getAddPost(req, res) {
    try {
      let { error } = req.query;

      res.render("addPost", { error });
    } catch (error) {
      res.send(error);
    }
  }

  static async addPost(req, res) {
    try {
      const { title, content } = req.body;
      const imgUrl = req.file ? req.file.path : ""; // Ambil path gambar dari file yang di-upload
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
        res.redirect(`/post?error=${msg}`);
      } else {
        res.send(error);
      }
    }
  }

  static async getEditPost(req, res) {
    try {
      // let { error } = req.query;
      // console.log(req.params);
      let { id } = req.params;

      let post = await Post.findByPk(id);

      res.render("editPost", { post });
    } catch (error) {
      res.send(error);
    }
  }

  static async editPost(req, res) {
    try {
      let { id } = req.params;
      // console.log(req.body);

      const { title, content } = req.body;
      const imgUrl = req.file ? req.file.path : ""; // Ambil path gambar dari file yang di-upload

      await Post.update({ title, content, imgUrl }, { where: { id } });

      res.redirect("/");
    } catch (error) {
      let { id } = req.params;
      if (error.name === "SequelizeValidationError") {
        let msg = error.errors.map((el) => el.message);
        res.redirect(`/edit/${id}?error=${msg}`);
      } else {
        res.send(error);
      }
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);

      await Post.destroy({ where: { id } });
      res.redirect(`/?notif=${post.title}`);
    } catch (err) {
      res.send(err);
    }
  }

  static async profile(req, res) {
    try {
      // console.log(req.params);
      let { error } = req.query;
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

      res.render("profile", { user, error, getUsernameFromEmail });
    } catch (error) {
      res.send(error);
    }
  }

  static async addBio(req, res) {
    try {
      // console.log(req.body);
      // console.log(req.params);

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
    } catch (error) {
      const { id } = req.params;
      if (error.name === "SequelizeValidationError") {
        let msg = error.errors.map((el) => el.message);
        res.redirect(`/profile/${id}?error=${msg}`);
      } else {
        res.send(error);
      }
    }
  }

  static async addLike(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id);

      await post.increment("like");

      res.redirect(`/#post-${id}`);
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = UserController;
