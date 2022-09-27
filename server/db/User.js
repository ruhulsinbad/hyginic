const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please neter your email address"],
    unique: [true, "Email is already exist"],
  },

  password: {
    type: String,
    required: [true],
  },

  phone: {
    type: Number,
  },

  isVerified: {
    type: Boolean,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
