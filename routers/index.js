const UserController = require("../controllers/UserController");
const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

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

//home & posting & deletepost & like
router.get("/", UserController.home);

router.get('/post', UserController.getAddPost)
router.post("/post", UserController.addPost);

router.post("/post/:id/delete", UserController.deletePost);
router.post("/post/:id/like", UserController.addLike);



//profile
router.get("/profile/:id", UserController.profile);

//bio profile
router.post("/profile/:id/bio", UserController.addBio);

module.exports = router;
