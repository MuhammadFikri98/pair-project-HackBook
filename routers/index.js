const Controller = require("../controllers/controller");
const UserController = require("../controllers/UserController");

const express = require("express");
const router = express.Router();

router.get("/register", UserController.registerForm);
router.post("/register", UserController.postRegister);

router.get("/login", UserController.loginForm)

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
