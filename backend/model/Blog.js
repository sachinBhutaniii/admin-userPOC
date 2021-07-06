const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema; // for category

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

  description: {
    type: String,
    required: true,
    min: 10,
    max: 500,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  file: {
    type: String,
  },

  author: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
