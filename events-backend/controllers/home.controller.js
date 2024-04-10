require("dotenv").config();
const Utils = require("../utils/utils");

const Contact = require("../models/contactInfo.model");
const Event = require("../models/event.model");
const Users = require("../models/user.model");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const contactInfo = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    await Contact.create({
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

    const info = await transporter.sendMail(sendmailOptions);

    return res.status(200).json({ message: "success", info });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error", error });
  }
};

const homePageData = async (req, res) => {
  const users = await Users.find();
  const events = await Event.find();

  let organizers = 0;
  let volunteers = 0;
  let newScheduledEvents = 0;
  let idealEvents = 0;

  const upcomingEvents = [];
  const ongoingEvents = [];
  const completedEvents = [];

  const usersPromise = users.map((event) => {
    if (event.role == "organizer") {
      organizers += 1;
    }
    if (event.role == "volunteer") {
      volunteers += 1;
    }
  });

  const eventsPromise = events.map((event) => {
    if (new Date(event.start_date) > new Date()) {
      newScheduledEvents += 1;
    }
    if (new Date(event.end_date) < new Date()) {
      idealEvents += 1;
    }
  });

  const eventDataPromise = events.map(async (event) => {
    if (
      new Date(event.start_date).toISOString().substring(0, 10) >
      new Date().toISOString().substring(0, 10)
    ) {
      upcomingEvents.push({
        key: "Upcoming",
        date: event.start_date,
        image: await Utils.imagePathToBase64(event.cover_img),
        location: event.city + "," + event.state,
        description: event.description,
      });
    }
    if (
      new Date(event.start_date).toISOString().substring(0, 10) ==
      new Date().toISOString().substring(0, 10)
    ) {
      ongoingEvents.push({
        key: "Ongoing",
        date: event.start_date,
        image: await Utils.imagePathToBase64(event.cover_img),
        location: event.city + "," + event.state,
        description: event.description,
      });
    } else {
      completedEvents.push({
        key: "Completed",
        date: event.start_date,
        image: await Utils.imagePathToBase64(event.cover_img),
        location: event.city + "," + event.state,
        description: event.description,
      });
    }
  });

  await Promise.all(eventsPromise, usersPromise, eventDataPromise);

  return res.status(200).json({
    message: "success",
    organizers,
    volunteers,
    newScheduledEvents,
    idealEvents,
    upcomingEvents,
    ongoingEvents,
    completedEvents,
  });
};

module.exports = { contactInfo, homePageData };
