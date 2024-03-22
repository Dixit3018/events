require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//Utils
const { imagePathToBase64 } = require("../utils/utils");

// models
const User = require("../models/user");

const Event = require("../models/event");
const Application = require("../models/application");
const Contact = require("../models/contactInfo");
const ChatData = require("../models/chatData");
const Activity = require("../models/activity");

//controllers
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const dbSeederController = require("../controllers/dbSeeder.controller");
const eventController = require("../controllers/event.controller");
const taskController = require("../controllers/task.controller");

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

//--------------------- Auth Controller -------------------

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



//--------------------- User Controller -------------------

// Endpoint to retrieve profile picture by user ID
router.get("/profile-picture", userController.getUserProfileImage);

//update user information
router.put("/update-user", userController.updateUser);


//--------------------- Db Seeder Controller -------------------

// get cities
router.get("/cities", dbSeederController.getCities);


//--------------------- Event Controller -------------------

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


//--------------------- Task Controller -------------------

// get task
router.get("/get-task", taskController.getTask);

// Update task list
router.put("/update-status", taskController.updateStatus);

// Add task
router.post("/add-task", taskController.addTask);


//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------

//get volunteers
router.get("/get-volunteers", async (req, res) => {
  let volunteers = await User.find({ role: "volunteer" });

  for (const user of volunteers) {
    const imagePath = path.join(__dirname, "../", user.profilePicture);
    if (fs.existsSync(imagePath)) {
      const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
      user.profilePicture = `data:image/jpeg;base64,${imageBase64}`;
    }
  }
  volunteers = volunteers.map((user) => ({ ...user.toObject() }));

  if (volunteers) {
    return res.status(200).json({ volunteers: volunteers });
  } else {
    return res.status(500).json({ err: "something went wrong" });
  }
});

