require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// check if any value is nullified
const isValueNull = (entity, message) => {
  if (entity === null || entity === undefined || entity === "") {
    throw new Error(message);
  }
};

//filter passsword
function filterSensitiveData(user) {
  const filteredUser = { ...user };

  delete filteredUser.password;

  return filteredUser;
}

// func to get userid from token
const getUserIdFromToken = (req) => {
  try {
    const token = req.headers.authorization;

    const decodedToken = jwt.verify(token.slice(7), process.env.JWT_SECRET);
    return decodedToken.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

//func for image path to base 64
/**
 * 
 */
imagePathToBase64 = (imagePath) => {
  const imgPath = path.join(__dirname, "../", imagePath);

  if (fs.existsSync(imgPath)) {
    const imageBase64 = fs.readFileSync(imgPath, { encoding: "base64" });
    return `data:image/png;base64,${imageBase64}`;
  } else {
    return new Error("Image not found");
  }
};


/**
 * Calculate earnings 
 * @param {*} event - The event object
 * @returns - The earnings
 */
const calculateEarnings = (event) => {
  const earnings = event.days * event.pay_per_volunteer;
  return earnings;
};

//calculate expense
const calculateExpenses = (event) => {
  const earnings = event.days * event.pay_per_volunteer * event.volunteers;

  return earnings;
};

module.exports = {
  isValueNull,
  filterSensitiveData,
  getUserIdFromToken,
  imagePathToBase64,
  calculateEarnings,
  calculateExpenses,
};
