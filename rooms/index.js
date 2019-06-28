const { Room } = require("../models/room");
const { User } = require("../models/user");
const logger = require("../logger");

module.exports = exports = server => {
  const io = require("socket.io")(server);

  io.on("connection", function(socket) {
    logger.info(`new connection, socketid:${socket.id}`);
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
          logger.info(`${userid}이(가) 방 생성: ${room}`);
          // logger.info(`${userid}가 방 생성: ${room}`);
        });
      }
    );

    socket.on("join", async ({ roomid, userid }) => {
      // logger.debug('============ join begin =============');
      // for (let id in socket.rooms) {
      //   if (id === roomid){
      //     socket.emit("join failed", "already joined room" );
      //     return logger.info("join failed: already joined room")
      //   }
      // }

      const room = await Room.findById(roomid);
      if (!room) {
        socket.emit("join failed", "no room with given id");
        return logger.info(`join failed: no room with given id: ${roomid}`);
      }

      const user = await User.findById(userid);
      if (!user) {
        socket.emit("join failed", "no user with given id");
        return logger.info(`join failed: no user with given id: ${userid}`);
      }

      socket.join(roomid, async err => {
        if (err) {
          socket.emit("join failed");
          return logger.info("joined failed");
        }

        if (!room.users) room.users = [];
        const alreadyExists = room.users.find(user => "" + user._id === userid);
        if (!alreadyExists) {
          room.users.push(user._id);
          await room.save();
        }

        const { logs, title } = room;
        socket.emit("join success", { logs, title });
        logger.info(`${user._id}이 방 ${roomid}에 join 성공.`);

        socket.to(roomid).emit("receive", {
          user: "[안내]",
          message: `${user.nickname}님이 입장하셨습니다.`
        });
      });

      // logger.debug('============ join end =============');
    });

    socket.on("send message", async ({ roomid, message, userid }) => {
      // logger.debug('============ send message begin =============');
      const user = await User.findById(userid);
      // if(!user) {...}

      logger.info(`${user.nickname}: ${message}`);
      const room = await Room.findById(roomid);
      room.logs.push({
        user: {
          name: user.nickname,
          colorcode: user.colorcode
        },
        message
      });
      await room.save();
      logger.info(`send: ${user.nickname} / ${message}`);

      io.in(roomid).emit("receive", {
        user: { name: user.nickname, colorcode: user.colorcode },
        message
      });

      // logger.debug('============ send message end =============');
    });

    socket.on("leave", async ({ roomid, userid }) => {
      // logger.debug('============ leave begin =============');
      const user = await User.findById(userid);
      if (!user) {
        socket.emit(`leave failed', 'no user with given id: ${userid}`);
        return logger.info(`leave failed: no user with given id ${userid}`);
      }

      const room = await Room.findById(roomid);
      if(!room) {
        socket.emit('leave failed');
        return logger.info(`${roomid}를 아이디로 가지는 room이 존재하지 않음`);
      }
      room.users = room.users.filter(user => {
        return "" + user._id != userid;
      });
      await room.save();

      logger.info(`${user.nickname}이 방 ${roomid}을  퇴장`);
      socket.emit("leave success");
      socket.to(roomid).emit("receive", {
        user: "[안내]",
        message: `${user.nickname}님이 퇴장하셨습니다.`
      });
      socket.leave(roomid);

      // logger.debug('============ leave end =============');
    });

    socket.on("disconnect", function() {
      // logger.debug('============ disconnect begin =============');
      logger.info(`user disconnected, socketid:${socket.id}`);
      // logger.debug('============ disconnect end =============');
    });
  });
};
