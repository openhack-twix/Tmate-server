const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middlewares/auth");
const { User, validate: validateUser } = require("../models/user");
const validateId = require("../models/id");

const router = express.Router();

router.get("/me", [auth], async (req, res) => {
  const id = req.user._id;
  const { error } = validateId(id);
  if (error)
    return res.status(404).send("The user with the given id does not exists.");

  const user = await User.findById(id).select("-__v -password");
  if (!user)
    return res.status(404).send("The user with the given id does not exists.");

  res.send(user);
});

router.get("/", [auth], async (req, res) => {
  const users = await User.find().select("-password -__v");
  res.send(users);
});

router.post("/", async (req, res) => {
  console.log('req.body:',req.body);
  const { username, password } = req.body;
  const user = { username, password, isAdmin: false };

  const { error } = validateUser(user);
  if (error) return res.status(400).send(error.details[0].message);

  const userAlreadyExists = await User.findOne({ username });
  if (userAlreadyExists)
    return res
      .status(400)
      .send("The user with the given username already exists.");

  const newUser = new User(user);
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  await newUser.save();
  res.send(_.pick(newUser, ["_id", "username", "isAdmin"]));
});

router.delete("/", [auth], (req, res) => {});

module.exports = exports = router;
