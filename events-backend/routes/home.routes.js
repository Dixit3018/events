const express = require('express')
const router = express.Router();

const homeController = require("../controllers/home.controller");

// contact form data
router.post("/contact-form", homeController.contactInfo);

// get basic home page dynamic data
router.get("/homepage-details", homeController.homePageData);

module.exports = router;