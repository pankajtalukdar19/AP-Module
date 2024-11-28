const express = require("express");
const route = express.Router();
const userController = require("../controllers/user.controller");
const { auth } = require("../middleware/auth.middleware");

route.post("/", userController.create);
route.get("/", userController.getAll);
route.get("/:id", userController.getUserById);
route.delete("/:userId", auth, userController.deleteUser);
route.put("/:userId", auth, userController.updateUser);
module.exports = route;
