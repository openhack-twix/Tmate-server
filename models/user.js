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
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(v);
      },
      message: props => `${props.value} is invalid email form.`
    }
  },
  password: {
    type: String,
    min: [5, "Too short password."],
    max: [255, "Too long to type in, isn't it?"]
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.createToken = function() {
  return jwt.sign(
    _.pick(this, ["_id", "username", "isAdmin"]),
    process.env.jwtKey
  );
};

const User = mongoose.model("User", userSchema);

const schema = {
  username: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(5)
    .max(255),
  isAdmin: Joi.bool().default(false)
};
function validate(user) {
  return Joi.validate(user, schema);
}

module.exports = exports = { User, validate };
