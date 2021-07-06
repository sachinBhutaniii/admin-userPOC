const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema; // for category

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },

  category: {
    type: ObjectId,
    ref: "Category", //from where we are pulling the id
    required: true,
  },

  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    // 1-> admin
    type: Number,
    default: 0,
  },

  file: {
    type: String,
  },

  resetToken: String,
  expireToken: String,

  status: {
    type: Number,
    default: 1, //active
  },
});

module.exports = mongoose.model("User", userSchema);
