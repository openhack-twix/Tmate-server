const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    required: true
  },
  content: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    minlength: 1,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  due: {
    type: Date
  },
  logs: {
    type: Array,
    default: []
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

const Room = mongoose.model("Room", roomSchema);

module.exports = exports = { Room };
