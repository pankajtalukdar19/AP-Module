const express = require("express");
const route = express.Router();
const settingsController = require("../controllers/settings.controller");
const { auth } = require("../middleware/auth.middleware");

route.post("/", auth, settingsController.create);
route.get("/", auth, settingsController.getAll);
route.put("/:id", auth, settingsController.update);
module.exports = route;
