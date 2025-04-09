const multer = require("multer");
const UserController = require("../controllers/UserController");
const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

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

//register
router.get("/register", UserController.registerForm);
router.post("/register", UserController.postRegister);
//login
router.get("/login", UserController.loginForm);
router.post("/login", UserController.postLogin);

//session
router.use(isLoggedIn);

//logout
router.get("/logout", UserController.getLogOut);

//home & posting & deletepost & like & edit
router.get("/", UserController.home);

router.get("/post", UserController.getAddPost);
router.post("/post", UserController.addPost);

router.post("/post/:id/delete", UserController.deletePost);
router.post("/post/:id/like", UserController.addLike);

router.get("/edit/:id", UserController.getEditPost);
router.post("/edit/:id", UserController.editPost);

//profile
router.get("/profile/:id", UserController.profile);

//bio profile
router.post("/profile/:id/bio", UserController.addBio);

module.exports = router;
