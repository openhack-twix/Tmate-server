const express = require('express');
const Joi = require('joi');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const router = express.Router();

const authSchema = {
  username: Joi.string().email().required(),
  password: Joi.string().min(5).max(25),
}

router.get('/', (req, res) => {
  res.send('Hello world');
})

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const { error } = Joi.validate({ username, password }, authSchema);
  if (error) return res.status(400).send('Either username or password is invalid');

  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('Either username or password is invalid');

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return res.status(400).send('Either username or password is invalid');

  const token = user.createToken();
  res.header('x-auth-token', token).send({
    _id: user._id,
    username,
    token
  });
});

module.exports = exports = router;