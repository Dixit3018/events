require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

//utils
const {
  isValueNull,
  filterSensitiveData,
  imagePathToBase64,
} = require("../utils/utils");

// models
const User = require("../models/user");
const ResetPassword = require("../models/passwordReset");

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

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    isValueNull(email, "Email Required");
    isValueNull(password, "Password Required");
    isValueNull(role, "Role Required");

    const user = await User.findOne({
      email: email,
      role: role,
    });

    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const currentTime = Date.now();
      const expiryTime = currentTime + 24 * 60 * 60 * 1000;

      user.profilePicture = await imagePathToBase64(user.profilePicture);

      return res.status(200).json({
        status: "success",
        message: "Login Success",
        user: filterSensitiveData(user._doc),
        token: token,
        expiresIn: expiryTime,
      });
    } else {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: "error", message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const {
      uname,
      password,
      fname,
      lname,
      email,
      age,
      address,
      city,
      state,
      role,
    } = req.body;

    const userEmailExist = await User.findOne({ email: email });

    const userUnameExist = await User.findOne({ username: uname });

    if (userEmailExist) {
      return res.status(400).json("Email Exists");
    }
    if (userUnameExist) {
      return res.status(400).json("Username Exists");
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const savedUser = await User.create({
      email: email,
      username: uname,
      firstname: fname,
      lastname: lname,
      password: hashPassword,
      age: age,
      address: address,
      city: city,
      state: state,
      role: role,
      profilePicture:
        req.file !== undefined ? req.file.path : "default-profile.png",
    });

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const currentTime = Date.now();
    const expiryTime = currentTime + 24 * 60 * 60 * 1000;

    savedUser.profilePicture = await imagePathToBase64(savedUser.profilePicture);
    return res.status(201).json({
      message: "User registered successfully",
      user: filterSensitiveData(savedUser._doc),
      token: token,
      expiresIn: expiryTime,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "user not exists" });
    }

    const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: "15m" });
    const link = `http://localhost:4200/reset-password/${user._id}/${token}`;

    await ResetPassword.create({
      user_id: user._id,
      token: token,
    });

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

    const info = transporter.sendMail(sendmailOptions);

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
};

const resetPassword = async (req, res) => {
  try {
    console.log("pass");
    let { id, token } = req.params;
    const { password } = req.body;
    token = token.replace(/^"|"$/g, "");
    await ResetPassword.findOneAndDelete({ token: token });

    if (id === "" || token === "") {
      console.log(token);
      console.log(id);
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({
      _id: id,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token.replace(/"/g, ""), secret);

    const hashPassword = await bcrypt.hash(password, 12);
    user.password = hashPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
      user: decoded,
      success: true,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      console.log("error of jwt");
      return res.status(401).json({ error: "Invalid token" });
    }

    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const verifyToken = async (req, res) => {
  const { token, id } = req.body;

  const resetPass = await ResetPassword.findOne({ token: token, user_id: id });
  console.log(resetPass);
  if (resetPass && resetPass.token !== "" && resetPass.token !== null) {
    return res.status(200).json({ verify: true, token: resetPass.token });
  } else {
    return res.status(401).json({ verify: false, token: null });
  }
}

module.exports = { login, register, forgotPassword, resetPassword, verifyToken };
