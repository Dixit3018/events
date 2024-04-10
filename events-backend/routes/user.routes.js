const express = require("express");
const multer = require("multer");

const router = express.Router();


const userController = require("../controllers/user.controller");

// user image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/users");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });
  const upload = multer({ storage: storage });

//--------------- Common functions

// update user information
router.put("/update-user", userController.updateUser);

//update profile image
router.put(
  "/update-profile-img",
  upload.single("profile_picture"),
  userController.updateProfileImage
);

// dashboard data
router.get("/dashboard-data", userController.getDashboardData);

//--------------- Volunteer functions

// get organizer details
router.post("/get-organizer-data", userController.getOrganizerData);

//apply on event
router.post("/apply-event", userController.applyOnEvent);

// get applied events
router.get("/get-applied-events", userController.getAppliedEvents);

// get completed events
router.get("/get-completed-events", userController.getCompletedEvents);

//----------------- Organizer functions

// get volunteers
router.get("/get-volunteers", userController.getVolunteers);

// get a volunteer details
router.get("/get-volunteer", userController.getVolunteerDetails);

// get application list
router.get("/application-list", userController.getApplications);

// update application status
router.put("/update-application-status", userController.responseToApplication);

module.exports = router;