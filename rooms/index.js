const getFakeUser = require("./debugHelper");
const sessionMiddleware = require("../middlewares/session");
const { Room } = require("../models/room");
const { User } = require("../models/user");

module.exports = exports = server => {
  const io = require("socket.io")(server);
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.on("connection", function(socket) {
    
    socket.on("create room", async (city, title, content, lat, lon, userid) => {
      const room = new Room({ city, title, content, lat, lon, due }).save();

      socket.join(room._id, err => {
        if (err) return console.error(`Failed to enter the room:${room._id}`);
        socket.emit("create success", room._id);
        console.log(`${userid}가 방 생성 room created!`);
      });
    });

    socket.on("join", async (roomId, userid) => {
      const room = await Room.findById(roomId);
      if (!room) socket.emit("join failed", "no room with given id");

      const user = await User.findById(userid);
      if (!user) socket.emit("join failed", "no user with given id");

      socket.join(roomId, err => {
        if (err) socket.emit("join failed");

        socket.emit("join success", room.logs);
        socket
          .to(roomId)
          .emit("receive message", {
            user: "[안내]",
            message: `${user.nickname}님이 입장하셨습니다.`
          });
      });
    });

    socket.on("leave", areaName => {
      socket.emit("leave success");
    });

    socket.on("disconnect", function() {
      console.log("user disconnected: ", socket.id);
    });

    socket.on("say", async (roomId, message, userid) => {
      // const user =
      //   socket.request.session.passport && socket.request.session.passport.user;
      // if (!user) return socket.emit("access denied");
      const user = await User.findById(userid);
      // if(!user) {...}

      console.log(`${user.name}:`, message);
      const room = await Room.findById(roomId);
      room.logs.push({
        user: user.username,
        message
      });

      socket.to(roomId).emit("receive message", { user: user.name, message });
    });
  });
};
