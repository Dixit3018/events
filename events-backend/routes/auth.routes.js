const express = require("express");
const multer = require("multer");

const router = express.Router();


const authController = require("../controllers/auth.controller");

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


// login
router.post("/login", authController.login);

// register
router.post("/register", upload.single("image"), authController.register);

// forgot password
router.post("/forgot-password", authController.forgotPassword);

// reset password
router.post("/reset-password/:id/:token", authController.resetPassword);

// verify Token
router.post("/verify-token", authController.verifyToken);

module.exports = router;