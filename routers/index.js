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

//home
router.get("/", isLoggedIn, UserController.home);

//post
router.use("/post", require("./post"));

//profile
router.use("/profile", require("./profile"));

module.exports = router;
