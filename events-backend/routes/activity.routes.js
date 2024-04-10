const express = require("express");
const router = express.Router();

const activityController = require("../controllers/activity.controller");

// tracking user activities
router.post("/track-user-activity", activityController.trackUserActivity);

// get user daily activity time
router.get("/get-activity", activityController.getActivity);

module.exports = router;