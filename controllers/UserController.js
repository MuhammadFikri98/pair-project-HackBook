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
    const { error } = req.query;

    res.render("register-form", { error });
  }
  static postRegister(req, res) {
    // console.log(req.body);
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      const error = "All fields are required!";
      return res.redirect(`/register?error=${error}`);
    }

    User.create({ email, password, role })
      .then((newUser) => {
        res.redirect("/login");
      })
      .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          const errorMsg = err.errors.map((e) => e.message).join(", ");
          res.redirect(`/register?error=${errorMsg}`);
        } else {
          res.send(err);
        }
      });
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
      const tags = await Tag.findAll();

      res.render("addPost", { error, tags });
    } catch (error) {
      res.send(error);
    }
  }

  static async addPost(req, res) {
    try {
      const { title, content, tags } = req.body;
      const imgUrl = req.file ? `uploads/${req.file.filename}` : "";
      // Ambil path gambar dari file yang di-upload
      const UserId = req.session.userId;

      const newPost = await Post.create({
        title,
        content,
        imgUrl,
        like: 0,
        UserId,
      });

      if (tags) {
        const tagIds = Array.isArray(tags) ? tags : [tags]; // support single/multiple
        const postTags = tagIds.map((tagId) => ({
          PostId: newPost.id,
          TagId: +tagId,
        }));
        await Post_Tag.bulkCreate(postTags);
      }

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
      let { error } = req.query;
      // console.log(req.params);
      let { id } = req.params;

      let post = await Post.findByPk(id, {
        include: { model: Post_Tag, include: Tag },
      });

      const tags = await Tag.findAll();

      res.render("editPost", { post, tags, error });
    } catch (error) {
      res.send(error);
    }
  }

  static async editPost(req, res) {
    try {
      let { id } = req.params;
      const { title, content, tags } = req.body;

      const post = await Post.findByPk(id);

      // Cek hak akses
      // if (req.session.role !== "admin" && req.session.userId !== post.UserId) {
      //   const error = "You have no access to edit this post";
      //   return res.redirect(`/?error=${error}`);
      // }

      let updateData = { title, content };
      if (req.file) {
        updateData.imgUrl = `uploads/${req.file.filename}`;
      }

      await Post.update(updateData, { where: { id } });

      // Hapus relasi lama
      await Post_Tag.destroy({ where: { PostId: id } });

      if (tags) {
        const tagIds = Array.isArray(tags) ? tags : [tags];
        const postTags = tagIds.map((tagId) => ({
          PostId: +id,
          TagId: +tagId,
        }));
        await Post_Tag.bulkCreate(postTags);
      }

      res.redirect("/");
    } catch (error) {
      let { id } = req.params;
      if (error.name === "SequelizeValidationError") {
        let msg = error.errors.map((el) => el.message);
        res.redirect(`/post/edit/${id}?error=${msg}`);
      } else {
        res.send(error);
      }
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);

      await Post_Tag.destroy({ where: { PostId: id } });

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
      // FIX PATH GAMBAR
      if (user.Posts && user.Posts.length > 0) {
        user.Posts = user.Posts.map((post) => {
          // Tambahkan '/' di depan imgUrl kalau belum ada
          if (
            post.imgUrl &&
            !post.imgUrl.startsWith("/") &&
            !post.imgUrl.startsWith("http")
          ) {
            post.imgUrl = `/${post.imgUrl}`;
          }
          return post;
        });
      }

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
