const express = require("express");
const { Room } = require("../models/room");
const router = express.Router();

router.get("/", async (req, res) => {
  const rooms = await Room.find().select('-__v');
  rooms.filter(room => new Date() < room.due);
  res.send(rooms);
});

router.get("/:city", async (req, res) => {
  const rooms = await Room.find({ city: req.params.city }).select('-__v');
  rooms.filter(room => new Date() < room.due);
  res.send(rooms);
});

router.delete('/:roomid', async (req,res)=>{
  const room = await Room.findByIdAndDelete(req.params.roomid).select('-__v');
  res.send(room);
});

router.post('/', async (req,res)=>{
  const due = new Date();
  due.setHours(due.getHours()+3);
  const room = await new Room({...req.body, due}).save();
  res.send(room);
})

module.exports = router;
