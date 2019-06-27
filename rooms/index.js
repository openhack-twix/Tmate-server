const { Room } = require("../models/room");
const { User } = require("../models/user");
// const logger = require('../logger');

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
          if (err) return socket.emit("create fail");
          socket.emit("create success", { roomid: room._id });
          console.log(`${userid}가 방 생성: ${room}`);
          // logger.info(`${userid}가 방 생성: ${room}`);
        });
      }
    );

    socket.on("join", async ({ roomid, userid }) => {
      // for (let id in socket.rooms) {
      //   if (id === roomid){
      //     socket.emit("join failed", "already joined room");
      //     return console.log("join failed: already joined room")
      //   }
      // }

      const room = await Room.findById(roomid);
      if (!room) {
        socket.emit("join failed", "no room with given id");
        return console.log(`joined failed: no room with given id: ${roomid}`);
      }

      const user = await User.findById(userid);
      if (!user) {
        socket.emit("join failed", "no user with given id");
        return console.log(`joined failed: no user with given id: ${user.id}`);
      }

      socket.join(roomid, err => {
        if (err) {
          socket.emit("join failed");
          return console.log('joined failed');
        }

        const { logs, title } = room;
        socket.emit("join success", { logs, title });
        console.log(`${user.nickname}이 방 ${roomid}에 join 성공.`);
        // logger.info(`${user.nickname}이 방 ${roomid}에 join 성공.`);
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
        user: user.nickname,
        message
      });
      await room.save();
      console.log(`send: ${user.nickname} / ${message}`);

      socket.emit("send success");
      socket.to(roomid).emit("receive message", {
        user: { name: user.name, colorcode: user.colorcode },
        message
      });
    });
  });
};
