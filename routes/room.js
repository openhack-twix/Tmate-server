const express = require("express");
const {Room} = require('../models/room');
const router = express.Router();
const roomService = require('../services/rooms');

router.get("/", async (req, res) => {
  const rooms = await roomService.getRooms();
  res.send(rooms);
});

router.get("/:city", async (req, res) => {
  const rooms = await roomService.getLocalRooms(req.params.city);
  res.send(rooms);
});

module.exports = router;