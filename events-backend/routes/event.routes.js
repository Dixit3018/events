const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const eventController = require("../controllers/event.controller");

router.use(
  "/eventUploads",
  express.static(path.join(__dirname, "..", "public", "uploads", "events"))
);

const storageEv = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/events");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "EV_" + file.originalname);
  },
});

const uploadEvent = multer({ storage: storageEv });

// get Events
router.get("/get-events", eventController.getEvents);

// get all events
router.get("/get-all-events", eventController.getAllEvents);

// create Event
router.post(
  "/create-event",
  uploadEvent.single("eventImage"),
  eventController.createEvent
);

// get single event
router.get("/get-event", eventController.getSingleEvent);

// Update event image
router.put(
  "/update-cover-image",
  uploadEvent.single("eventImage"),
  eventController.updateEventImage
);

// update event data
router.put("/update-event", eventController.updateEventData);

module.exports = router;
