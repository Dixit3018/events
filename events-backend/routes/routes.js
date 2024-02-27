require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const { ObjectId } = require("mongodb");

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const jwt_secret = process.env.JWT_SECRET;

const router = express.Router();
const User = require("../models/user");
const Cities = require("../models/cities");
const Event = require("../models/event");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});



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

function filterSensitiveData(user) {
  const filteredUser = { ...user };

  delete filteredUser.password;

  return filteredUser;
}

router.use(
  "/eventUploads",
  express.static(path.join(__dirname, "..", "public", "eventUploads"))
);

//login api
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({
      email: email,
      password: password,
      role: role,
    });

    if (user) {
      return res.status(200).json({
        message: "Login Success",
        user: filterSensitiveData(user._doc),
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
});

// register api
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const {
      uname,
      password,
      fname,
      lname,
      email,
      image,
      age,
      address,
      city,
      state,
      role,
    } = req.body;

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json("Email Exists");
    }

    // Check if a file was uploaded
    let profilePicture;
    if (req.file) {
      // If a file was uploaded, use the uploaded file
      profilePicture = req.file.path;
    } else {
      // If no file was uploaded, provide a default image path from the server
      profilePicture = "./default-image/default-profile.png"; // Adjust the path as needed
    }
    const newUser = new User({
      email: email,
      username: uname,
      firstname: fname,
      lastname: lname,
      password: password,
      age: age,
      address: address,
      city: city,
      state: state,
      role: role,
      profilePicture: profilePicture,
    });
    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        age: savedUser.age,
        address: savedUser.address,
        city: savedUser.city,
        state: savedUser.state,
        role: savedUser.role,
        profilePicture: savedUser.profilePicture,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to retrieve profile picture by user ID
router.get("/profile-picture", async (req, res) => {
  try {
    const userId = req.query._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const imagePath = path.join(__dirname, "../", user.profilePicture);

    if (fs.existsSync(imagePath)) {
      const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
      res.status(200).json({ image: imageBase64 });
    } else {
      res.status(400).json({ message: "Profile picture not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get cities
router.get("/cities", async (req, res) => {
  const data = await Cities.find().select("city admin_name").sort({ city: 1 });

  const list = data.map((val) => [val.city, val.admin_name]);

  return res.send({ data: list });
});

//Create Event
router.post(
  "/create-event",
  uploadEvent.single("eventImage"),
  async (req, res) => {
    try {
      const organizerId = req.query._id;

      const userExist = await User.findOne({ _id: new ObjectId(organizerId) });

      if (!userExist) {
        return res.status(200).json("User Not Exists");
      }

      const event = req.body;

      const coverImg = req.file.path;

      const newEvent = new Event({
        organizer_id: organizerId,
        name: event.eventName,
        venue: event.eventVenue,
        description: event.eventDescription,
        volunteers: event.eventNeededVolunteers,
        pay_per_volunteer: event.eventPayPerDay,
        start_date: new Date(event.eventStartDate),
        end_date: new Date(event.eventEndDate),
        days: event.eventDays,
        city: event.eventCity,
        state: event.eventState,
        cover_img: coverImg,
      });

      const savedEv = await newEvent.save();

      return res.status(200).json({
        message: "Event Registered Successfully",
        event_details: savedEv,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  }
);

// Get Events
router.get("/get-events", async (req, res) => {
  try {
    const organizer_id = req.query._id;

    const events = await Event.find({ organizer_id: organizer_id });

    if (events.length === 0) {
      return res.status(200).json({ msg: "No events are there!" });
    }

    const modifiedRes = await Promise.all(
      events.map(async (event) => {
        const imagePath = path.join(__dirname, "..", event.cover_img);

        const imageData = await fs.promises.readFile(imagePath, {
          encoding: "base64",
        });

        // Include base64-encoded image data in the response
        return {
          ...event._doc,
          cover_img: `data:image/jpeg;base64,${imageData}`,
        };
      })
    );

    return res.status(200).json({ events: modifiedRes });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

//get single event
router.post("/get-event", async (req, res) => {
  const id = req.body.id;
  console.log(id);
  const event = await Event.findById(id);

  const imagePath = path.join(__dirname, "..", event.cover_img);
  const imageData = await fs.promises.readFile(imagePath, {
    encoding: "base64",
  });

  const modifiedEvent = {
    ...event._doc,
    cover_img: `data:image/jpeg;base64,${imageData}`,
  };

  if (event) {
    return res.status(200).json({ event: modifiedEvent });
  } else {
    return res.status(500).json({ err: "something went wrong" });
  }
});

//edit event
router.post("/edit-event", async (req, res) => {});
// payment intent
router.post("/create-payment-intent", async (req, res) => {
  const amountInPaise = Math.round(parseInt(req.body.amount) * 100);
  await stripe.paymentIntents.create(
    {
      description: "Event Managment Service",
      shipping: {
        name: "Jenny Rosen",
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US",
        },
      },
      amount: amountInPaise,
      currency: "inr",
      payment_method_types: ["card"],
    },
    function (err, paymentIntent) {
      if (err) {
        return res.status(500).json(err.message);
      } else {
        return res.status(201).json(paymentIntent);
      }
    }
  );
});

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
      const imagePath = path.join(__dirname, "../", user.profilePicture);
      const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const sanitizedUser = { ...updatedUser._doc };
      delete sanitizedUser.password;

      return res.status(200).json({
        message: "Profile picture updated successfully",
        user: sanitizedUser,
        profileImg: imageBase64,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

//update user information
router.post("/update-user", async (req, res) => {
  try {
    const userId = req.query._id;
    const userData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.firstname = userData.firstname;
    user.lastname = userData.lastname;
    user.username = userData.username;
    user.age = userData.age;
    user.email = userData.email;
    user.address = userData.address;
    user.state = userData.state;
    user.city = userData.city;

    const updatedUser = await user.save();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const sanitizedUser = { ...updatedUser._doc };
    delete sanitizedUser.password;

    return res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "user not exists" });
    }

    const secret = jwt_secret + user.password;
    const token = jwt.sign({}, secret, { expiresIn: "15m" });
    const link = `http://localhost:4200/reset-password/${user._id}/${token}`;

    const sendmailOptions = {
      from: {
        name: "Dixit Suthar",
        address: process.env.GMAIL_USER,
      }, // sender address
      to: ["suthardixit.ite@gmail.com"],
      subject: "Reset Password testing!",
      text: "Password Reset Link!",
      html: `<a href='http://localhost:4200/reset-password/${user._id}/${token}'>Click Here to Reset Password<a>`,
    };

    const info = await transporter.sendMail(sendmailOptions)

    return res.status(200).json({
      link: link,
      info: info.messageId,
      userId: user._id,
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    if(id === '' || token === ''){
      return res.status(401).json({message: "Unauthorized"});
    }

    const user = await User.findOne({
      _id: new ObjectId(id.replace(/"/g, "")),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const secret = jwt_secret + user.password;
    const decoded = jwt.verify(token.replace(/"/g, ""), secret);

    user.password = password;
    await user.save();

    res
      .status(200)
      .json({
        message: "Password reset successfully",
        user: decoded,
        success: true,
      });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
