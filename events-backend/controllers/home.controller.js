require('dotenv').config();
const Contact = require("../models/contactInfo");
const nodemailer = require("../models/nodemailer");


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
  }

  module.exports = { contactInfo }