const socketio = require("socket.io");
const getFakeUser = require("./debugHelper");
const { Room } = require("../models/room");

const Areas = require("../areas");

function getUserFromToken(token) {
  try {
    return jwt.verify(token, process.env.jwtKey);
  } catch (error) {
    return null;
  }
}

module.exports = exports = http => {
  const io = socketio(http);
  io.on("connection", function(socket) {
    socket.on("init", (authToken, areaName) => {
      /********** DEBUG ************/
      // const user = getUserFromToken(authToken);
      const user = getFakeUser(socket.id);

      const area = Areas.addUser(areaName, socket.id, user);
      if (!area) socket.emit("init failed");
    });

    socket.on("create room", async (authToken, areaName, room) => {
      const { title, content } = room;
      /********** DEBUG ************/
      // const user = getUserFromToken(authToken);
      const user = getFakeUser(socket.id);

      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 3);
      room = await new Room({
        title,
        content,
        author: user,
        expirationTime
      }).save();

      socket.join(room._id, err => {
        if (err) return console.error(`Failed to enter the room:${room._id}`);
        socket.emit("create success", room);
      });

    });

    socket.on("join", async (authToken, roomId) => {
      const room = await Room.findOne({_id: roomId});
      if(!room || !io.sockets.adapter.rooms) socket.emit('join failed', 'no room with given id');
      socket.join(roomId, err => {
        if (err) socket.emit("join failed");

        /********** DEBUG ************/
        // const user = getUserFromToken(authToken);
        const user = getFakeUser(socket.id);
        
        socket.emit("join success", room);
      });
    });

    socket.on("leave", (authToken, areaName) => {
      /********** DEBUG ************/
      // const user = getUserFromToken(authToken);
      const user = getFakeUser(socket.id);
      socket.emit("leave success");
    });

    socket.on("disconnect", function() {
      console.log("user disconnected: ", socket.id);
    });

    socket.on("say", async (authToken, roomId, message) => {
      /********** DEBUG ************/
      // const user = getUserFromToken(authToken);
      const user = getFakeUser(socket.id);

      const room = await Room.findById(roomId);
      room.logs.push({ user: user.name, message});
      await room.save();

      socket.to(roomId).emit('receive message', message);
    });
  });
};
