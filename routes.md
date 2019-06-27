uri: /api/rooms/
param: x
response: 존재하는 모든 방 배열

uri: /api/rooms/city
param: city ('California')
response: city에 존재하는 room들의 배열


uri: /auth/facebook
param: x

uri: /auth/facebook/callback
param: code (facebook에서 제공하는 값)
response: 
{
  id: string, // 1323785274449315
  displayName: string, // 김정우
  provider: string // facebook
}


on: "create room"
param:
  city, title, content, lat, lon, userid
emit: "create success", roomid

on: "join"
param:
  roomid, userid
emit: "join success", logs

on: "say"
param:
  roomid, message, userid
broadcast: "receive message", {user, message}

on: "leave"
param: roomid
emit: "leave success"

on: "send"
param: roomid, message, userid
emit: 
  "receive message", {user, message}

socket.on("leave", roomid => {
      socket.leave(roomid);
      socket.emit("leave success");
    });

    socket.on("disconnect", function() {
      console.log("user disconnected: ", socket.id);
    });

    socket.on("say", async (roomid, message, userid) => {
      const user = await User.findById(userid);
      // if(!user) {...}

      console.log(`${user.name}:`, message);
      const room = await Room.findById(roomid);
      room.logs.push({
        user: user.username,
        message
      });

      socket.to(roomid).emit("receive message", { user: user.name, message });
    });