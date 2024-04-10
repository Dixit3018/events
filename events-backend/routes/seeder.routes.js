const express = require('express')
const router = express.Router();

const dbSeederController = require("../controllers/dbSeeder.controller");

// get cities to select
router.get("/cities", dbSeederController.getCities);

module.exports = router;