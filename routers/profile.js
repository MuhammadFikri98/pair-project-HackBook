const UserController = require("../controllers/UserController");
const express = require("express");
const profile = express.Router();

///profile
profile.get("/:id", UserController.profile);
//bio profile
profile.post("/:id/bio", UserController.addBio);

module.exports = profile;
