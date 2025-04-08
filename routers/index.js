const Controller = require("../controllers/controller");
const UserController = require("../controllers/UserController");

const express = require("express");
const router = express.Router();

//register
router.get("/register", UserController.registerForm);
router.post("/register", UserController.postRegister);
//login
router.get("/login", UserController.loginForm);
router.post("/login", UserController.postLogin);

// router.use((req, res, next) => {
//   console.log(req.session);

//   if (!req.session.userId) {
//     const error = "Please login first";
//     res.redirect(`/login?error=${error}`);
//   } else {
//     next();
//   }
// });
function isLoggedIn(req, res, next) {
  console.log(req.session);

  if (!req.session.userId) {
    const error = "Please login first";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
}

function isAdmin(req, res, next) {
  console.log(req.session);

  if (!req.session.userId || req.session.role !== "admin") {
    const error = "You have no access";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
}

router.use(isLoggedIn);

//logout
router.get("/logout", UserController.getLogOut);

//home
router.get("/", Controller.home);

// router.get("/incubators/add", Controller.showAddIncubator);
// router.post("/incubators/add", Controller.addIncubator);

// router.get("/incubators/:incubatorId", Controller.seeDetailById);

// router.get("/incubators/:incubatorId/startUp/add", Controller.getStartUp);
// router.post("/incubators/:incubatorId/startUp/add", Controller.addStartUp);

// router.get(
//   "/incubators/:incubatorId/startUp/:startUpId/edit",
//   Controller.getEditStartUp
// );
// router.post(
//   "/incubators/:incubatorId/startUp/:startUpId/edit",
//   Controller.postEditStartUp
// );

// router.get(
//   "/incubators/:incubatorId/startUp/:startUpId/delete",
//   Controller.deleteStartUp
// );
// router.get("/startUp", Controller.startUp);

module.exports = router;
