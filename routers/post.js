const multer = require("multer");
const UserController = require("../controllers/UserController");
const express = require("express");
const post = express.Router();

// Konfigurasi storage untuk Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder untuk menyimpan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Menetapkan format nama file
  },
});

// Inisialisasi Multer dengan storage yang sudah diatur
const upload = multer({ storage: storage });

//posting & deletepost & like & edit

post.get("/", UserController.getAddPost);
post.post("/", upload.single("imgUrl"), UserController.addPost);

post.post("/:id/delete", UserController.deletePost);
post.post("/:id/like", UserController.addLike);

post.get("/edit/:id", UserController.getEditPost);
post.post("/edit/:id", upload.single("imgUrl"), UserController.editPost);

module.exports = post;
