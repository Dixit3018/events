const express = require("express");
const router = express.Router();

const feedbackController = require("../controllers/feedback.controller");

// feedback to volunteer
router.post(
  "/feedback-to-volunteer",
  feedbackController.giveFeedbackToVolunteer
);

// get event feedbacks
router.get("/get-event-feedbacks", feedbackController.getEventFeedbacks);

//get feedback from organizer to single user
router.get("/get-feedback", feedbackController.getEventFeedback);

module.exports = router;