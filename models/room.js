const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const roomSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  city: {
    type: String
  },
  lat:{
    type: Number
  },
  lon:{
    type:Number
  },
  due: {
    type: Date
  },
  logs: {
    type: Array,
    default: []
  }
});

// roomSchema.methods.createToken = function() {
//   return jwt.sign(
//     _.pick(this, ["_id", "username", "isAdmin"]),
//     config.get("jwtKey")
//   );
// };

const Room = mongoose.model("Room", roomSchema);
// const schema = {
//   username: Joi.string()
//     .email()
//     .required(),
//   password: Joi.string()
//     .min(5)
//     .max(255),
//   regDate: Joi.date().default(new Date()),
//   isAdmin: Joi.bool().default(false),
//   bike: Joi.objectId().default(null),
//   rentStart: Joi.date().default(null)
// };
// function validate(user) {
//   return Joi.validate(user, schema);
// }

module.exports = exports = { Room };
