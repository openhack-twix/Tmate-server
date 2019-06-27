const express = require("express");
const { Room } = require("../models/room");
const router = express.Router();

router.get("/", async (req, res) => {
  const rooms = await Room.find().select('-__v');

  /***** 테스트를 위해 부등호 방향을 반대로 해 놓음. 반드시 돌려놓아야 함! *****/
  // const validRooms  = rooms.filter(room => new Date() < room.due);
  const validRooms = rooms;
  res.send(validRooms);
});

router.get("/:city", async (req, res) => {
  const rooms = await Room.find({ city: req.params.city }).select('-__v').populate('users','-__v');

  /***** 테스트를 위해 부등호 방향을 반대로 해 놓음. 반드시 돌려놓아야 함! *****/
  // const validRooms = rooms.filter(room => new Date() < room.due);
  const validRooms = rooms;
  res.send(validRooms);
});

router.delete('/:roomid', async (req,res)=>{
  const room = await Room.findByIdAndDelete(req.params.roomid).select('-__v').populate('users', '-__v');
  res.send(room);
});

router.post('/', async (req,res)=>{
  const due = new Date();
  due.setHours(due.getHours()+3);
  const room = await new Room({...req.body, due}).save().select('-__v');
  res.send(room);
})

module.exports = router;
