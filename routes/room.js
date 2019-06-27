const express = require("express");
const {Room} = require('../models/room');
const router = express.Router();

router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.send(rooms);
});

router.get("/:localId", async (req, res) => {
  const rooms = await Room.find({local: req.params.localId});
  res.send(rooms);
});

module.exports = router;