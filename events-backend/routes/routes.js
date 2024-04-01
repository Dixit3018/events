require("dotenv").config();
const express = require("express");
const path = require("path");

const multer = require("multer");

//controllers
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const dbSeederController = require("../controllers/dbSeeder.controller");
const eventController = require("../controllers/event.controller");
const taskController = require("../controllers/task.controller");
const homeController = require("../controllers/home.controller");
const chatController = require("../controllers/chat.controller");
const activityController = require("../controllers/activity.controller");
const feedbackController = require("../controllers/feedback.controller");

const stripeController = require("../controllers/stripe.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const storageEv = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./eventUploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "EV_" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const uploadEvent = multer({ storage: storageEv });

router.use(
  "/eventUploads",
  express.static(path.join(__dirname, "..", "public", "eventUploads"))
);

//============================ Home Controller ============================

router.post("/contact-form", homeController.contactInfo);

//============================ Db Seeder Controller ============================

// get cities
router.get("/cities", dbSeederController.getCities);

//============================ Auth Controller ============================

//Login
router.post("/login", authController.login);

//Register
router.post("/register", upload.single("image"), authController.register);

// forgot password
router.post("/forgot-password", authController.forgotPassword);

// reset password
router.post("/reset-password/:id/:token", authController.resetPassword);

//Verify Token
router.post("/verify-token", authController.verifyToken);

//============================ Payment Intent =============================

router.post("/create-payment-intent", stripeController.paymentIntent);

//============================ User Controller ============================

//--------------- Common functions

//update user information
router.put("/update-user", userController.updateUser);

//update profile image
router.put(
  "/update-profile-img",
  upload.single("profile_picture"),
  userController.updateProfileImage
);

//dashboard data
router.get("/dashboard-data", userController.getDashboardData);

//--------------- Volunteer functions

//get organizer details
router.post("/get-organizer-data", userController.getOrganizerData);

//apply on event
router.post("/apply-event", userController.applyOnEvent);

// get applied events
router.get("/get-applied-events", userController.getAppliedEvents);

// get completed events
router.get("/get-completed-events", userController.getCompletedEvents);

//----------------- Organizer functions

//get volunteers
router.get("/get-volunteers", userController.getVolunteers);

//get a volunteer details
router.get("/get-volunteer", userController.getVolunteerDetails);

// get application list
router.get("/application-list", userController.getApplications);

// update application status
router.put("/update-application-status", userController.responseToApplication);


//============================ Feedback Controller ============================

//feedback to volunteer
router.post("/feedback-to-volunteer", feedbackController.giveFeedbackToVolunteer);

//get event feedbacks
router.get("/get-event-feedbacks", feedbackController.getEventFeedbacks);

//get feedback from organizer to single user
router.get("/get-feedback", feedbackController.getEventFeedback)

//============================ Event Controller ============================

// Get Events
router.get("/get-events", eventController.getEvents);

//get all events
router.get("/get-all-events", eventController.getAllEvents);

//Create Event
router.post(
  "/create-event",
  uploadEvent.single("eventImage"),
  eventController.createEvent
);

//get single event
router.post("/get-event", eventController.getSingleEvent);

//============================ Task Controller ============================

// get task
router.get("/get-task", taskController.getTask);

// Update task list
router.put("/update-status", taskController.updateStatus);

// Add task
router.post("/add-task", taskController.addTask);

//============================ Chat Controller ============================

router.post("/chat-history", chatController.getChatHistory);

router.get("/get-single-user", chatController.getSingleUser);

router.get("/get-users", chatController.getAllUsers);

router.put("/create-message-instance", chatController.createMessageInstance)

//============================ Activity Controller ============================

router.post("/track-user-activity", activityController.trackUserActivity);

router.get("/get-activity", activityController.getActivity);

module.exports = router;
