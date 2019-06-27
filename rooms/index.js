const sessionMiddleware = require("../middlewares/session");
const { Room } = require("../models/room");
const { User } = require("../models/user");

module.exports = exports = server => {
  const io = require("socket.io")(server);

  io.on("connection", function(socket) {
    socket.on(
      "create room",
      async ({ city, title, content, lat, lon, userid }) => {
        const due = new Date();
        due.setHours(due.getHours() + 3);
        const room = await new Room({
          city,
          title,
          content,
          lat,
          lon,
          due
        }).save();

        socket.join(room._id, err => {
          if (err) return console.error(`Failed to enter the room:${room._id}`);
          socket.emit("create success", { roomid: room._id });
          console.log(`${userid}가 방 생성 room created!`);
        });
      }
    );

    socket.on("join", async ({ roomid, userid }) => {
      for (let id in socket.rooms) {
        if (id === roomid)
          return socket.emit("join failed", "already joined room");
      }

      const room = await Room.findById(roomid);
      if (!room) socket.emit("join failed", "no room with given id");

      const user = await User.findById(userid);
      if (!user) socket.emit("join failed", "no user with given id");

      console.log(`${user.nickname}이 방 ${roomid}에 join하려고 시도.`);

      socket.join(roomid, err => {
        if (err) socket.emit("join failed");

        const { logs, title } = room;
        socket.emit("join success", { logs, title });
        console.log(`${user.nickname}이 방 ${roomid}에 join 성공.`);
        socket.to(roomid).emit("receive message", {
          user: "[안내]",
          message: `${user.nickname}님이 입장하셨습니다.`
        });
      });
    });

    socket.on("leave", roomid => {
      socket.leave(roomid);
      socket.emit("leave success");
    });

    socket.on("disconnect", function() {
      console.log("user disconnected: ", socket.id);
    });

    socket.on("send", async (roomid, message, userid) => {
      const user = await User.findById(userid);
      // if(!user) {...}

      console.log(`${user.name}:`, message);
      const room = await Room.findById(roomid);
      room.logs.push({
        user: user.username,
        message
      });
      room.save();

      socket.emit("send success");
      socket.to(roomid).emit("receive message", { user: user.name, message });
    });
  });
};