router.get("/get-volunteer", async (req, res) => {
  try {
    const id = req.query.userId;

    const volunteer = await User.findOne({ _id: id, role: "volunteer" }).select(
      {
        email: 1,
        profilePicture: 1,
        username: 1,
        firstname: 1,
        lastname: 1,
        role: 1,
        age: 1,
        address: 1,
        city: 1,
        state: 1,
        rating: 1,
      }
    );

    if (volunteer) {
      volunteer.profilePicture = await imagePathToBase64(
        volunteer.profilePicture
      );
    }
    res.status(200).json({ volunteer: volunteer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

// ------------------------ POST REQUESTS -------------------------

//update profile image
router.post(
  "/update-profile-img",
  upload.single("profile_picture"),
  async (req, res) => {
    try {
      const organizerId = req.body._id;
      const newProfilePicture = req.file.path;

      const user = await User.findById(organizerId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const oldProfilePicture = user.profilePicture;

      if (oldProfilePicture) {
        fs.unlink(oldProfilePicture, (err) => {
          if (err) {
            console.error("error deleting profile picture:" + err);
          } else {
            console.log("Old Profile picture deleted");
          }
        });
      }

      user.profilePicture = newProfilePicture;

      const updatedUser = await user.save();
      const imageData = imagePathToBase64(user.profilePicture);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const sanitizedUser = { ...updatedUser._doc };
      delete sanitizedUser.password;

      return res.status(200).json({
        message: "Profile picture updated successfully",
        user: sanitizedUser,
        profileImg: imageData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

//get organizer details
router.post("/get-organizer-data", async (req, res) => {
  try {
    const { id } = req.body;
    const organizer = await User.findOne({ _id: id });
    organizer.profilePicture = imagePathToBase64(organizer.profilePicture);
    res.status(200).json({ organizer: organizer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//apply on event
router.post("/apply-event", async (req, res) => {
  try {
    const { event_id, organizer_id, volunteer_id } = req.body;

    const checkAlreadyApplied = await Application.find({
      event_id: event_id,
      organizer_id: organizer_id,
      volunteer_id: volunteer_id,
    });

    if (checkAlreadyApplied.length > 0) {
      return res.status(202).json({ message: "Already applied" });
    }

    const application = new Application({
      event_id: event_id,
      organizer_id: organizer_id,
      volunteer_id: volunteer_id,
    });

    const apply = await application.save();
    return res.status(200).json({ message: "success", application: apply });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "fail", error: error.message });
  }
});

// get applied events
router.post("/get-applied-events", async (req, res) => {
  try {
    const { id } = req.body;

    const application = await Application.find({ volunteer_id: id });

    if (application.length === 0) {
      return res.status(202).json({ message: "No applications" });
    }
    return res.status(200).json({ application: application });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error", error: error.message });
  }
});

// get application list
router.post("/application-list", async (req, res) => {
  try {
    const { id } = req.body;
    let applicantDetails = [];
    const applications = await Application.find({ organizer_id: id });

    if (applications.length === 0) {
      return res.status(202).json({ message: "No applications" });
    }

    const getApplicantDetails = applications.map(async (app) => {
      const applicant = await User.findById(app.volunteer_id).select({
        email: 1,
        username: 1,
        firstname: 1,
        lastname: 1,
        age: 1,
        address: 1,
        city: 1,
        state: 1,
        rating: 1,
        profilePicture: 1,
      });

      const eventDetails = await Event.findById(app.event_id).select({
        name: 1,
        volunteers: 1,
        hired: 1,
        start_date: 1,
        end_date: 1,
      });

      applicant.profilePicture = await imagePathToBase64(
        applicant.profilePicture
      );

      return {
        application_id: app._id,
        ...app.toObject(),
        ...applicant.toObject(),
        eventDetails,
      };
    });

    applicantDetails = await Promise.all(getApplicantDetails);

    res.status(200).json({ message: "success", data: applicantDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// update application status
router.post("/update-application-status", async (req, res) => {
  try {
    const { id, status } = req.body;

    const application = await Application.findById(id);
    const event = await Event.findById(application.event_id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    application.status = status;

    if (status === "accepted") {
      event.hired = +event.hired + 1;
    }

    const updatedApplication = await application.save();
    const updatedEvent = await event.save();

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res
      .status(200)
      .json({ message: "Application updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/contact-form", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name: name,
      email: email,
      subject: subject,
      message: message,
    });

    const sendmailOptions = {
      from: {
        name: name,
        address: process.env.GMAIL_USER,
      }, // sender address
      to: ["suthardixit.ite@gmail.com"],
      subject: subject,
      text: "Conatct Info",
      html: `<h3>Contact Us</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>email:</b> ${email}</p>
      <p><b>subject:</b> ${subject}</p>
      <p><b>message:</b> ${message}</p>`,
    };

    const info = transporter.sendMail(sendmailOptions);

    return res.status(200).json({ message: "success", contactInfo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error", error });
  }
});

router.post("/chat-history", async (req, res) => {
  const { sender_id, recipent_id } = req.body;

  try {
    const chatHistory = await ChatData.findOne(
      { participants: { $all: [sender_id, recipent_id] } },
      { messages: 1 }
    );

    if (!chatHistory) {
      return res.status(200).json({ chatHistory: [] });
    }

    return res.status(200).json({ chatHistory });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-single-user", async (req, res) => {
  try {
    const id = req.query.id;
    const user = await User.findOne({ _id: id });

    if (user) {
      user.profilePicture = await imagePathToBase64(user.profilePicture);
    }
    res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.post("/get-users", async (req, res) => {
  const { id } = req.body;
  let users = await User.find({ _id: { $ne: id } });
  // let users = await User.find();

  for (const user of users) {
    const imagePath = path.join(__dirname, "../", user.profilePicture);
    if (fs.existsSync(imagePath)) {
      const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
      user.profilePicture = `data:image/jpeg;base64,${imageBase64}`;
    }
  }
  users = users.map((user) => ({ ...user.toObject() }));

  if (users) {
    return res.status(200).json({ users: users });
  } else {
    return res.status(500).json({ err: "something went wrong" });
  }
});

router.post("/track-user-activity", async (req, res) => {
  try {
    const { userId, timeSpent, date } = req.body;

    const exist = await Activity.findOne({ user_id: userId, date: date });
    if (exist) {
      exist.timeSpent = timeSpent;
      exist.save();
    } else {
      const activity = await Activity.create({
        user_id: userId,
        timeSpent: timeSpent,
        date: date,
      });
    }

    return res.status(200);
  } catch (error) {
    return res.status(500).json({ err: "something went wrong" });
  }
});

router.post("/get-activity", async (req, res) => {
  try {
    const { userId } = req.body;

    const exist = await Activity.findOne({ user_id: userId });
    if (exist) {
      return res.status(200).json({ activity: exist });
    } else {
      return res.status(200).json({ activity: null });
    }
  } catch (error) {
    return res.status(500).json({ err: error });
  }
});

module.exports = router;
