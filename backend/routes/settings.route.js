const express = require("express");
const route = express.Router();
const settingsController = require("../controllers/settings.controller");
const { auth } = require("../middleware/auth.middleware");

// Protect all settings routes with admin authentication
route.use(auth);

route.get("/", settingsController.getSettings);
route.put("/", settingsController.updateSettings);

module.exports = route;
