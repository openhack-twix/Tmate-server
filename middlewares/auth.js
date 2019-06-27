const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const config = require('config');
const express = require('express');

module.exports = exports = function (req, res, next) {
  const token = req.headers['x-auth-token'] || req.query.token;
  if(!token) return res.status(401).send('Unauthorized')

  try {
    const decoded = jwt.verify(token, process.env.jwtKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send('Invalid token');
  }
}