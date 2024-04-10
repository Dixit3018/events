const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ 
  email: { type: String, required: true, unique: true},
  username: { type: String, required: true, unique: true},
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: String, default: 0 },
  profilePicture: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
