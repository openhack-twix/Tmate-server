const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
// const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "username is required."],
    validate: {
      validator: v => {
        return true
        // const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // return emailRegex.test(v);
      },
      message: props => `${props.value} is invalid email form.`
    }
  },
  colorcode: {
    type: String
  },
  nickname: {
    type:String,
    default: ''
  }
});

const User = mongoose.model("User", userSchema);

module.exports = exports = { User };
